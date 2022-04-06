import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { RosterManagementModalComponent } from 'src/app/shared/roster-management-modal/roster-management-modal.component';
import {
  StationGroupData,
  StationListGroup,
  StationRosterMember,
} from 'src/models';

/** Component expansions member. */
@Component({
  selector: 'app-expansion-member-group-admin[selectedItem][isAdmin]',
  templateUrl: './expansion-member-group-admin.component.html',
  styleUrls: ['./expansion-member-group-admin.component.scss'],
})
export class ExpansionMemberGroupAdminComponent {
  /** Value of selected item. */
  @Input() set selectedItem(value: StationGroupData | StationListGroup) {
    this.stationOrGroupSelected = value;
    if (!this.isGroup) {
      this.getStationsMembers();
    } else {
      // this line is temporary while done getStationsMembers for groups.
      this.members = [];
    }
  }

  /** Is admin. */
  @Input() isAdmin!: boolean;

  /** Value of selected item. */
  stationOrGroupSelected!: StationGroupData | StationListGroup;

  /** Station Members . */
  members!: StationRosterMember[];

  /** Load indicator in dashboard. */
  isLoading = false;

  /** If request getStationsMembers fail. */
  isErrorGetUsers = false;

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = false;

  /**
   * Return if selectedItem is group.
   *
   * @returns Is group.
   */
  get isGroup(): boolean {
    return 'stations' in this.stationOrGroupSelected;
  }

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private dialog: MatDialog
  ) {}

  /**
   * Get stations OwnerRoster and WorkerRoster.
   *
   */
  getStationsMembers(): void {
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
  private removeMemberFromRosterGroup(usersId: string): void {
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
}
