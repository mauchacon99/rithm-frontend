import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentCurrentStation } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { Router } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/**
 * Reusable component to display a modal with the list of locations.
 */
@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
  providers: [UtcTimeConversion],
})
export class LocationModalComponent implements OnInit {
  /** Location Text of the modal for the title. */
  public locationValue = 'Container Locations';

  /** Document Id passed from parent. */
  documentRithmId = '';

  /** Station Id passed from parent. */
  stationRithmId = '';

  /** Use for station events history. */
  currentStations: DocumentCurrentStation[] = [];

  /** The error if history fails . */
  eventDocumentsError = false;

  /** Whether the station events history is underway. */
  eventsLoading = false;

  constructor(
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) private data: LocationModalComponent,
    private dialogRef: MatDialogRef<LocationModalComponent>,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion,
    private router: Router,
    private sidenavDrawerService: SidenavDrawerService
  ) {
    this.stationRithmId = data.stationRithmId;
    this.documentRithmId = data.documentRithmId;
  }

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.getCurrentStations();
  }

  /**
   * Get the current stations from containers.
   */
  private getCurrentStations(): void {
    this.eventsLoading = true;
    this.documentService
      .getCurrentStations(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (history) => {
          this.currentStations = history;
          this.eventsLoading = false;
        },
        error: (error: unknown) => {
          this.eventsLoading = false;
          this.eventDocumentsError = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects time a document entered a station.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  getElapsedTime(timeEntered: string): string {
    return this.utcTimeConversion.getElapsedTimeText(
      this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
    );
  }

  /**
   * Navigate the user to the container page in other station.
   *
   * @param rithmId The Id of the station selected.
   */
  goToContainer(rithmId: string): void {
    this.sidenavDrawerService.closeDrawer();
    this.router.navigate([`/document/${this.documentRithmId}`], {
      queryParams: {
        documentId: this.documentRithmId,
        stationId: rithmId,
      },
    });
    this.dialogRef.close();
  }
}
