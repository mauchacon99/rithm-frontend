import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from '../../../../../simustream-strut-dashboard/src/app/common/services/user.service';
import { OrganizationUsers } from '../../../models/organization-users';

/**
 * Component for roster management.
 */
@Component({
  selector: 'app-roster-management-modal',
  templateUrl: './roster-management-modal.component.html',
  styleUrls: ['./roster-management-modal.component.scss']
})
export class RosterManagementModalComponent implements OnInit, OnDestroy {

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject();

  /** List users the organization. */
  listUsersOrgatization!: OrganizationUsers;

  /** Pages for users in organization. */
  pageNumUsersOrganization = 1;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private userService: UserService
  ) { }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    /** Temporary parameter organizationId. */
    const organizationId = '7D2E67D8-C705-4D02-9C34-76209E53061F';
    this.getOrganizationList(organizationId, this.pageNumUsersOrganization);
  }

  /**
   * Get organization users for a specific station.
   *
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   */
  getOrganizationList(stationRithmId: string, pageNum: number): void {
    const organizationId: string = this.userService.user?.organization;
    this.stationService.getOrganizationList(organizationId, stationRithmId, pageNum)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((orgUsers) => {
        if (orgUsers) {
          this.listUsersOrgatization = orgUsers;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
