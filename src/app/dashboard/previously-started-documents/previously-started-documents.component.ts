import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';
import { ErrorService } from 'src/app/core/error.service';
import { Document } from 'src/models';

/**
 * Component for previously started documents section on the dashboard.
 */
@Component({
  selector: 'app-previously-started-documents',
  templateUrl: './previously-started-documents.component.html',
  styleUrls: ['./previously-started-documents.component.scss']
})
export class PreviouslyStartedDocumentsComponent implements OnInit {
  /** The list of documents that have been previously started. */
  previouslyStartedDocuments: Document[] = [];

  /** Whether the documents are being loaded. */
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) { }

  /**
   * Gets top 5 previously started documents on load.
   */
  ngOnInit(): void {
    this.dashboardService.getPreviouslyStartedDocuments()
      .pipe(first())
      .subscribe({
        next: (documents) => {
          this.isLoading = false;
          if (documents) {
            this.previouslyStartedDocuments = documents;
          }
        }, error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }
}
