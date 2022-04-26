import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentCurrentStation } from 'src/models';
/**
 * Reusable component to display a modal with the list of locations.
 */
@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent implements OnInit {
  /** Location Text of the modal for the title. */
  public locationValue = 'Location Modal';

  /** Document Id passed from parent. */
  documentRithmId = '';

  /** Use for station events history. */
  currentStations: DocumentCurrentStation[] = [];

  /** Whether the station events history is underway. */
  eventsLoading = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {}

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
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
