import { Component, OnInit } from '@angular/core';
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
export class DocumentInfoDrawerComponent implements OnInit {

  /** Is the document name editable. */
  documentNameEditable = false;

  /** The station rithmId. */
  stationRithmId = '';

  constructor(private stationService: StationService,
    private errorService: ErrorService) {

  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStatusDocumentEditable(this.stationRithmId);
  }

  /**
   * Get status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   */
  getStatusDocumentEditable(stationRithmId: string): void {
    this.stationService.getStatusDocumentEditable(stationRithmId)
      .pipe(first())
      .subscribe((documentEditableStatus) => {
        if (documentEditableStatus) {
          this.documentNameEditable = documentEditableStatus;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
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
      .subscribe((documentEditableStatus) => {
        if (documentEditableStatus) {
          this.documentNameEditable = documentEditableStatus;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
