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
  styleUrls: ['./roster-management-modal.component.scss'],
})
export class RosterManagementModalComponent implements OnInit {
  /** List users the organization. */
  listUsersOrganization: StationRosterMember[] = [];

  /** Pages for users in organization. */
  pageNumUsersOrganization = 1;

  /** The station rithmId. */
  stationOrGroupRithmId = '';

  /** Id the organization.  */
  organizationId = '';

  /** Array of list users. */
  users: StationRosterMember[] = [];

  /** The worker roster of the station given. */
  rosterMembers: StationRosterMember[] = [];

  /** Loading current members from roster. */
  loadingMembers = false;

  /** The roster type received from modal data. */
  rosterType: 'workers' | 'owners' = 'owners';

  /** Total the of members in the list of organization members. */
  totalPotentialUsers = 0;

  /** Check if there is an error when adding or deleting the owner of the station. */
  addRemoveRosterError = false;

  /** Last rithmId performed when adding or deleting. */
  private lastUserIdClicked = '';

  /** The current page number. */
  activeNum = 1;

  /** Is the list of organization members loading.  */
  listLoading = false;

  /** Is group. */
  isGroup = false;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      /** The station rithmId. */
      stationId: string;
      /** The type of roster which will be showed.  */
      type: 'workers' | 'owners';
      /** Is group. */
      isGroup: boolean;
    }
  ) {
    this.stationOrGroupRithmId = this.modalData.stationId;
    this.rosterType = this.modalData.type;
    this.isGroup = this.modalData.isGroup;
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getPotentialStationRosterMembers(
      this.stationOrGroupRithmId,
      this.pageNumUsersOrganization
    );

    if (this.isGroup) {
      this.getStationGroupUsersRoster(this.stationOrGroupRithmId);
    } else {
      this.getStationUsersRoster(this.stationOrGroupRithmId);
    }
  }

  /**
   * Get Users Roster for a given Station.
   *
   * @param stationId The id of the given station.
   */
  getStationUsersRoster(stationId: string): void {
    this.loadingMembers = true;
    const stationUserRoster$ =
      this.rosterType === 'workers'
        ? this.stationService.getStationWorkerRoster(stationId)
        : this.stationService.getStationOwnerRoster(stationId);

    stationUserRoster$.pipe(first()).subscribe({
      next: (data) => {
        this.loadingMembers = false;
        if (data) {
          this.rosterMembers = data;
        }
      },
      error: (error: unknown) => {
        this.loadingMembers = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Get Users Roster or admins for a given StationGroup.
   *
   * @param stationGroupRithmId The id of the given stationGroup.
   */
  getStationGroupUsersRoster(stationGroupRithmId: string): void {
    this.loadingMembers = true;
    const stationGroupUserRoster$ =
      this.rosterType === 'workers'
        ? this.stationService.getStationGroupWorkerRoster(stationGroupRithmId)
        : this.stationService.getStationGroupOwnerRoster(stationGroupRithmId);

    stationGroupUserRoster$.pipe(first()).subscribe({
      next: (data) => {
        this.loadingMembers = false;
        if (data) {
          this.rosterMembers = data;
        }
      },
      error: (error: unknown) => {
        this.loadingMembers = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Get organization users for a specific station.
   *
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   */
  getPotentialStationRosterMembers(
    stationRithmId: string,
    pageNum: number
  ): void {
    this.pageNumUsersOrganization = pageNum;
    this.listLoading = true;
    this.addRemoveRosterError = false;
    this.lastUserIdClicked = '';
    const getPotentialStationRosterMembers$ = this.isGroup
      ? this.stationService.getPotentialStationGroupRosterMembers(
          stationRithmId,
          pageNum
        )
      : this.stationService.getPotentialStationRosterMembers(
          stationRithmId,
          pageNum
        );

    getPotentialStationRosterMembers$.pipe(first()).subscribe({
      next: (potentialUsers) => {
        if (potentialUsers) {
          this.users = potentialUsers.users;
          this.totalPotentialUsers = potentialUsers.totalUsers;
        }
      },
      error: (error: unknown) => {
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
      complete: () => {
        this.listLoading = false;
      },
    });
  }

  /**
   * Receives the worker's index to change the state of the isWorker field.
   *
   * @param rithmId The index position of the user in the list to toggle.
   */
  toggleSelectedUser(rithmId: string): void {
    this.lastUserIdClicked = rithmId;
    const selectedUser = this.users.find((user) => user.rithmId === rithmId);
    const rosterUserType =
      this.rosterType === 'workers' ? 'isWorker' : 'isOwner';
    if (selectedUser) {
      selectedUser[rosterUserType] = !selectedUser[rosterUserType];
      if (!selectedUser[rosterUserType]) {
        /** If data.isWorker is false is because the user is being removed. */
        if (this.isGroup) {
          this.removeMemberFromRosterGroup(rithmId);
        } else {
          this.removeMemberFromRoster(rithmId);
        }
      } else {
        /** If data.isWorker is true is because the user is being add. */
        if (this.isGroup) {
          this.addUserStationGroupToRoster(rithmId);
        } else {
          this.addUserToRoster(rithmId);
        }
      }
    }
  }

  /**
   * Adds users to the worker roster.
   *
   * @param userIds The users ids for assign in station.
   */
  addUserToRoster(userIds: string): void {
    this.loadingMembers = true;
    this.addRemoveRosterError = false;
    const addUserToRosterMethod$ =
      this.rosterType === 'workers'
        ? this.stationService.addUsersToWorkerRoster(
            this.stationOrGroupRithmId,
            [userIds]
          )
        : this.stationService.addUsersToOwnersRoster(
            this.stationOrGroupRithmId,
            [userIds]
          );

    addUserToRosterMethod$.pipe(first()).subscribe({
      next: (data) => {
        this.loadingMembers = false;
        if (data) {
          this.rosterMembers = data;
        }
      },
      error: (error: unknown) => {
        this.addRemoveRosterError = true;
        this.loadingMembers = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Adds users to the worker roster group.
   *
   * @param userIds The users ids for assign in station.
   */
  addUserStationGroupToRoster(userIds: string): void {
    this.loadingMembers = true;
    this.addRemoveRosterError = false;
    const addUserGroupToRosterMethod$ =
      this.rosterType === 'workers'
        ? this.stationService.addUserStationGroupWorkersRoster(
            this.stationOrGroupRithmId,
            [userIds]
          )
        : this.stationService.addUserStationGroupToOwnersRoster(
            this.stationOrGroupRithmId,
            [userIds]
          );
    addUserGroupToRosterMethod$.pipe(first()).subscribe({
      next: (data) => {
        this.loadingMembers = false;
        if (data) {
          this.rosterMembers = data;
        }
      },
      error: (error: unknown) => {
        this.addRemoveRosterError = true;
        this.loadingMembers = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Remove users from the station roster.
   *
   * @param usersId The selected user id to remove.
   */
  removeMemberFromRoster(usersId: string): void {
    const rosterUserType =
      this.rosterType === 'workers' ? 'isWorker' : 'isOwner';
    this.users.find((user) => {
      if (user.rithmId === usersId) {
        user[rosterUserType] = false;
      }
    });
    this.addRemoveRosterError = false;
    this.loadingMembers = true;
    const removeUserMemberRoster$ =
      this.rosterType === 'workers'
        ? this.stationService.removeUsersFromWorkerRoster(
            this.stationOrGroupRithmId,
            [usersId]
          )
        : this.stationService.removeUsersFromOwnerRoster(
            this.stationOrGroupRithmId,
            [usersId]
          );

    removeUserMemberRoster$.pipe(first()).subscribe({
      next: (data) => {
        this.loadingMembers = false;
        if (data) {
          this.rosterMembers = data;
        }
      },
      error: (error: unknown) => {
        this.addRemoveRosterError = true;
        this.loadingMembers = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Remove users from the stationGroup roster.
   *
   * @param usersId The selected user id to remove.
   */
  removeMemberFromRosterGroup(usersId: string): void {
    const rosterUserType =
      this.rosterType === 'workers' ? 'isWorker' : 'isOwner';
    this.users.find((user) => {
      if (user.rithmId === usersId) {
        user[rosterUserType] = false;
      }
    });
    this.addRemoveRosterError = false;
    this.loadingMembers = true;
    const removeUserMemberRoster$ =
      this.rosterType === 'workers'
        ? this.stationService.removeUsersFromWorkerRosterGroup(
            this.stationOrGroupRithmId,
            [usersId]
          )
        : this.stationService.removeUsersFromOwnerRosterGroup(
            this.stationOrGroupRithmId,
            [usersId]
          );

    removeUserMemberRoster$.pipe(first()).subscribe({
      next: (data) => {
        this.loadingMembers = false;
        if (data) {
          this.rosterMembers = data;
        }
      },
      error: (error: unknown) => {
        this.addRemoveRosterError = true;
        this.loadingMembers = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Switch de badge when user belongs to the station roster.
   *
   * @param user The user which will change its status.
   * @returns Check badge when user is added or None badge when is removed.
   */
  getCurrentBadge(
    user: StationRosterMember
  ): 'none' | 'check' | 'minus' | 'plus' {
    const enableBadge =
      this.rosterType === 'workers' ? user.isWorker : user.isOwner;
    return enableBadge ? 'check' : 'none';
  }

  /**
   * Check error message in station worker.
   *
   * @param rithmId The id of the user in the list to check.
   * @returns True If there is an error in the verification of the station owner.
   */
  userHadLastError(rithmId: string): boolean {
    return this.addRemoveRosterError && this.lastUserIdClicked === rithmId;
  }
}
