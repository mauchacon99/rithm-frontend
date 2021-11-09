import { Component, OnInit } from '@angular/core';
import { Document } from 'src/models';
import { DashboardService } from '../dashboard.service';
import { ErrorService } from 'src/app/core/error.service';
import { first } from 'rxjs/operators';

/**
 * Component for priority queue section on the dashboard.
 */
@Component({
  selector: 'app-priority-queue',
  templateUrl: './priority-queue.component.html',
  styleUrls: ['./priority-queue.component.scss']
})
export class PriorityQueueComponent implements OnInit {
  /** The list of documents in the priority queue. */
  priorityQueueDocuments: Document[] = [];

  /** Whether the documents are being loaded. */
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) { }

  /**
   * Gets a list of priority queue documents on load.
   */
  ngOnInit(): void {
    this.dashboardService.getPriorityQueueDocuments()
      .pipe(first())
      .subscribe({
        next: (documents) => {
          this.isLoading = false;
          if (documents) {
            this.priorityQueueDocuments = documents;
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
