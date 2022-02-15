import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { DocumentWidget } from 'src/models';

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

  /** Show error if get documentWidget fail. */
  failedLoadDocument = false;

  constructor(
    private errorService: ErrorService,
    private dashboardService: DashboardService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.documentRithmId = JSON.parse(this.documentRithmId).documentRithmId;
  }

  /**
   * Get document widget.
   *
   * @param documentRithmId Rithm of document.
   */
  getDocumentWidget(documentRithmId: string): void {
    this.dashboardService
      .getDocumentWidget(documentRithmId)
      .pipe(first())
      .subscribe({
        next: (documentWidget) => {
          this.dataDocumentWidget = documentWidget;
          this.failedLoadDocument = false;
        },
        error: (error: unknown) => {
          this.failedLoadDocument = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
