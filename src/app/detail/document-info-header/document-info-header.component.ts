import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentStationInformation, UserType, StationInformation } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Subject, takeUntil } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentNameField } from 'src/models/document-name-field';

/**
 * Reusable component for the document information header.
 */
@Component({
  selector: 'app-document-info-header[documentInformation]',
  templateUrl: './document-info-header.component.html',
  styleUrls: ['./document-info-header.component.scss'],
  providers: [UtcTimeConversion]
})
export class DocumentInfoHeaderComponent implements OnInit {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Type of user looking at a document. */
  @Input() userType!: UserType;

  /** Document information object passed from parent. */
  @Input() documentInformation!: DocumentStationInformation | StationInformation;

  /** Enum for all types of a user. */
  userTypeEnum = UserType;

  /** Document name form. */
  documentNameForm: FormGroup;

  /** Fields to Document in the station. */
  fieldsToDocument: DocumentNameField[] = [];

  constructor(
    private fb: FormBuilder,
    private sidenavDrawerService: SidenavDrawerService,
    private utcTimeConversion: UtcTimeConversion,
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {
    this.documentNameForm = this.fb.group({
      name: ['']
    });
  }

  /**
   * Disable document input element in station edit mode.
   */
  ngOnInit(): void {
    this.isStation ? this.documentNameForm.disable() : this.documentNameForm.enable();
    this.documentNameForm.controls['name'].setValue(this.documentName);
    this.getFieldsToDocument(this.documentId, this.rithmId);
  }

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects the date we're calculating against.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  getElapsedTime(timeEntered: string): string {
    return this.utcTimeConversion.getElapsedTimeText(
      this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
    );
  }

  /** Station or Document looking at document header.
   *
   * @returns Station edit mode or document mode. TRUE if station mode and FALSE if document mode.
   */
  get isStation(): boolean {
    return !('documentName' in this.documentInformation);
  }

  /** Get Document Priority of document from DocumentStationInformation based on type.
   *
   * @returns The Document Priority.
   */
  get documentPriority(): number {
    return 'documentPriority' in this.documentInformation ? this.documentInformation.documentPriority : 0;
  }

  /** Get flowed time UTC of document from DocumentStationInformation based on type.
   *
   * @returns The Flowed time UTC.
   */
  get flowedTimeUTC(): string {
    return 'flowedTimeUTC' in this.documentInformation ? this.documentInformation.flowedTimeUTC : '';
  }

  /** Get last updated UTC of document from DocumentStationInformation based on type.
   *
   * @returns The Last Updated UTC.
   */
  get lastUpdatedUTC(): string {
    return 'lastUpdatedUTC' in this.documentInformation ? this.documentInformation.lastUpdatedUTC : '';
  }

  /** Get name of document from DocumentStationInformation based on type.
   *
   * @returns The Document Name.
   */
  get documentName(): string {
    return 'documentName' in this.documentInformation ? this.documentInformation.documentName : '';
  }

  /** The id of the station or document.
   *
   * @returns The id of the station or document.
   */
  get rithmId(): string {
    return 'rithmId' in this.documentInformation ? this.documentInformation.rithmId : this.documentInformation.stationRithmId;
  }

  /**
   * The id of the document.
   *
   * @returns The id of the Document.
   */
  get documentId(): string {
    return 'documentRithmId' in this.documentInformation ? this.documentInformation.documentRithmId : '';
  }

  /**
   * Toggles the open state of the drawer for document info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'documentInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem,
      {
        rithmId: this.rithmId,
        documentId: this.documentId
      }
    );
  }

  /**
   * Get appended fields to document.
   *
   * @param documentId The id of document.
   * @param stationId  The id of station.
   */
  getFieldsToDocument(documentId: string, stationId: string): void {
    this.documentService.getFieldsToDocument(documentId, stationId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.fieldsToDocument = data;
          }
        }, error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
