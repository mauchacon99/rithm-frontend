import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import {
  DocumentStationInformation,
  UserType,
  StationInformation,
  DocumentNameField,
  DocumentName,
  StationRosterMember,
} from 'src/models';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Reusable component for the document information header.
 */
@Component({
  selector: 'app-document-info-header[documentInformation][viewNewStation]',
  templateUrl: './document-info-header.component.html',
  styleUrls: ['./document-info-header.component.scss'],
  providers: [],
})
export class DocumentInfoHeaderComponent implements OnInit, OnDestroy {
  /** Type of user looking at a document. */
  @Input() userType!: UserType;

  /** View new ui for station/document screen. */
  @Input() viewNewStation = false;

  /** Document information object passed from parent. */
  @Input() documentInformation!:
    | DocumentStationInformation
    | StationInformation;

  /** The Document how widget. */
  @Input() isWidget = false;

  /** Reload list of documents in station-widget when is true. */
  @Output() isReloadListDocuments = new EventEmitter<boolean>();

  /** Send new user assigned for document. */
  @Output() sendNewUserAssigned = new EventEmitter<StationRosterMember>();

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
    return (
      this.documentInformation.stationOwners?.find(
        (owner) => this.userService.user.rithmId === owner.rithmId
      ) !== undefined
    );
  }

  /**
   * Is the current user an owner or an admin for this station.
   *
   * @returns Validate if user is owner or admin of current station.
   */
  get currentAssignedUserDocument(): StationRosterMember {
    const user: StationRosterMember = {
      rithmId: '',
      firstName: '',
      lastName: ' ',
      email: '',
      isWorker: true,
      isOwner: false,
    };
    return 'currentAssignedUser' in this.documentInformation
      ? this.documentInformation.currentAssignedUser
      : user;
  }

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Document name form. */
  documentNameForm: FormGroup;

  /** Enum for all types of a user. */
  userTypeEnum = UserType;

  /**Current document name */
  documentName = '';

  /** Fields appended to the document name. */
  appendedDocumentName = '';

  /** Whether the Station allows edit document name or not. */
  isDocumentNameEditable!: boolean;

  /** Loading indicator to assign user. */
  loadingAssignUser = false;

  /** Variable to show if error message should be displayed. */
  displayAssignUserError = false;

  /** Document Appended Fields. */
  documentAppendedFields: DocumentNameField[] = [];

  constructor(
    private fb: FormBuilder,
    private sidenavDrawerService: SidenavDrawerService,
    private stationService: StationService,
    private documentService: DocumentService,
    private errorService: ErrorService,
    private userService: UserService,
    private router: Router
  ) {
    this.documentNameForm = fb.group({
      name: [''],
    });
  }

  /**
   * Disable document input element in station edit mode.
   */
  ngOnInit(): void {
    this.subscribeDocumentStationNameFields$();

    this.isStation
      ? this.documentNameForm.disable()
      : this.documentNameForm.enable();
    if (!this.isStation) {
      this.getDocumentName();
    } else {
      this.getAppendedFieldsOnDocumentName(this.stationRithmId);
    }
    if (!this.isWidget) {
      this.getStatusDocumentEditable();
    }
  }

  /**
   * Get is user is admin or worker or owner in document.
   *
   * @returns If is admin or worker or owner in document.
   */
  isAdminOrWorkerOrOwner(): boolean {
    this.documentInformation.stationOwners=[];
    this.documentInformation.workers=[];
    console.log(this.userService.isAdmin);

    return this.userService.isAdmin
      ? true
      : this.documentInformation.stationOwners?.find(
          (owner) => owner.rithmId === this.userService.user.rithmId
        )
      ? true
      : !!this.documentInformation.workers?.find(
          (worker) => worker.rithmId === this.userService.user.rithmId
        );
  }

  /** Get Document Appended Fields from Behaviour Subject. */
  private subscribeDocumentStationNameFields$() {
    this.stationService.documentStationNameFields$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((appendedFields) => {
        this.documentAppendedFields = appendedFields;
      });
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
          this.appendedDocumentName = this.formatAppendedName(
            documentName.appendedName
          );
          documentName.appendedName = this.appendedDocumentName;
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
   * Give a properly format to the appendedName.
   *
   * @param appendedName Unformatted appendedName.
   * @returns Formatted appendedName.
   */
  private formatAppendedName(appendedName: string): string {
    const formatted: string[] = [];
    const separatedChips: string[] = appendedName.split('/');
    //Separate each chip added to appended name
    separatedChips.forEach((element) => {
      //verify each element is in a readable format and added to the final form
      if (!element.includes('|') && !element.includes(':')) {
        formatted.push(element);
      } else {
        // if an element contain rithmsId or it is not readable then it will be splitted till become readable
        const items: string[] = [];
        if (element.includes('|')) {
          const barItems = element.split('|');
          barItems.forEach((item) => {
            items.push(item.split(':')[1]);
          });
          formatted.push(items.toString().replace(/(,)/g, ' | '));
        } else {
          formatted.push(element.split(':')[1]);
        }
      }
    });
    //finally we rebuilt the string to make it readable again.
    return formatted.toString().replace(/(,)/g, ' / ');
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

  /** Navigate the user to the document page. */
  goToDocument(): void {
    this.router.navigate(['/', 'document', this.documentRithmId], {
      queryParams: {
        documentId: this.documentRithmId,
        stationId: this.stationRithmId,
      },
    });
  }

  /**
   * Assign an user to a document.
   *
   */
  assignUserToDocument(): void {
    if (this.isWidget) {
      this.isReloadListDocuments.emit(true);
    }
    this.loadingAssignUser = true;
    this.displayAssignUserError = false;
    this.documentService
      .assignUserToDocument(
        this.userService.user.rithmId,
        this.stationRithmId,
        this.documentRithmId
      )
      .pipe(first())
      .subscribe({
        next: () => {
          this.displayAssignUserError = false;
          this.getAssignedUserToDocument();
        },
        error: (error: unknown) => {
          this.loadingAssignUser = false;
          this.displayAssignUserError = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Get the user assigned to the document.
   *
   */
  private getAssignedUserToDocument(): void {
    this.documentService
      .getAssignedUserToDocument(
        this.documentRithmId,
        this.stationRithmId,
        true
      )
      .pipe(first())
      .subscribe({
        next: (assignedUser) => {
          this.loadingAssignUser = false;
          this.sendNewUserAssigned.emit(assignedUser[0]);
        },
        error: (error: unknown) => {
          this.loadingAssignUser = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
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
