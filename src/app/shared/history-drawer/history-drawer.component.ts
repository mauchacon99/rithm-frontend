import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentEvent } from 'src/models';

/**
 * Component for the history pane of a document/station.
 */
@Component({
  selector: 'app-history-drawer',
  templateUrl: './history-drawer.component.html',
  styleUrls: ['./history-drawer.component.scss'],
})
export class HistoryDrawerComponent implements OnInit {
  /** The value of document ID. */
  documentRithmId = '';

  /** Get events for documents. */
  eventDocuments: DocumentEvent[] = [];

  /** The error if history fails . */
  eventDocumentsError = false;

  /** Loading history for documents. */
  eventDocumentsLoading = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {
    this.documentRithmId = 'E204F369-386F-4E41';
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getDocumentEvents();
  }

  /**
   * Get events for the document history.
   */
  private getDocumentEvents(): void {
    this.eventDocumentsLoading = true;
    this.documentService
      .getDocumentEvents(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (events) => {
          this.eventDocumentsLoading = false;
          this.eventDocuments = events;
        },
        error: (error: unknown) => {
          this.eventDocumentsError = true;
          this.eventDocumentsLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
