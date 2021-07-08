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
    this.documentService.getDocumentInfo('CEF8BC19-6308-4E8D-A254-DC67EC84530C', 'AA6AB2CD-D721-4686-B6DB-1BADD9FAE283', 'Worker')
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
