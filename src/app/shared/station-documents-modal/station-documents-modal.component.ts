import { Component, Inject, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/core/document.service';
import { first } from 'rxjs/operators';
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
  providers: [UtcTimeConversion],
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
  userType = UserType.None;

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
  //TODO: look into making this reusable since this method is similar to one on organization-management.component.ts
  getDocuments(pageNum: number): void {
    this.activeNum = pageNum;
    this.isLoading = true;
    this.documentService
      .getStationDocuments(this.stationRithmId, pageNum)
      .pipe(first())
      .subscribe({
        next: (documentsResponse) => {
          if (documentsResponse) {
            this.documents = documentsResponse.documents;
            this.totalNumDocs = documentsResponse.totalDocuments;
            this.userType = documentsResponse.userType;
          }
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.dialogRef.close();
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Determines if User has permission to proceed to a linked document.
   *
   * @param rithmId The rithmId property of the document we will link to.
   */
  checkDocPermission(rithmId: string): void {
    if (this.userType !== UserType.None) {
      //this.router.navigateByUrl(`/document/${rithmId}`);
      this.router.navigate([`/document/${rithmId}`], {
        queryParams: { documentId: rithmId, stationId: this.stationRithmId },
      });
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

  // TODO: get first and last names separately from API to avoid necessitating the following:
  /**
   * Gets a specified portion of a full name.
   *
   * @param fullName The full name of the assigned user.
   * @param firstLastIndex The index of the desired name portion (0 for first, 1 for last).
   * @returns The desired name.
   */
  getNamePortion(fullName: string, firstLastIndex: 0 | 1): string {
    const names = fullName.split(' ');
    return names[firstLastIndex];
  }
}
