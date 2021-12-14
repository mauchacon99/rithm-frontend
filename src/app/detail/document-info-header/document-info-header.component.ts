
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentStationInformation, UserType, StationInformation, DocumentNameField } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { first, Subject, takeUntil } from 'rxjs';
import { StationService } from 'src/app/core/station.service';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { ActivatedRoute } from '@angular/router';

/**
 * Reusable component for the document information header.
 */
@Component({
  selector: 'app-document-info-header[documentInformation]',
  templateUrl: './document-info-header.component.html',
  styleUrls: ['./document-info-header.component.scss'],
  providers: [UtcTimeConversion]
})
export class DocumentInfoHeaderComponent implements OnInit, OnDestroy {

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Type of user looking at a document. */
  @Input() userType!: UserType;

  /** Document information object passed from parent. */
  @Input() documentInformation!: DocumentStationInformation | StationInformation;

  /** Enum for all types of a user. */
  userTypeEnum = UserType;

  /** Document Appended Fields. */
  documentAppendedFields: DocumentNameField[] = [];

  /** Document name form. */
  documentNameForm: FormGroup;

  /** Whether the Station allows edit document name or not. */
  isDocumentNameEditable!: boolean;

  /**Current document name */
  documentName = '';

  /** Id the document actually. */
  documentRithmId = '';

  constructor(
    private fb: FormBuilder,
    private sidenavDrawerService: SidenavDrawerService,
    private utcTimeConversion: UtcTimeConversion,
    private stationService: StationService,
    private documentService: DocumentService,
    private errorService: ErrorService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.documentNameForm = this.fb.group({
      name: ['']
    });

    /** Get Document Appended Fields from Behaviour Subject. */
    this.stationService.documentStationNameFields$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(appendedFields => {
        this.documentAppendedFields = appendedFields;
      });
  }

  /**
   * Disable document input element in station edit mode.
   */
  ngOnInit(): void {
    this.getParams();
    this.isStation ? this.documentNameForm.disable() : this.documentNameForm.enable();
    if (!this.isStation) {
      this.getDocumentName();
    } else {
      this.getAppendedFieldsOnDocumentName(this.stationRithmId);
    }
    this.getStatusDocumentEditable();
  }

  /**
   * Attempts to retrieve the document info from the query params in the URL and make the requests.
   */
  private getParams(): void {
    this.route.params
      .pipe(first())
      .subscribe({
        next: (params) => {
          if (params.docName) {
            this.documentRithmId = params.docName;
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

  /**
   * Station or Document looking at document header.
   *
   * @returns Station edit mode or document mode. TRUE if station mode and FALSE if document mode.
   */
  get isStation(): boolean {
    return !('documentName' in this.documentInformation);
  }

  /**
   * Get Document Priority of document from DocumentStationInformation based on type.
   *
   * @returns The Document Priority.
   */
  get documentPriority(): number {
    return 'documentPriority' in this.documentInformation ? this.documentInformation.documentPriority : 0;
  }

  /**
   * Get flowed time UTC of document from DocumentStationInformation based on type.
   *
   * @returns The Flowed time UTC.
   */
  get flowedTimeUTC(): string {
    return 'flowedTimeUTC' in this.documentInformation ? this.documentInformation.flowedTimeUTC : '';
  }

  /**
   * The id of the station or document.
   *
   * @returns The id of the station or document.
   */
  get stationRithmId(): string {
    return 'rithmId' in this.documentInformation ? this.documentInformation.rithmId : this.documentInformation.stationRithmId;
  }

  /**
   * Is the current user an owner or an admin for this station.
   *
   * @returns Validate if user is owner or admin of current station.
   */
  get isUserAdminOrOwner(): boolean {
    return this.documentInformation.stationOwners?.find((owner) => this.userService.user.rithmId === owner.rithmId) !== undefined
      ? true : false;
  }

  /**
   * Toggles the open state of the drawer for document info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'documentInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem,
      {
        stationRithmId: this.stationRithmId,
        isStation: this.isStation,
        isUserAdminOrOwner: this.isUserAdminOrOwner,
        documentRithmId: this.documentRithmId
      }
    );
  }

  /**
   * Get document name.
   */
  private getDocumentName(): void {
    this.documentService.getDocumentName(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (documentName) => {
          this.documentNameForm.controls.name.setValue(documentName);
          this.documentName = documentName;
          this.documentService.updateDocumentNameBS(documentName);
        }, error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Get appended fields to document name template.
   *
   * @param stationId  The id of station.
   */
  getAppendedFieldsOnDocumentName(stationId: string): void {
    this.stationService.getDocumentNameTemplate(stationId)
      .pipe(first())
      .subscribe({
        next: (appendedFields) => {
          if (appendedFields) {
            this.documentAppendedFields = appendedFields;
            this.stationService.updateDocumentStationNameFields(this.documentAppendedFields);
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
   * Get the station document name editable status.
   *
   */
  private getStatusDocumentEditable(): void {
    this.stationService.getStatusDocumentEditable(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (editableStatus) => {
          this.isDocumentNameEditable = editableStatus;
        }, error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Remove an appended field from document field names.
   *
   * @param index The current index to remove from appendedFields.
   */
  removeAppendedFieldFromDocumentName(index: number): void {
    const removeStartIndex = index > 0 ? index - 1 : index;
    this.documentAppendedFields.splice(removeStartIndex, 2);
    this.stationService.updateDocumentStationNameFields(this.documentAppendedFields);
  }

  /**
   * Update the Document Name Behavior Subject.
   */
  updateDocumentNameBS(): void {
    this.documentService.updateDocumentNameBS(this.documentNameForm.controls.name.value);
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
