import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { RosterModalData, WorkerRosterResponse } from 'src/models';

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
  @Input() isWorker = true;

  /** The id of the station. */
  @Input() stationRithmId = '';

  /** The name of station. */
  @Input() stationName = '';

  /** Whether the content is being loaded. */
  isLoading = true;

  /** Worker roster list. */
  users = Array<WorkerRosterResponse>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: RosterModalData,
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private dialogRef: MatDialogRef<RosterModalComponent>,
  ) {
    this.stationRithmId = this.data.stationId;
  }

  /**
   * Gets the users to show in dialog.
   */
  ngOnInit(): void {
    this.dashboardService.getWorkerRoster(this.stationRithmId)
      .pipe(first())
      .subscribe((response) => {
        this.isLoading = false;
        if (response) {
          this.users = response;
        }
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.dialogRef.close();
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }

}
