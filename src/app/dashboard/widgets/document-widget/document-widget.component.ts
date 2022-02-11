import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardService } from '../../dashboard.service';

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
   */
  getDocumentWidget(): void {
    this.dashboardService
      .getDocumentWidget()
      .pipe(first())
      .subscribe({
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
