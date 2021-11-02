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

  /** List users the organization. */
  listUsersOrganization: StationRosterMember[] = [];

  /** Pages for users in organization. */
  pageNumUsersOrganization = 1;

  /** The station rithmId. */
  stationRithmId = '';

  /** Id the organization.  */
  organizationId = '';

  /** Array of list users. */
  users = [
    { firstName: 'Maggie', lastName: 'Rhee', email: 'maggie.rhee@email.com', isWorker: false, rithmId: 0, badge: 'none'},
    { firstName: 'Charles', lastName: 'Willis', email: 'charles.willis@email.com', isWorker: false, rithmId: 1, badge: 'none'},
    { firstName: 'Billie', lastName: 'Suanson', email: 'billie.suanson@email.com', isWorker: false, rithmId: 2, badge: 'none'},
    { firstName: 'Chuck', lastName: 'Brown', email: 'chuck.brown@email.com', isWorker: false, rithmId: 3, badge: 'none'},
    { firstName: 'Harrison', lastName: 'King', email: 'harrison.king@email.com', isWorker: false, rithmId: 4, badge: 'none'},
    { firstName: 'John', lastName: 'Matrix', email: 'john.matrix@email.com', isWorker: false, rithmId: 5, badge: 'none'},
    { firstName: 'Barry', lastName: 'Allen', email: 'barry.allen@email.com', isWorker: false, rithmId: 6, badge: 'none'},
    { firstName: 'Steve', lastName: 'Rogers', email: 'steve.rogers@email.com', isWorker: false, rithmId: 7, badge: 'none'},
  ];

  /** The worker roster of the station given. */
  rosterMembers: StationRosterMember[] = [];

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
    this.getStationWorkerRoster(this.stationRithmId);
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
          this.rosterMembers = data;
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
   * Receives the worker's index to change the state of the isWorker field.
   *
   * @param index The index position of the user in the list to toggle.
   */
   toggleSelectedWorker(index: number): void {
    this.users[index].isWorker = !this.users[index].isWorker;
    console.log(this.users);
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
          this.rosterMembers = data;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });

  }

  /**
   * Removes members from the station's worker roster.
   *
   * @param usersId The selected user id to remove.
   */
   removeMemberFromRoster(usersId: string): void {
    const usersIds: string[] = [];
    usersIds.push(usersId);
    this.stationService.removeUsersFromWorkerRoster(this.stationRithmId, usersIds)
      .pipe(first())
      .subscribe((data) => {
        this.rosterMembers = data;
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
