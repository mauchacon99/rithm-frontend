import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/document.service';
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
  /** List of documents. */
  docsList = Array<Document>();

  /** Are the documents being loaded. */
  isLoading = false;

  constructor(private documentService: DocumentService,
    private errorService: ErrorService) { }

  /**
   * Gets top 5 previously started documents on load.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.documentService.getPreviouslyStartedDocuments()
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
