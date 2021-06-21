import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';

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
  @Input() stationId = '';

  /** Name of station. */
  @Input() stationName = '';

  /** Is the content being loaded. */
  isLoading = false;

  /** Worker roster list. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users = Array<any>();

  /** Station data from station card component. */
  station: unknown;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<RosterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: unknown) {
    this.station = data;
  }

  /**
   * Gets the users to show in dialog.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.stationService.getWorkerRoster(this.stationId)
      .pipe(first())
      .subscribe((response) => {
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
