import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { RosterModalData, StationRosterMember } from 'src/models';

/**
 * Reusable component for displaying the worker or supervisor roster for a station.
 */
@Component({
  selector: 'app-roster-modal',
  templateUrl: './roster-modal.component.html',
  styleUrls: ['./roster-modal.component.scss']
})
export class RosterModalComponent implements OnInit {

  /** Whether the modal is being used for the work roster. */
  isWorker: boolean;

  /** The id of the station. */
  stationRithmId = '';

  /** The name of station. */
  stationName = '';

  /** Whether the content is being loaded. */
  isLoading = true;

  /** Roster type. */
  roster$: Observable<StationRosterMember[]>;

  /** Worker roster list. */
  members: StationRosterMember[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: RosterModalData,
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private dialogRef: MatDialogRef<RosterModalComponent>,
  ) {
    this.stationRithmId = this.data.stationId;
    this.isWorker = this.data.isWorker;

    if (this.isWorker) {
      this.roster$ = this.dashboardService.getWorkerRoster(this.stationRithmId);
    } else {
      this.roster$ = this.dashboardService.getSupervisorRoster(this.stationRithmId);
    }
  }

  /**
   * Gets the users to show in dialog.
   */
  ngOnInit(): void {
    this.roster$
      .pipe(first())
      .subscribe({
          next: (rosterMembers) => {
          this.isLoading = false;
          if (rosterMembers) {
            this.members = rosterMembers;
          }
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.dialogRef.close();
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

}
