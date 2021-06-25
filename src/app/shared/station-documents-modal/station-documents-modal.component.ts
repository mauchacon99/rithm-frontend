import { Component, Inject, OnInit } from '@angular/core';
import { DocumentService } from '../../core/document.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/core/error.service';
import { Document, RosterModalData, StationDocumentsResponse } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

/**
 * Reusable component for displaying a station's documents in a modal.
 */
@Component({
  selector: 'app-station-documents-modal',
  templateUrl: './station-documents-modal.component.html',
  styleUrls: ['./station-documents-modal.component.scss'],
  providers: [UtcTimeConversion, MatTooltip]
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
    private router: Router,
    private tooltip: MatTooltip) {
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
          //to test the else statement in this.CheckDocPermission(), comment out the below line.
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
   * Determines if User has permission to proceed to a linked document.
   *
   * @param rithmId The rithmId property of the document we will link to.
   */
  checkDocPermission(rithmId: string): void {
    if (this.isOnRoster) {
      this.router.navigateByUrl(`/document/${rithmId}`);
      this.dialogRef.close();
    } else {
      //TODO: see if its possible to prevent clicks from hiding a tooltip.
      this.tooltip.message = 'You do not have permission to view this document.';
      this.tooltip.show();
      setTimeout(() => {
        this.tooltip.hide();
      }, 3000);
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

}
