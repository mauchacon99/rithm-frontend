import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Document } from 'src/models';
import { DocumentService } from '../../core/document.service';
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
  /** Temp list of documents. */
  docsList = Array<Document>();

  /** Are the documents being loaded. */
  isLoading = false;

  constructor(private documentService: DocumentService,
    private errorService: ErrorService) { }

  /**
   * Gets a list of priority queue documents on load.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.documentService.getPriorityQueueDocuments()
      .pipe(first())
      .subscribe((res: Document[]) => {
        this.isLoading = false;
        if (res) {
          this.docsList = res;
        }
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }

}
