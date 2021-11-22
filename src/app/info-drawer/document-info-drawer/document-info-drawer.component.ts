import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, map, startWith, takeUntil } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentNameField, Question } from 'src/models';
import { FieldNameSeparator } from 'src/models/enums';

/**
 * Component for document drawer.
 */
@Component({
  selector: 'app-document-info-drawer',
  templateUrl: './document-info-drawer.component.html',
  styleUrls: ['./document-info-drawer.component.scss']
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

  /** Select to store the separator value. */
  separatorValueSelect = '-';

  /** The different options for the separator value. */
  fieldNameSeparatorOptions = FieldNameSeparator;

  /** The input field for auto search Value. */
  autoSearchValue = '';

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService
  ) {
    this.appendFieldForm = this.fb.group({
      appendField: '',
      separatorField: ''
    });

    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as {
          /** RithmId station. */
          rithmId: string;
        };
        if (dataDrawer) {
          this.stationRithmId = dataDrawer.rithmId;
        }
      });

    /** Get Document Appended Fields from Behaviour Subject. */
    this.stationService.documentStationNameFields$
    .pipe(takeUntil(this.destroyed$))
    .subscribe( appendedFields => {
      this.options = appendedFields.filter(field => field.rithmId);
      if (this.questions.length > 0){
        this.filtersFieldsAndQuestions();
      }
    });
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStatusDocumentEditable();
    this.getAllPreviousQuestion();
  }

  /**
   * Get all station allSection previous  questions.
   *
   */
  getAllPreviousQuestion(): void {
    this.stationService.getStationPreviousQuestions(this.stationRithmId, false)
      .pipe(first())
      .subscribe({
        next: (questions: Question[]) => {
          if (questions) {
            /** Turn Questions objects into DocumentFields Object. */
            this.questions = questions
              .map(field => ({ prompt: field.prompt, rithmId: field.rithmId }));
            this.filtersFieldsAndQuestions();
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
   * Add Document Name Field.
   *
   * @param field The field selected in autocomplete.
   */
  addStationDocumentFieldName(field: string): void {
    const fieldToAppend: DocumentNameField | undefined = this.fieldsToAppend.find( newField => newField.prompt === field );

    if ( fieldToAppend !== undefined) {
      this.appendedFields.length > 0
      ? this.appendedFields.push({prompt:this.separatorValueSelect, rithmId:''},fieldToAppend)
      : this.appendedFields.push(fieldToAppend);
      this.stationService.updateDocumentStationNameFields(this.appendedFields);

      this.appendFieldForm.controls.appendField.setValue(' ');
    }
  }

  /**
   * Make filter AutoSearch Field List between Questions And AppendedFields.
   */
  filtersFieldsAndQuestions(): void {
    /**Difference between QuestionArray and OptionsArray */
    this.fieldsToAppend =
    this.questions.filter(field => !this.options.some(field2 => field.rithmId === field2.rithmId));

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
}
