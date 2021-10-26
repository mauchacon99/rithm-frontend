import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { StationRosterMember } from 'src/models';

/**
 * Component for roster management.
 */
@Component({
  selector: 'app-roster-management-modal',
  templateUrl: './roster-management-modal.component.html',
  styleUrls: ['./roster-management-modal.component.scss']
})
export class RosterManagementModalComponent implements OnInit {

  /** Array of avatars. */
  rosterMembers = [{ firstName: 'Tyler', lastName: 'Hendrickson' },
  { firstName: 'Natasha ', lastName: 'Romanov' },
  { firstName: 'Clinton ', lastName: 'Barton' },
  { firstName: 'Steve', lastName: 'Rogers' },
  { firstName: 'Victor', lastName: 'Shade' }
  ];

  /** Worker Station Roster. */
  workerRosterStation: StationRosterMember[] = [];

  /** List users the organization. */
  listUsersOrgatization: StationRosterMember[] = [];

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
    @Inject(MAT_DIALOG_DATA) public modalData: {/** The station rithmId. */ stationId: string },
  ) {
    this.stationRithmId = this.modalData.stationId;
    this.organizationId = this.userService.user?.organization;
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getPotentialStationRosterMembers(this.organizationId, this.stationRithmId, this.pageNumUsersOrganization);
  }

  /**
   * Get organization users for a specific station.
   *
   * @param organizationId The id of the organization.
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   */
  getPotentialStationRosterMembers(organizationId: string, stationRithmId: string, pageNum: number): void {
    this.stationService.getPotentialStationRosterMembers(organizationId, stationRithmId, pageNum)
      .pipe(first())
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
   * Adds users to the worker roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   */
  addUsersToWorkerRoster(stationId: string, userIds: string[]): void {
    this.stationService.addUsersToWorkerRoster(stationId, userIds)
      .pipe(first())
      .subscribe((data) => {
        if (data) {
          this.workerRosterStation = data;
        }
      });
  }
}
