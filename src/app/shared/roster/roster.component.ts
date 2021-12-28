import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { RosterModalComponent } from 'src/app/shared/roster-modal/roster-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { StationRosterMember } from 'src/models';
import { RosterManagementModalComponent } from '../roster-management-modal/roster-management-modal.component';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from "src/app/core/user.service";

/**
 * Reusable component for all user/roster selection and display.
 */
@Component({
  selector: 'app-roster[stationId][isWorker]',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  //TODO: Decide if it would be better to create a model specifically for displayed rosters instead of using so many inputs.

  /** The list of members on the roster. */
  rosterMembers: StationRosterMember[] = [];

  /** Station ID. Needed for openRosterModal. */
  @Input() stationId!: string;

  /** Determines if roster is a worker or supervisor roster. Needed for openRosterModal. */
  @Input() isWorker!: boolean;

  /** Determines if this is a roster being viewed in edit mode. */
  @Input() editMode?: boolean;

  /** Whether the request is underway. */
  loadingRoster = false;

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  /** Emit the close modal. */
  @Output() modalClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  // get isUserAdminOrOwner(): boolean {
    // return this.userService.isStationOwner(this.stationInformation) || this.userService.isAdmin
  // }

  constructor(
    private dialog: MatDialog,
    private stationService: StationService,
    private errorService: ErrorService,
    private userService: UserService
    ) { }

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    this.getStationUsersRoster();
  }

  /**
   * Opens a modal with roster information.
   */
  openRosterModal(): void {
    this.dialog.open(RosterModalComponent, {
      minWidth: '325px',
      data: { stationId: this.stationId, isWorker: this.isWorker }
    });
  }

  /**
   * Opens a modal with roster management.
   */
  openManagementRosterModal(): void {
    const dialog = this.dialog.open(RosterManagementModalComponent, {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '1024px',
      disableClose: true,
      data: { stationId: this.stationId, type: this.isWorker ? 'workers' : 'owners' }
    });
    dialog.afterClosed().pipe(first()).subscribe(result => {
      this.modalClosed.emit(result);
    });
  }

  /**
   * Get Users Roster for a given Station.
   */
   private getStationUsersRoster(): void {
     this.loadingRoster = true;
    const stationUserRoster$ = this.isWorker
      ? this.stationService.getStationWorkerRoster(this.stationId)
      : this.stationService.getStationOwnerRoster(this.stationId);

    stationUserRoster$
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data) {
            this.rosterMembers = data;
            this.slices = this.rosterMembers.length > 3 ? 2 : this.rosterMembers.length;
          }
          this.loadingRoster = false;
        }, error: (error: unknown) => {
          this.loadingRoster = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }
}
