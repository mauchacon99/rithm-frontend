import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';

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

  /** Given Document Name. */
  documentName!: string;

  /** Given document priority. */
  documentPriority = 0;

  /** Given Assigned User. */
  currentAssignedUser!: string;

  /** Time Doc was created. */
  flowedTimeUTC!: string;

  /** Last time Doc was updated. */
  lastUpdatedUTC!: string;

  /** Name of station doc is assigned to. */
  stationName!: string;

  /** Priority of given station. */
  stationPriority = 0;

  /** Given station supervisors. */
  supervisorRoster!: string[];

  /** Given Station worker roster.. */
  workerRoster!: string[];

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
        this.documentName = document.documentName;
        this.documentPriority = document.documentPriority;
        this.currentAssignedUser = document.currentAssignedUser;
        this.flowedTimeUTC = document.flowedTimeUTC;
        this.lastUpdatedUTC = document.lastUpdatedUTC;
        this.stationName = document.stationName;
        this.stationPriority = document.stationPriority;
        this.supervisorRoster = document.supervisorRoster;
        this.workerRoster = document.workerRoster;
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
