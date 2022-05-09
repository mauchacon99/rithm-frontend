import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DocumentService } from 'src/app/core/document.service';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { Document, StationDocumentsModalData, UserType } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/core/user.service';
import { Router } from '@angular/router';
import { SplitService } from 'src/app/core/split.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
  /** Reference to sort table. */
  @ViewChild(MatSort) set tableSort(value: MatSort) {
    if (value) {
      this.dataSourceTable.sort = value;
    }
  }

  /** The documents to show in the modal. */
  documents: Document[] = [];

  /** Interface for list data in widget. */
  dataSourceTable!: MatTableDataSource<Document>;

  /** Columns statics to show on table. */
  displayedColumns = [
    'documentName',
    'updatedTimeUTC',
    'flowedTimeUTC',
    'userAssigned',
    'viewDocument',
  ];

  /** The current page number. */
  activeNum = 1;

  /** Is the content being loaded. */
  isLoading = true;

  /** The station rithmId. */
  private stationRithmId = '';

  /* Value of search input. */
  search = '';

  /** Total number of documents at this station. */
  totalNumDocs = 0;

  /** Role of the user. */
  userType = UserType.None;

  /** The user type enum object. */
  userTypeEnum = UserType;

  /** Whether the action to get split get container modal. */
  showContainerModal = false;

  constructor(
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public modalData: StationDocumentsModalData,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion,
    private dialogRef: MatDialogRef<StationDocumentsModalComponent>,
    private router: Router,
    private splitService: SplitService,
    private userService: UserService
  ) {
    this.stationRithmId = this.modalData.stationId;
  }

  /**
   * Gets the first page of documents on load.
   */
  ngOnInit(): void {
    this.getDocuments(1);
    this.split();
  }

  /**
   * Is the current user an admin.
   *
   * @returns Validate if user is admin.
   */
  get isUserAdmin(): boolean {
    return this.userService.isAdmin;
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
            this.dataSourceTable = new MatTableDataSource(this.documents);
            this.totalNumDocs = documentsResponse.totalDocuments;
            this.userType = documentsResponse.userType;
          }
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.closeModal();
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
    if (this.userType !== UserType.None || this.isUserAdmin) {
      //this.router.navigateByUrl(`/document/${rithmId}`);
      this.router.navigate([`/document/${rithmId}`], {
        queryParams: { documentId: rithmId, stationId: this.stationRithmId },
      });
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
  getElapsedTime(timeEntered: string): string {
    return this.utcTimeConversion.getElapsedTimeText(
      this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
    );
  }

  /**
   * Split Service for show or hidden section Admin Portal.
   */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.showContainerModal =
          this.splitService.getStationContainersModalTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects time a document entered a station.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  getElapsedTimeNewTemplate(timeEntered: string): string {
    let timeInStation: string;
    if (timeEntered && timeEntered !== 'Unknown') {
      timeInStation = this.utcTimeConversion.getElapsedTimeText(
        this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
      );
      if (timeInStation === '1 day') {
        timeInStation = ' Yesterday';
      } else {
        timeInStation += ' ago';
      }
    } else {
      timeInStation = 'None';
    }
    return timeInStation;
  }

  /**
   * Navigate the user to the document page.
   *
   * @param documentId The Id of the document to view.
   */
  goToDocument(documentId: string): void {
    this.closeModal();
    this.router.navigate(['/', 'document', documentId], {
      queryParams: {
        documentId,
        stationId: this.stationRithmId,
      },
    });
  }

  /**
   * The closeModal() function closes the modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
