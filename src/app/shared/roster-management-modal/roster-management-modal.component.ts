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


  /** Loading members from roster. */
  loadingMembers = true;

  /** The roster type received from modal data. */
  rosterType: 'workers' | 'owners' = 'owners';

  /** Total the of members in the list of organization members. */
  totalPotentialUsers = 0;

  /** The current page number. */
  activeNum = 1;


  /** Charging indicator from loading users.  */
  listLoading = true;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public modalData: {
      /** The station rithmId. */
      stationId: string;
      /** The type of roster which will be showed.  */
      type: 'workers' | 'owners';
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
      .subscribe({
        next: (data) => {
          if (data) {
            this.rosterMembers = data;
          }
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Get organization users for a specific station.
   *
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   */
  getPotentialStationRosterMembers(stationRithmId: string, pageNum: number): void {
    this.pageNumUsersOrganization=pageNum;
    this.loadingMembers = true;
    this.listLoading=true;
    this.stationService.getPotentialStationRosterMembers(stationRithmId, pageNum)
      .pipe(first())
      .subscribe({
        next: (potentialUsers) => {
          this.loadingMembers = false;
          this.listLoading=false;
          if (potentialUsers) {
            this.users = potentialUsers.users;
            this.totalPotentialUsers = potentialUsers.totalUsers;
          }
        },
        error: (error: unknown) => {
          this.loadingMembers = false;
          this.listLoading=false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Receives the worker's index to change the state of the isWorker field.
   *
   * @param rithmId The index position of the user in the list to toggle.
   */
  toggleSelectedUser(rithmId: string): void {
    const selectedUser = this.users.find((user) => user.rithmId === rithmId);
    const rosterUserType = this.rosterType === 'worker' ? 'isWorker' : 'isOwner';
    if (selectedUser){
      selectedUser[rosterUserType] = !selectedUser[rosterUserType];
      if (!selectedUser[rosterUserType]) {
        /** If data.isWorker is false is because the user is being removed. */
        this.removeMemberFromRoster(rithmId);
      }
    }
  }

  /**
   * Adds users to the worker roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   */
  addUsersToRoster(stationId: string, userIds: string[]): void {
    const addUserToRosterMethod$ = this.rosterType === 'workers'
      ? this.stationService.addUsersToWorkerRoster(stationId, userIds)
      : this.stationService.addUsersToOwnersRoster(stationId, userIds);
      addUserToRosterMethod$
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data) {
            this.rosterMembers = data;
          }
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Remove users to the worker roster.
   *
   * @param usersId The selected user id to remove.
   */
  removeMemberFromRoster(usersId: string): void {
    if (this.rosterType === 'workers') {
      this.stationService.removeUsersFromWorkerRoster(this.stationRithmId, [usersId])
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.rosterMembers = data;
          },
          error: (error: unknown) => {
            this.errorService.displayError(
              'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
              error
            );
          }
        });
    } else if (this.rosterType === 'owners') {
      this.stationService.removeUsersFromOwnerRoster(this.stationRithmId, [usersId])
        .pipe(first())
        .subscribe({
          next: (data) => {
            if (data) {
              this.rosterMembers = data;
            }
          },
          error: (error: unknown) => {
            this.errorService.displayError(
              'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
              error
            );
          }
        });
    }
  }
}
