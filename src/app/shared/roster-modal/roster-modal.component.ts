import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

  /** Roster type. */
  @Input() isWorker = true;

  /** Id of the station. */
  @Input() stationRithmId = '';

  /** Name of station. */
  @Input() stationName = '';

  /** Is the content being loaded. */
  isLoading = false;

  /** Worker roster list. */
  users = Array<WorkerRosterResponse>();

  /** Station data from station card component. */
  station: unknown;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<RosterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RosterModalData) {
    this.stationRithmId = data.rithmId;
  }

  /**
   * Gets the users to show in dialog.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.dashboardService.getWorkerRoster(this.stationRithmId)
      .pipe(first())
      .subscribe((response: Array<WorkerRosterResponse>) => {
        this.isLoading = false;
        if (response) {
          this.users = response;
        }
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }

}
