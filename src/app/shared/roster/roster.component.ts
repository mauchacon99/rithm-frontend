import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { RosterModalComponent } from 'src/app/shared/roster-modal/roster-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { StationRosterMember } from 'src/models';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';

/**
 * Reusable component for all user/roster selection and display.
 */
@Component({
  selector: 'app-roster[stationId][isWorker]',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
})
export class RosterComponent implements OnInit {
  //TODO: Decide if it would be better to create a model specifically for displayed rosters instead of using so many inputs.

  /** Station ID. Needed for openRosterModal. */
  @Input() stationId!: string;

  /** Determines if roster is a worker or supervisor roster. Needed for openRosterModal. */
  @Input() isWorker!: boolean;

  /** Determines if this is a roster being viewed in edit mode. */
  @Input() editMode?: boolean;

  /** Determines if this is a roster being viewed in the drawer. */
  @Input() fromDrawer = false;

  /** Roster Members previewed load. */
  @Input() stationMembers!: StationRosterMember[];

  /** Emit the roster member length to be displayed as text.*/
  @Output() rosterMemberLength = new EventEmitter<number>();

  /** The list of members on the roster. */
  rosterMembers: StationRosterMember[] = [];

  /** Whether the request is underway. */
  loadingRoster = false;

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  constructor(
    private dialog: MatDialog,
    private stationService: StationService,
    private errorService: ErrorService
  ) {}

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    if (!this.stationMembers) {
      this.getStationUsersRoster();
    } else {
      this.rosterMembers = this.stationMembers;
      this.validateRostersLength(this.rosterMembers);
    }
  }

  /**
   * Opens a modal with roster information.
   */
  openRosterModal(): void {
    if (this.editMode) {
      this.dialog.open(RosterModalComponent, {
        minWidth: '325px',
        data: { stationId: this.stationId, isWorker: this.isWorker },
      });
    }
  }

  /**
   * Get Users Roster for a given Station.
   */
  private getStationUsersRoster(): void {
    this.loadingRoster = true;
    const stationUserRoster$ = this.isWorker
      ? this.stationService.getStationWorkerRoster(this.stationId)
      : this.stationService.getStationOwnerRoster(this.stationId);

    stationUserRoster$.pipe(first()).subscribe({
      next: (data) => {
        this.loadingRoster = false;
        this.validateRostersLength(data);
      },
      error: (error: unknown) => {
        this.loadingRoster = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * If the data is not null, set the rosterMembers to the data, and if the rosterMembers length is.
   * Greater than 3 and the fromDrawer is false, set the slices to 2, else if the rosterMembers length.
   * Is greater than 3 and the fromDrawer is true, set the slices to 3, else set the slices to the.
   * RosterMembers length.
   *
   * @param members Members - The data that is passed in from the parent component.
   */
  validateRostersLength(members: StationRosterMember[]): void {
    if (members) {
      this.rosterMembers = members;
      this.slices =
        this.rosterMembers.length > 3 && !this.fromDrawer
          ? 2
          : this.rosterMembers.length > 3 && this.fromDrawer
          ? 3
          : this.rosterMembers.length;
    }
    if (this.fromDrawer) {
      this.rosterMemberLength.emit(this.rosterMembers.length);
    }
  }
}
