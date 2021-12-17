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

/**
 * Component for document drawer.
 */
@Component({
  selector: 'app-document-info-drawer',
  templateUrl: './document-info-drawer.component.html',
  styleUrls: ['./document-info-drawer.component.scss'],
  providers: [UtcTimeConversion]
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

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private documentService: DocumentService,
    private utcTimeConversion: UtcTimeConversion,
    private popupService: PopupService,
    private router: Router
  ) {
    this.appendFieldForm = this.fb.group({
      appendField: '',
      separatorField: '/'
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
          this.isUserAdminOrOwner = (this.userService.user.role === 'admin' || dataDrawer.isUserAdminOrOwner) ? true : false;
        }
        if (!this.isStation) {
          this.getLastUpdated();
          this.getDocumentTimeInStation();
        }
      });

    /** Get Document Appended Fields from Behaviour Subject. */
    this.stationService.documentStationNameFields$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(appendedFields => {
        this.options = appendedFields.filter(field => field.questionRithmId);
        if (this.questions.length > 0) {
          this.filterFieldsAndQuestions();
        }
      });
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStatusDocumentEditable();
    this.getAllPreviousQuestions();
    this.documentService.documentName$
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (documentName) => {
          this.documentName = `${documentName.baseName} ${documentName.appendedName}`;
        }, error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Get all station allSection previous  questions.
   *
   */
  getAllPreviousQuestions(): void {
    this.stationService.getStationPreviousQuestions(this.stationRithmId, false)
      .pipe(first())
      .subscribe({
        next: (questions: Question[]) => {
          if (questions) {
            /** Turn Questions objects into DocumentFields Object. */
            this.questions = questions
              .filter(question => question.prompt && question.rithmId)
              .map(field => ({ prompt: field.prompt, rithmId: field.rithmId }));
            this.filterFieldsAndQuestions();
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
   * Filtered Values.
   *
   * @param value Current String in Field Forms.
   * @returns Filtered value.
   */
  private _filter(value: string): DocumentNameField[] {
    const filterValue = value.toLowerCase();
    return this.fieldsToAppend.filter(option => option.prompt.toLowerCase().includes(filterValue));
  }

  /**
   * Get status document is editable or not.
   *
   */
  getStatusDocumentEditable(): void {
    this.documentNameLoading = true;
    this.stationService.getStatusDocumentEditable(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (documentEditableStatus) => {
          this.documentNameLoading = false;
          if (documentEditableStatus) {
            this.documentNameEditable = documentEditableStatus;
          }
        }, error: (error: unknown) => {
          this.documentNameLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Update status document is editable or not.
   *
   * @param newStatus The new status is editable in the change for document.
   */
  updateStatusDocumentEditable(newStatus: boolean): void {
    this.documentNameLoading = true;
    this.stationService.updateStatusDocumentEditable(this.stationRithmId, newStatus)
      .pipe(first())
      .subscribe({
        next: (documentEditableStatus) => {
          this.documentNameEditable = documentEditableStatus;
          this.documentNameLoading = false;
        }, error: (error: unknown) => {
          this.documentNameLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Change separator value.
   *
   * @param separator The field prompt selected in autocomplete.
   */
  updateSeparatorFieldValue(separator: string): void {
    // search separatorField and replace in all items with ritmId==''
    for (let i = 0; i < this.appendedFields.length; i++) {
      if (this.appendedFields[i].questionRithmId === '') {
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

    const fieldToAppend = this.fieldsToAppend.find(newField => newField.prompt === fieldPrompt);
    if (!fieldToAppend) {
      throw new Error(`Requested field with prompt of ${fieldPrompt} could not be found in fieldsToAppend`);
    }
    this.appendedFields.length > 0
      ? this.appendedFields.push({ prompt: this.appendFieldForm.controls.separatorField.value, questionRithmId: '' }, fieldToAppend)
      : this.appendedFields.push(fieldToAppend);
    this.stationService.updateDocumentStationNameFields(this.appendedFields);
    this.appendFieldForm.controls.appendField.setValue('');
  }

  /**
   * Make filter AutoSearch Field List between Questions And AppendedFields.
   */
  filterFieldsAndQuestions(): void {
    /**Difference between QuestionArray and OptionsArray */
    this.fieldsToAppend = this.questions.filter(field => !this.options.some(field2 => field.questionRithmId === field2.questionRithmId));

    /** Set the filter List for auto searching. */
    this.filteredOptions$ = this.appendFieldForm.controls['appendField'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
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
    this.documentService.getLastUpdated(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (lastUpdated) => {
          this.lastUpdatedLoading = false;
          if (lastUpdated && lastUpdated !== 'Unknown') {
            this.lastUpdatedDate = this.utcTimeConversion.getElapsedTimeText(
              this.utcTimeConversion.getMillisecondsElapsed(lastUpdated));
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
        }, error: (error: unknown) => {
          this.lastUpdatedDate = 'Unable to retrieve time';
          this.colorMessage = 'text-error-500';
          this.lastUpdatedLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Get held time in station for document.
   */
  private getDocumentTimeInStation(): void {
    this.documentService.getDocumentTimeInStation(this.documentRithmId, this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (documentTimeInStation) => {
          if (documentTimeInStation && documentTimeInStation !== 'Unknown') {
            this.documentTimeInStation = this.utcTimeConversion.getElapsedTimeText(
              this.utcTimeConversion.getMillisecondsElapsed(documentTimeInStation));
            this.colorMessageDocumentTime = 'text-accent-500';
          } else {
            this.colorMessageDocumentTime = 'text-error-500';
            this.documentTimeInStation = 'Unable to retrieve time';
          }
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
          this.documentTimeInStation = 'Unable to retrieve time';
          this.colorMessageDocumentTime = 'text-error-500';
        }
      });
  }

  /**
   * Get the user assigned to the document.
   *
   * @param documentRithmId The id of the document.
   */
  private getAssignedUserToDocument(documentRithmId: string): void {
    this.documentService.getAssignedUserToDocument(documentRithmId, this.stationRithmId, true)
      .pipe(first())
      .subscribe({
        next: (assignedUser) => {
          if (assignedUser) {
            this.documentAssignedUser = assignedUser;
          }
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
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
      important: true
    });
    if (deleteDoc) {
      this.documentService.deleteDocument(this.documentRithmId)
        .pipe(first())
        .subscribe({
          next: () => {
            this.popupService.notify('The document has been deleted.');
            this.router.navigateByUrl('dashboard');
          },
          error: (error: unknown) => {
            this.errorService.displayError(
              'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
              error
            );
          }
        });
    }
  }
}
