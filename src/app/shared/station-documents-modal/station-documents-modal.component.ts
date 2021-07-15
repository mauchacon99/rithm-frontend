import { Component, Inject, OnInit } from '@angular/core';
import { DocumentService } from '../../core/document.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/core/error.service';
import { Document, StationDocumentsModalData, UserType } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

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

  /** The documents to show in the modal. */
  documents: Document[] = [];

  /** The current page number. */
  activeNum = 1;

  /** Is the content being loaded. */
  isLoading = true;

  /** The station rithmId. */
  private stationRithmId = '';

  /** Total number of documents at this station. */
  totalNumDocs = 0;

  /** Role of the user. */
  userType = 'none';

  /** The user type enum object. */
  userTypeEnum = UserType;

  constructor(
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public modalData: StationDocumentsModalData,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion,
    private dialogRef: MatDialogRef<StationDocumentsModalComponent>,
    private router: Router
  ) {
    this.stationRithmId = this.modalData.stationId;
    // TODO: Remove this once request to get station documents is merged!
    this.stationRithmId = 'B9F1132A-6AE8-4701-8EED-B1ECC04D10D0';
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
      .subscribe((documentsResponse) => {
        console.log(documentsResponse);
        if (documentsResponse) {
          this.documents = documentsResponse.documents;
          this.totalNumDocs = documentsResponse.totalDocuments;
          this.userType = <UserType>documentsResponse.userType;
        }
        this.isLoading = false;
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.dialogRef.close();
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
    if (this.userType !== UserType.none) {
      //this.router.navigateByUrl(`/document/${rithmId}`);
      this.router.navigate(
        [`/document/${rithmId}`], { queryParams: { documentId: rithmId, stationId: this.stationRithmId }});
      this.dialogRef.close();
    }
  }

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects time a document entered a station.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  getElapsedTime(timeEntered: string): string {
    return this.utcTimeConversion.getElapsedTimeText(
      this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
    );
  }

  /**
   * Get the initials needed for a user avatar.
   *
   * @param document A given document object.
   * @returns A string of initials.
   */
  getDocInitials(document: Document): string {
    return document?.userAssigned?.split(' ')[0]?.charAt(0) + document?.userAssigned?.split(' ')[1]?.charAt(0);
  }

}
