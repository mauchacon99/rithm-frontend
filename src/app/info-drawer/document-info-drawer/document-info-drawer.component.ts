import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { StationService } from '../../core/station.service';
import { ErrorService } from '../../core/error.service';

/**
 * Component for document drawer.
 */
@Component({
  selector: 'app-document-info-drawer',
  templateUrl: './document-info-drawer.component.html',
  styleUrls: ['./document-info-drawer.component.scss']
})
export class DocumentInfoDrawerComponent {

  /** Status this document is editable. */
  statusEditableDocument = false;

  constructor(private stationService: StationService,
    private errorService: ErrorService) {

  }

  /**
   * Update status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   * @param newStatus The new status is editable in the change for document.
   */
  updateStatusDocumentEditable(stationRithmId: string, newStatus: boolean): void {
    this.stationService.updateStatusDocumentEditable(stationRithmId, newStatus)
      .pipe(first())
      .subscribe((editableDocument) => {
        if (editableDocument) {
          this.statusEditableDocument = editableDocument;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
