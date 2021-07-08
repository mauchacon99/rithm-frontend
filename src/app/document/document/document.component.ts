import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentStationInformation } from 'src/models';

/**
 * Main component for viewing a document.
 */
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  /** Whether the stations are being loaded. */
  isLoading = true;

  /** Document information. */
  documentInformation!: DocumentStationInformation;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {}

  /**
   * Establish document data.
   */
  ngOnInit(): void {
    this.documentService.getDocumentInfo('ED6148C9-ABB7-408E-A210-9242B2735B1C', 'B9F1132A-6AE8-4701-8EED-B1ECC04D10D0', 'Worker')
    .pipe(first())
    .subscribe((document) => {
      if (document) {
        this.documentInformation = document;
      }
      this.isLoading = false;
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
