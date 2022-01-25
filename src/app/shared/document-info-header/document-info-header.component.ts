import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DocumentStationInformation,
  UserType,
  StationInformation,
  DocumentNameField,
  DocumentName,
} from 'src/models';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { first, Subject, takeUntil } from 'rxjs';
import { StationService } from 'src/app/core/station.service';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Reusable component for the document information header.
 */
@Component({
  selector: 'app-document-info-header[documentInformation][isWidget]',
  templateUrl: './document-info-header.component.html',
  styleUrls: ['./document-info-header.component.scss'],
  providers: [],
})
export class DocumentInfoHeaderComponent implements OnInit, OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Type of user looking at a document. */
  @Input() userType!: UserType;

  /** Document information object passed from parent. */
  @Input() documentInformation!:
    | DocumentStationInformation
    | StationInformation;

  /** The Document how widget. */
  @Input() isWidget = false;

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

  /** Fields appended to the document name. */
  appendedDocumentName = '';

  constructor(
    private fb: FormBuilder,
    private sidenavDrawerService: SidenavDrawerService,
    private stationService: StationService,
    private documentService: DocumentService,
    private errorService: ErrorService,
    private userService: UserService
  ) {
    this.documentNameForm = this.fb.group({
      name: [''],
    });

    /** Get Document Appended Fields from Behaviour Subject. */
    this.stationService.documentStationNameFields$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((appendedFields) => {
        this.documentAppendedFields = appendedFields;
      });
  }

  /**
   * Disable document input element in station edit mode.
   */
  ngOnInit(): void {
    this.isStation
      ? this.documentNameForm.disable()
      : this.documentNameForm.enable();
    if (!this.isStation) {
      this.getDocumentName();
    } else {
      this.getAppendedFieldsOnDocumentName(this.stationRithmId);
    }
    this.getStatusDocumentEditable();
  }

  /**
   * Whether the info-drawer is opened.
   *
   * @returns Return true if info-drawer is opened, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
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
   * The id of the station or document.
   *
   * @returns The id of the station or document.
   */
  get stationRithmId(): string {
    return 'rithmId' in this.documentInformation
      ? this.documentInformation.rithmId
      : this.documentInformation.stationRithmId;
  }

  /**
   * The id of the document.
   *
   * @returns The id of the document.
   */
  get documentRithmId(): string {
    return 'documentRithmId' in this.documentInformation
      ? this.documentInformation.documentRithmId
      : '';
  }

  /**
   * The name for station show in document how widget.
   *
   * @returns The name of station.
   */
  get stationNameDocument(): string {
    return 'stationName' in this.documentInformation
      ? this.documentInformation.stationName
      : '';
  }

  /**
   * Is the current user an owner or an admin for this station.
   *
   * @returns Validate if user is owner or admin of current station.
   */
  get isUserAdminOrOwner(): boolean {
    return this.documentInformation.stationOwners?.find(
      (owner) => this.userService.user.rithmId === owner.rithmId
    ) !== undefined
      ? true
      : false;
  }

  /**
   * Toggles the open state of the drawer for document info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'documentInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem, {
      stationRithmId: this.stationRithmId,
      isStation: this.isStation,
      isUserAdminOrOwner: this.isUserAdminOrOwner,
      documentRithmId: this.documentRithmId,
    });
  }

  /**
   * Get document name.
   */
  private getDocumentName(): void {
    this.documentService
      .getDocumentName(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (documentName) => {
          this.documentNameForm.controls.name.setValue(documentName.baseName);
          this.documentName = documentName.baseName;
          this.appendedDocumentName = documentName.appendedName;
          this.documentService.updateDocumentNameBS(documentName);
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Get appended fields to document name template.
   *
   * @param stationId  The id of station.
   */
  getAppendedFieldsOnDocumentName(stationId: string): void {
    this.stationService
      .getDocumentNameTemplate(stationId)
      .pipe(first())
      .subscribe({
        next: (appendedFields) => {
          if (appendedFields) {
            this.documentAppendedFields = appendedFields;
            this.stationService.updateDocumentStationNameFields(
              this.documentAppendedFields
            );
          }
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Get the station document name editable status.
   *
   */
  private getStatusDocumentEditable(): void {
    this.stationService
      .getStatusDocumentEditable(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (editableStatus) => {
          this.isDocumentNameEditable = editableStatus;
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
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
    this.stationService.updateDocumentStationNameFields(
      this.documentAppendedFields
    );
  }

  /**
   * Update the Document Name Behavior Subject.
   */
  updateDocumentNameBS(): void {
    const documentName: DocumentName = {
      baseName: this.documentNameForm.controls.name.value,
      appendedName: this.appendedDocumentName,
    };
    this.documentService.updateDocumentNameBS(documentName);
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
