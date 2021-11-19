import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { RosterModalComponent } from 'src/app/shared/roster-modal/roster-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { StationRosterMember } from 'src/models';
import { RosterManagementModalComponent } from '../roster-management-modal/roster-management-modal.component';
import { first } from 'rxjs';

/**
 * Reusable component for all user/roster selection and display.
 */
@Component({
  selector: 'app-roster[rosterMembers][rosterSize][stationName][stationId][isWorker]',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  //TODO: Decide if it would be better to create a model specifically for displayed rosters instead of using so many inputs.

  /** The list of members on the roster. */
  @Input() rosterMembers!: StationRosterMember[];

  /** The roster size. */
  @Input() rosterSize!: number;

  /** Station name. Needed for openRosterModal. */
  @Input() stationName!: string;

  /** Station ID. Needed for openRosterModal. */
  @Input() stationId!: string;

  /** Determines if roster is a worker or supervisor roster. Needed for openRosterModal. */
  @Input() isWorker!: boolean;

  /** Determines if this is a roster being viewed in edit mode. */
  @Input() editMode?: boolean;

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  /** Emit the close modal. */
  @Output() modalClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog) { }

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    if (this.rosterSize <= 3) {
      this.slices = this.rosterSize;
    }
  }

  /**
   * Opens a modal with roster information.
   */
  openRosterModal(): void {
    this.dialog.open(RosterModalComponent, {
      minWidth: '325px',
      data: { stationName: this.stationName, stationId: this.stationId, isWorker: this.isWorker }
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
}
