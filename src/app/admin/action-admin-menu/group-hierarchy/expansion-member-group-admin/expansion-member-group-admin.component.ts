import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { StationService } from 'src/app/core/station.service';
import { RosterManagementModalComponent } from 'src/app/shared/roster-management-modal/roster-management-modal.component';
import {
  StationGroupData,
  StationListGroup,
  StationRosterMember,
} from 'src/models';

/** Component expansions member. */
@Component({
  selector: 'app-expansion-member-group-admin[stationOrGroupSelected][isAdmin]',
  templateUrl: './expansion-member-group-admin.component.html',
  styleUrls: ['./expansion-member-group-admin.component.scss'],
})
export class ExpansionMemberGroupAdminComponent implements OnInit {
  /** Is admin. */
  @Input() isAdmin!: boolean;

  /** Value of selected item. */
  @Input() set stationOrGroupSelected(
    value: StationGroupData | StationListGroup
  ) {
    this._stationOrGroupSelected = value;
    if (this.isAdmin !== undefined && !this.isGroup) {
      this.getStationsMembers();
    } else {
      // this line is temporary while done getStationsMembers for groups.
      this.members = [];
    }
  }

  /**
   * Get data item station o group selected.
   *
   * @returns Data for station or group selected.
   */
  get stationOrGroupSelected(): StationGroupData | StationListGroup {
    return this._stationOrGroupSelected;
  }

  /**
   * Return if element selected is group.
   *
   * @returns Is group.
   */
  get isGroup(): boolean {
    return 'stations' in this.stationOrGroupSelected;
  }

  /** Value of selected item. */
  private _stationOrGroupSelected!: StationGroupData | StationListGroup;

  /** Station Members . */
  members: StationRosterMember[] = [];

  /** Load indicator in dashboard. */
  isLoading = false;

  /** If request getStationsMembers fail. */
  isErrorGetUsers = false;

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = false;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private dialog: MatDialog,
    private popupService: PopupService
  ) {}

  /**
   * Initialize split on page load.
   */
  ngOnInit(): void {
    if (!this.isGroup) {
      this.getStationsMembers();
    }
  }

  /**
   * Get stations OwnerRoster and WorkerRoster.
   *
   */
  private getStationsMembers(): void {
    this.isLoading = true;
    this.isErrorGetUsers = false;
    const getMembersStation$ = this.isAdmin
      ? this.stationService.getStationOwnerRoster(
          this.stationOrGroupSelected.rithmId
        )
      : this.stationService.getStationWorkerRoster(
          this.stationOrGroupSelected.rithmId
        );

    getMembersStation$.pipe(first()).subscribe({
      next: (members) => {
        this.members = members;
        this.isLoading = false;
        this.isErrorGetUsers = false;
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.isErrorGetUsers = true;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Opens a modal with roster management.
   *
   * @param event Event from button for stop propagation.
   */
  openManagementRosterModal(event: Event): void {
    event.stopPropagation();
    if (!this.isGroup) {
      const dialog = this.dialog.open(RosterManagementModalComponent, {
        panelClass: ['w-5/6', 'sm:w-4/5'],
        maxWidth: '1024px',
        disableClose: true,
        data: {
          stationId: this.stationOrGroupSelected.rithmId,
          type: this.isAdmin ? 'owners' : 'workers',
        },
      });
      dialog
        .afterClosed()
        .pipe(first())
        .subscribe(() => {
          this.getStationsMembers();
        });
    }
  }

  /**
   * Remove users from the group specific roster.
   *
   * @param usersId The selected user id to remove.
   */
  removeMemberFromRosterGroup(usersId: string): void {
    this.isLoading = true;
    this.isErrorGetUsers = false;
    const removeUserMemberRosterGroup$ = this.isAdmin
      ? this.stationService.removeUsersFromOwnerRosterGroup(
          this.stationOrGroupSelected.rithmId,
          [usersId]
        )
      : this.stationService.removeUsersFromWorkerRosterGroup(
          this.stationOrGroupSelected.rithmId,
          [usersId]
        );

    removeUserMemberRosterGroup$.pipe(first()).subscribe({
      next: (members) => {
        this.isLoading = false;
        this.isErrorGetUsers = false;
        this.members = members;
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.isErrorGetUsers = true;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Remove users from the station specific roster.
   *
   * @param usersId The selected user id to remove.
   */
  removeMemberFromRosterStation(usersId: string): void {
    this.isLoading = true;
    this.isErrorGetUsers = false;
    const removeUserMemberRosterStation$ = this.isAdmin
      ? this.stationService.removeUsersFromOwnerRoster(
          this._stationOrGroupSelected.rithmId,
          [usersId]
        )
      : this.stationService.removeUsersFromWorkerRoster(
          this._stationOrGroupSelected.rithmId,
          [usersId]
        );

    removeUserMemberRosterStation$.pipe(first()).subscribe({
      next: (members) => {
        this.isLoading = false;
        this.isErrorGetUsers = false;
        this.members = members;
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.isErrorGetUsers = true;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Confirm remove member .
   *
   * @param usersId The selected user id to remove.
   */
  async confirmRemoveMember(usersId: string): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Remove Member?',
      message: 'This cannot be undone!',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      important: true,
    });

    if (response) this.removeMemberFromRosterStation(usersId);
  }
}
