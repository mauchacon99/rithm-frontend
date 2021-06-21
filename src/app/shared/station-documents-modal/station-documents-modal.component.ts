import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../core/document.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/core/error.service';
import { Document } from 'src/models';

/**
 * Reusable component for displaying a station's documents in a modal.
 */
@Component({
  selector: 'app-station-documents-modal',
  templateUrl: './station-documents-modal.component.html',
  styleUrls: ['./station-documents-modal.component.scss']
})
export class StationDocumentsModalComponent implements OnInit {

  /** Total stations to show. */
  totalDocs = Array<Document>();

  /** PageNumbers to show. */
  pageNumbers = [1, 2, 3, 4];

  /** The current page number. */
  activeNum = 1;

  /** IsPriority element. */
  isPriority = 1;

  /** Is the content being loaded. */
  isLoading = false;

  constructor(private documentService: DocumentService,
    private errorService: ErrorService) { }

  /**
   * Gets the first page of documents on load.
   */
  ngOnInit(): void {
    this.getDocuments(1);
  }

  /**
   * Gets a page list of documents.
   *
   * @param pageNum The desired page of document results.
   */
   getDocuments(pageNum: number): void {
    this.activeNum = pageNum;
    this.isLoading = true;
    this.documentService.getStationDocuments(1, pageNum)
      .pipe(first())
      .subscribe((res: Array<Document>) => {
        if (res) {
          this.totalDocs = res;
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
