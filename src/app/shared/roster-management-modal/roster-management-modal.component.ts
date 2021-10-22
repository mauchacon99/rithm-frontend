import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { OrganizationRosterList } from 'src/models';

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
  listUsersOrgatization: OrganizationRosterList[] = [];

  /** Pages for users in organization. */
  pageNumUsersOrganization = 1;

  /** The station rithmId. */
  stationRithmId = '';

  /** Id the organization.  */
  organizationId = '';

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public modalData: {/** The station rithmId */ stationId: string; },
  ) {
    this.stationRithmId = this.modalData.stationId;
    this.organizationId = this.userService.user?.organization;
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getOrganizationList(this.organizationId, this.stationRithmId, this.pageNumUsersOrganization);
  }

  /**
   * Get organization users for a specific station.
   *
   * @param organizationId The id of the organization.
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   */
  getOrganizationList(organizationId: string, stationRithmId: string, pageNum: number): void {
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
