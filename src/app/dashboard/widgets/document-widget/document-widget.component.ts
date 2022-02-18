import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentWidget, StationList } from 'src/models';
import { Router } from '@angular/router';

/**
 * Component for list field the document how widget.
 */
@Component({
  selector: 'app-document-widget[documentRithmId]',
  templateUrl: './document-widget.component.html',
  styleUrls: ['./document-widget.component.scss'],
})
export class DocumentWidgetComponent implements OnInit {
  /** Document rithmId. */
  @Input() documentRithmId = '';

  /** Data to document list for widget. */
  dataDocumentWidget!: DocumentWidget;

  /** List of stations the document belongs to. */
  stationsOnDocument: StationList[] = [];

  /** Loading document widget. */
  isLoading = false;

  /** Show error if get documentWidget fail. */
  failedLoadWidget = false;

  constructor(
    private errorService: ErrorService,
    private documentService: DocumentService,
    private router: Router
  ) {}

  /**
   * Number of stations in the station array on dataDocumentWidget.
   *
   * @returns The number of stations.
   */
  get numberOfStationsOnDocument(): number {
    if (this.dataDocumentWidget) {
      return this.dataDocumentWidget.stations.length;
    } else {
      return 0;
    }
  }

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.documentRithmId = JSON.parse(this.documentRithmId).documentRithmId;
    this.getDocumentWidget();
  }

  /**
   * Get document widget.
   */
  getDocumentWidget(): void {
    this.isLoading = true;
    this.failedLoadWidget = false;
    this.documentService
      .getDocumentWidget(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (documentWidget) => {
          this.dataDocumentWidget = documentWidget;
          this.isLoading = false;
          this.failedLoadWidget = false;
          if (this.numberOfStationsOnDocument >= 0) {
            this.stationsOnDocument = this.dataDocumentWidget.stations;
          }
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.failedLoadWidget = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Navigate the user to the document page.
   *
   * @param stationId The Id of the station in which to view the document.
   * */
  goToDocument(stationId: string): void {
    this.router.navigate(['/', 'document', this.documentRithmId], {
      queryParams: {
        documentId: this.documentRithmId,
        stationId: stationId,
      },
    });
  }
}
