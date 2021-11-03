import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
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
  users: StationRosterMember[]=[];

  /** The worker roster of the station given. */
  rosterMembers: StationRosterMember[] = [];

  /** Charges while users are being removed. */
  loadingCurrentRosterMembers =false;

  /** The roster type received from modal data. */
  rosterType: 'worker' | 'owner' = 'owner';


  /** Total the of members in the list of organization members. */
  totalPotentialUsers = 0;


  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public modalData: {
      /** The station rithmId. */
      stationId: string;
      /** The type of roster which will be showed.  */
      type: 'worker' | 'owner';
    },
  ) {
    this.stationRithmId = this.modalData.stationId;
    this.rosterType = this.modalData.type;
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getPotentialStationRosterMembers(this.stationRithmId, this.pageNumUsersOrganization);
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
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   */
  getPotentialStationRosterMembers(stationRithmId: string, pageNum: number): void {
    this.stationService.getPotentialStationRosterMembers(stationRithmId, pageNum)
      .pipe(first())
      .subscribe((potentialUsers) => {
        if (potentialUsers) {
          this.users = potentialUsers.users;
          this.totalPotentialUsers = potentialUsers.totalUsers;
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
   * @param rithmId The index position of the user in the list to toggle.
   */
   toggleSelectedWorker(rithmId: string): void {
    this.users.filter(( data )=> {
      if (data.rithmId === rithmId ) {
          data.isWorker=!data.isWorker;
      }
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
   * Remove users to the worker roster.
   *
   * @param usersId The selected user id to remove.
   */
  removeMemberFromRoster(usersId: string): void {
    if (this.rosterType === 'worker') {
      this.loadingCurrentRosterMembers =true;
      this.stationService.removeUsersFromWorkerRoster(this.stationRithmId, [usersId])
        .pipe(first())
        .subscribe((data) => {
          this.loadingCurrentRosterMembers =false;
          this.rosterMembers = data;
        }, (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        });
    } else if (this.rosterType === 'owner') {
      this.loadingCurrentRosterMembers =true;
      this.stationService.removeUsersFromOwnerRoster(this.stationRithmId, [usersId])
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            this.loadingCurrentRosterMembers =false;
            this.rosterMembers = data;
          }
        }, (error: unknown) => {
          this.loadingCurrentRosterMembers =false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        });
    }
  }
}
