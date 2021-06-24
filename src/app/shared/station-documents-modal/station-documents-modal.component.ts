import { Component, Inject, OnInit } from '@angular/core';
import { DocumentService } from '../../core/document.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/core/error.service';
import { Document, RosterModalData, StationDocumentsResponse } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Reusable component for displaying a station's documents in a modal.
 */
@Component({
  selector: 'app-station-documents-modal',
  templateUrl: './station-documents-modal.component.html',
  styleUrls: ['./station-documents-modal.component.scss'],
  providers: [UtcTimeConversion]
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

  /** The station rithmId. */
  stationRithmId = '';

  constructor(private documentService: DocumentService,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion,
    public dialogRef: MatDialogRef<StationDocumentsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RosterModalData) {
    this.stationRithmId = data.rithmId;
  }

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
    this.documentService.getStationDocuments(this.stationRithmId, pageNum)
      .pipe(first())
      .subscribe((res: StationDocumentsResponse) => {
        if (res) {
          this.totalDocs = res.documentList;
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

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects time a document entered a station.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
   handleElapsedTime(timeEntered: string): string {
    return this.utcTimeConversion.getElapsedTimeText(
      this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
    );
  }
}
