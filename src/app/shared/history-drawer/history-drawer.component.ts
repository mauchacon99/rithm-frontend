import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DocumentEvent, DocumentStationInformation } from 'src/models';

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

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService,
    private sideNavDrawerService: SidenavDrawerService
  ) {
    this.sideNavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as DocumentStationInformation;
        this.documentRithmId = dataDrawer.documentRithmId;
      });
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
