import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, map, startWith, takeUntil } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentNameField, Question, StationRosterMember } from 'src/models';
import { FieldNameSeparator } from 'src/models/enums';
import { UserService } from 'src/app/core/user.service';
import { DocumentService } from 'src/app/core/document.service';
import { UtcTimeConversion } from 'src/helpers';
import { PopupService } from 'src/app/core/popup.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConnectedStationsModalComponent } from 'src/app/document/connected-stations-modal/connected-stations-modal.component';
import { LocationModalComponent } from 'src/app/document/folder/location-modal/location-modal.component';
import { UserListModalComponent } from 'src/app/document/user-list-modal/user-list-modal.component';
import { Location } from '@angular/common';

/**
 * Component for document drawer.
 */
@Component({
  selector: 'app-document-info-drawer',
  templateUrl: './document-info-drawer.component.html',
  styleUrls: ['./document-info-drawer.component.scss'],
  providers: [UtcTimeConversion],
})
export class DocumentInfoDrawerComponent implements OnInit, OnDestroy {
  /** Organization name form. */
  appendFieldForm: FormGroup;

  /**Current fields appended to Document Name. */
  options: DocumentNameField[] = [];

  /** The list of station allSection previous questions turned into DocumentNameField. */
  questions: DocumentNameField[] = [];

  /**Fields that can be appended to document name (Diff between optionList and questionList). */
  fieldsToAppend: DocumentNameField[] = [];

  /**Appended Fields to the document name. */
  private appendedFields: DocumentNameField[] = [];

  /**Filtered Form Field List */
  filteredOptions$: Observable<DocumentNameField[]> | undefined;

  /** Is the document name editable. */
  documentNameEditable = false;

  /** The station rithmId. */
  stationRithmId = '';

  /** Whether the request to get the document info drawer is currently underway. */
  documentInfoDrawerLoading = false;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Loading in the document name section. */
  documentNameLoading = false;

  /** The different options for the separator value. */
  fieldNameSeparatorOptions = FieldNameSeparator;

  /** The input field for auto search Value. */
  autoSearchValue = '';

  /** Comes from station or not. */
  isStation = false;

  /** Is the signed in user an Admin or station owner. */
  isUserAdminOrOwner = false;

  /** The Document Name. */
  documentName = '';

  /** Last updated time for document. */
  lastUpdatedDate = '';

  /** Document rithmId. */
  documentRithmId = '';

  /** Color message LastUpdated. */
  colorMessage = '';

  /** The held time in station for document. */
  documentTimeInStation = '';

  /** The color of documentTimeInStation text.*/
  colorMessageDocumentTime = '';

  /** The assigned user of document information. */
  documentAssignedUser: StationRosterMember[] = [];

  /** Loading in last updated section. */
  lastUpdatedLoading = false;

  /* Loading in document the assigned user */
  assignedUserLoading = false;

  /** Loading indicator for time held in station. */
  timeInStationLoading = false;

  /** Enable error message if assigned user the document request fails. */
  userErrorAssigned = false;

  /** Enable error message if unassigned user request fails. */
  userErrorUnassigned = false;

  /** The selected tab index/init. */
  selectedTabIndex = 0;

  /** Use for station events history. */
  currentStationsLength = 0;

  /** Whether the station events history is underway. */
  eventsLengthCurrent = true;

  /** Identifies the button hover to assign a user. */
  assignedNewUser = false;

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private documentService: DocumentService,
    private utcTimeConversion: UtcTimeConversion,
    private popupService: PopupService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location
  ) {
    this.appendFieldForm = this.fb.group({
      appendField: '',
      separatorField: '/',
    });

    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as {
          /** RithmId station. */
          stationRithmId: string;

          /** Comes from station or not. */
          isStation: boolean;

          /** User actually is owner to actually station. */
          isUserAdminOrOwner: boolean;

          /** RithmId document. */
          documentRithmId: string;
        };
        if (dataDrawer) {
          this.stationRithmId = dataDrawer.stationRithmId;
          this.documentRithmId = dataDrawer.documentRithmId;
          this.isStation = dataDrawer.isStation;
          this.isUserAdminOrOwner =
            this.userService.user.role === 'admin' ||
            dataDrawer.isUserAdminOrOwner
              ? true
              : false;
        }
        if (!this.isStation && dataDrawer.documentRithmId) {
          this.getLastUpdated();
          this.getAssignedUserToDocument();
          this.getDocumentTimeInStation();
        }
      });
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStatusDocumentEditable();
    this.getAllPreviousQuestions();
    if (this.documentRithmId && this.documentRithmId.length) {
      this.getCurrentStations();
    }
    this.subscribeDocumentName();
    this.subscribeDocumentStationNameFields();
  }

  /**
   * Subscribe the subject documentName.
   */
  private subscribeDocumentName(): void {
    this.documentService.documentName$
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (documentName) => {
          this.documentName = `${documentName.baseName} ${documentName.appendedName}`;
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
   * Get Document Appended Fields from Behaviour Subject.
   */
  private subscribeDocumentStationNameFields(): void {
    this.stationService.documentStationNameFields$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((appendedFields) => {
        this.options = appendedFields.filter((field) => field.questionRithmId);
        if (this.questions.length > 0) {
          this.filterFieldsAndQuestions();
        }
      });
  }

  /**
   * Get all station allSection previous  questions.
   *
   */
  getAllPreviousQuestions(): void {
    this.stationService
      .getStationPreviousQuestions(this.stationRithmId, false)
      .pipe(first())
      .subscribe({
        next: (questions: Question[]) => {
          if (questions) {
            /** Turn Questions objects into DocumentFields Object. */
            this.questions = questions
              .filter((question) => question.prompt && question.rithmId)
              .map((field) => ({
                prompt: field.prompt,
                questionRithmId: field.rithmId,
              }));
            this.filterFieldsAndQuestions();
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
   * Filtered Values.
   *
   * @param value Current String in Field Forms.
   * @returns Filtered value.
   */
  private _filter(value: string): DocumentNameField[] {
    const filterValue = value.toLowerCase();
    return this.fieldsToAppend.filter((option) =>
      option.prompt.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Get status document is editable or not.
   *
   */
  getStatusDocumentEditable(): void {
    this.documentNameLoading = true;
    this.stationService
      .getStatusDocumentEditable(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (documentEditableStatus) => {
          this.documentNameLoading = false;
          if (documentEditableStatus) {
            this.documentNameEditable = documentEditableStatus;
          }
        },
        error: (error: unknown) => {
          this.documentNameLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Update status document is editable or not.
   *
   * @param newStatus The new status is editable in the change for document.
   */
  updateStatusDocumentEditable(newStatus: boolean): void {
    this.documentNameLoading = true;
    this.stationService
      .updateStatusDocumentEditable(this.stationRithmId, newStatus)
      .pipe(first())
      .subscribe({
        next: (documentEditableStatus) => {
          this.documentNameEditable = documentEditableStatus;
          this.documentNameLoading = false;
        },
        error: (error: unknown) => {
          this.documentNameLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Change separator value.
   *
   * @param separator The field prompt selected in autocomplete.
   */
  updateSeparatorFieldValue(separator: string): void {
    for (let i = 0; i < this.appendedFields.length; i++) {
      if (!this.appendedFields[i].questionRithmId) {
        this.appendedFields[i].prompt = separator;
      }
    }
  }

  /**
   * Add Document Name Field.
   *
   * @param fieldPrompt The field prompt selected in autocomplete.
   */
  addStationDocumentFieldName(fieldPrompt: string): void {
    const fieldToAppend = this.fieldsToAppend.find(
      (newField) => newField.prompt === fieldPrompt
    );
    if (!fieldToAppend) {
      throw new Error(
        `Requested field with prompt of ${fieldPrompt} could not be found in fieldsToAppend`
      );
    }
    this.appendedFields.length > 0
      ? this.appendedFields.push(
          {
            prompt: this.appendFieldForm.controls.separatorField.value,
            questionRithmId: null,
          },
          fieldToAppend
        )
      : this.appendedFields.push(fieldToAppend);
    this.stationService.updateDocumentStationNameFields(this.appendedFields);
    this.appendFieldForm.controls.appendField.setValue('');
  }

  /**
   * Make filter AutoSearch Field List between Questions And AppendedFields.
   */
  filterFieldsAndQuestions(): void {
    /**Difference between QuestionArray and OptionsArray */
    this.fieldsToAppend = this.questions.filter(
      (field) =>
        !this.options.some(
          (field2) => field.questionRithmId === field2.questionRithmId
        )
    );

    /** Set the filter List for auto searching. */
    this.filteredOptions$ = this.appendFieldForm.controls[
      'appendField'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Get last updated time for document.
   */
  private getLastUpdated(): void {
    this.lastUpdatedLoading = true;
    this.documentService
      .getLastUpdated(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (lastUpdated) => {
          this.lastUpdatedLoading = false;
          if (lastUpdated && lastUpdated !== 'Unknown') {
            this.lastUpdatedDate = this.utcTimeConversion.getElapsedTimeText(
              this.utcTimeConversion.getMillisecondsElapsed(lastUpdated)
            );
            this.colorMessage = 'text-accent-500';
            if (this.lastUpdatedDate === '1 day') {
              this.lastUpdatedDate = ' Yesterday';
            } else {
              this.lastUpdatedDate += ' ago';
            }
          } else {
            this.colorMessage = 'text-error-500';
            this.lastUpdatedDate = 'Unable to retrieve time';
          }
        },
        error: (error: unknown) => {
          this.lastUpdatedDate = 'Unable to retrieve time';
          this.colorMessage = 'text-error-500';
          this.lastUpdatedLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Get the held time of a document in the station.
   */
  private getDocumentTimeInStation(): void {
    this.timeInStationLoading = true;
    this.documentService
      .getDocumentTimeInStation(this.documentRithmId, this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (documentTimeInStation) => {
          this.timeInStationLoading = false;
          if (documentTimeInStation && documentTimeInStation !== 'Unknown') {
            this.documentTimeInStation =
              this.utcTimeConversion.getElapsedTimeText(
                this.utcTimeConversion.getMillisecondsElapsed(
                  documentTimeInStation
                )
              );
            this.colorMessageDocumentTime = 'text-accent-500';
          } else {
            this.colorMessageDocumentTime = 'text-error-500';
            this.documentTimeInStation = 'Unable to retrieve time';
          }
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
          this.documentTimeInStation = 'Unable to retrieve time';
          this.colorMessageDocumentTime = 'text-error-500';
          this.timeInStationLoading = false;
        },
      });
  }

  /**
   * Get the user assigned to the document.
   *
   */
  private getAssignedUserToDocument(): void {
    this.userErrorAssigned = false;
    this.assignedUserLoading = true;
    this.documentService
      .getAssignedUserToDocument(
        this.documentRithmId,
        this.stationRithmId,
        true
      )
      .pipe(first())
      .subscribe({
        next: (assignedUser) => {
          this.assignedUserLoading = false;
          if (assignedUser) {
            this.documentAssignedUser = assignedUser;
          }
        },
        error: (error: unknown) => {
          this.userErrorAssigned = true;
          this.assignedUserLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Delete a specified document.
   */
  async deleteDocument(): Promise<void> {
    const deleteDoc = await this.popupService.confirm({
      title: 'Are you sure?',
      message: 'The document will be deleted.',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    });
    if (deleteDoc) {
      this.sidenavDrawerService.closeDrawer();
      this.documentService
        .deleteDocument(this.documentRithmId)
        .pipe(first())
        .subscribe({
          next: () => {
            this.sidenavDrawerService.toggleDrawer('documentInfo', {
              stationRithmId: this.stationRithmId,
              documentRithmId: '',
              isStation: this.isStation,
              isUserAdminOrOwner: this.isUserAdminOrOwner,
            });
            this.popupService.notify('The document has been deleted.');
            this.location.back();
          },
          error: (error: unknown) => {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    }
  }

  /**
   * Open popup service to unassign a user to document.
   */
  async unassignUser(): Promise<void> {
    const userUnassigned = await this.popupService.confirm({
      title: 'Unassign User',
      message: 'This action cannot be undone',
      okButtonText: 'Unassign',
      cancelButtonText: 'Cancel',
      important: true,
    });
    if (userUnassigned) {
      this.unassignUserToDocument();
    }
  }

  /**
   * Unassign user to document.
   */
  private unassignUserToDocument(): void {
    this.userErrorUnassigned = false;
    this.assignedUserLoading = true;
    this.documentService
      .unassignUserToDocument(this.documentRithmId, this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.documentAssignedUser = [];
          this.assignedUserLoading = false;
        },
        error: (error: unknown) => {
          this.assignedUserLoading = false;
          this.userErrorUnassigned = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Open a modal to move document.
   */
  openModalMoveDocument(): void {
    this.sidenavDrawerService.closeDrawer();
    this.dialog.open(ConnectedStationsModalComponent, {
      data: {
        documentRithmId: this.documentRithmId,
        stationRithmId: this.stationRithmId,
        assignedUser: this.documentAssignedUser.length,
      },
    });
  }

  /**
   * Open a modal to move location.
   */
  openModalLocation(): void {
    this.dialog.open(LocationModalComponent, {
      minWidth: '550px',
      minHeight: '450px',
      data: {
        stationRithmId: this.stationRithmId,
        documentRithmId: this.documentRithmId,
      },
    });
  }

  /**
   * Get the current stations from containers.
   */
  private getCurrentStations(): void {
    this.eventsLengthCurrent = true;
    this.documentService
      .getCurrentStations(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.currentStationsLength = data.length;
          this.eventsLengthCurrent = false;
        },
        error: (error: unknown) => {
          this.eventsLengthCurrent = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Open a modal to move assign Container.
   */
  openUserListModal(): void {
    this.dialog.open(UserListModalComponent, {
      minWidth: '550px',
      minHeight: '450px',
      data: this.stationRithmId,
    });
  }
}
