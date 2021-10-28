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

  /** Array of avatars (Mock till the backend is ready). */
  rosterMembers = [
    { rithmId: 'user-1', firstName: 'Tyler', lastName: 'Hendrickson' },
    { rithmId: 'user-2', firstName: 'Natasha ', lastName: 'Romanov' },
    { rithmId: 'user-3', firstName: 'Clinton ', lastName: 'Barton' },
    { rithmId: 'user-4', firstName: 'Steve', lastName: 'Rogers' },
    { rithmId: 'user-5', firstName: 'Victor', lastName: 'Shade' }
  ];

  /** List users the organization. */
  listUsersOrganization: StationRosterMember[] = [];

  /** Pages for users in organization. */
  pageNumUsersOrganization = 1;

  /** The station rithmId. */
  stationRithmId = '';

  /** Id the organization.  */
  organizationId = '';

  /** The worker roster of the station given. */
  stationWorkerRoster: StationRosterMember[] = [];

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
   * Get Workers Roster for a given Station.
   *
   * @param stationId The id of the given station.
   */
  getStationWorkerRoster(stationId: string): void {
    this.stationService.getStationWorkerRoster(stationId)
      .pipe(first())
      .subscribe((data) => {
        if (data) {
          this.stationWorkerRoster = data;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
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
          this.listUsersOrganization = orgUsers;
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
          this.stationWorkerRoster = data;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Removes users from the station's worker roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected users id array to removed.
   */
  removeUsersFromWorkerRoster(stationId: string, usersIds: string[]): void {
    this.stationService.removeUsersFromWorkerRoster(stationId, usersIds)
      .pipe(first())
      .subscribe((data) => {
        this.stationWorkerRoster = data;
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
