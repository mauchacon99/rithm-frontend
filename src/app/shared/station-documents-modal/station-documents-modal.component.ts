import { Component, Inject, OnInit } from '@angular/core';
import { DocumentService } from '../../core/document.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/core/error.service';
import { Document, RosterModalData, StationDocumentsResponse } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthGuard } from 'src/app/core/auth.guard';
import { Router } from '@angular/router';

/**
 * Reusable component for displaying a station's documents in a modal.
 */
@Component({
  selector: 'app-station-documents-modal',
  templateUrl: './station-documents-modal.component.html',
  styleUrls: ['./station-documents-modal.component.scss'],
  providers: [UtcTimeConversion, AuthGuard]
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

  /** Total number of documents at this station. */
  totalNumDocs = 0;

  /** Shows if user is on worker roster. */
  isOnRoster = false;

  constructor(private documentService: DocumentService,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion,
    public dialogRef: MatDialogRef<StationDocumentsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RosterModalData,
    private router: Router) {
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
      .subscribe((res) => {
        if (res) {
          this.totalDocs = res.documentList;
          this.totalNumDocs = res.numberOfDocument;
          this.isOnRoster = res.isWorker;
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
   * Determines if User has permission to proceed to a link.
   *
   * @param rithmId The specific link.
   */
  checkLinkPermission(rithmId: string): void {
    if (this.isOnRoster) {
      this.router.navigateByUrl(`/document/${rithmId}`);
      this.closeModal();
    }
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

  /**
   * Close modal after clicking a link.
   */
   closeModal(): void {
    this.dialogRef.close();
  }
}
