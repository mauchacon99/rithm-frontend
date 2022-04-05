import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { first, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { Question, Station, DataLinkObject } from 'src/models';

/**
 * Reusable component for every field data-link.
 */
@Component({
  selector: 'app-data-link-field',
  templateUrl: './data-link-field.component.html',
  styleUrls: ['./data-link-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataLinkFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DataLinkFieldComponent),
      multi: true,
    },
  ],
})
export class DataLinkFieldComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  /** The form to add this field in the template. */
  dataLinkFieldForm!: FormGroup;

  /**Filtered form station List. */
  filteredStations$: Observable<Station[]> | undefined;

  /** Default Data Link. */
  dataLinkDefault: DataLinkObject = {
    rithmId: '',
    frameRithmId: '',
    sourceStationRithmId: '',
    targetStationRithmId: '',
    baseQuestionRithmId: '',
    matchingQuestionRithmId: '',
    displayFields: [],
  };

  /** The document field to display. */
  @Input() field!: Question;

  /** Whether the instance comes from station or document. */
  @Input() isStation = true;

  /** The list of all stations. */
  stations: Station[] = [];

  /** The list of selected station questions for the select matching value.*/
  questions: Question[] = [];

  /** Current station's fields as options for the select base value. */
  currentStationQuestions: Question[] = [];

  /* The name for matching value  label  */
  matchingValueLabel = 'Matching Value';

  /* The name for display fields  label  */
  displayFieldsLabel = 'Display Fields';

  /* Loading in input auto-complete the list of all stations. */
  stationLoading = false;

  /* Loading in input  the station questions selected . */
  questionLoading = false;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private errorService: ErrorService
  ) {}

  /**
   * Listen the currentStationQuestions Service.
   */
  private subscribeCurrentStationQuestions(): void {
    this.stationService.currentStationQuestions$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((questions) => {
        this.currentStationQuestions = questions;
      });
  }

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.dataLinkFieldForm = this.fb.group({
      targetStation: [this.fieldValue, [Validators.required]],
      selectedMatchingValue: ['', [Validators.required]],
      selectBaseValue: ['', [Validators.required]],
      selectedDisplayFields: ['', [Validators.required]],
    });
    this.dataLinkDefault.frameRithmId = this.field.rithmId;
    this.dataLinkDefault.rithmId = this.field.rithmId;
    if (this.field.originalStationRithmId) {
      this.dataLinkDefault.sourceStationRithmId =
        this.field.originalStationRithmId;
    }
    this.dataLinkFieldForm.controls.targetStation.markAllAsTouched();
    this.dataLinkFieldForm.controls.selectBaseValue.markAllAsTouched();
    this.subscribeCurrentStationQuestions();
    this.getAllStations();
  }

  /**
   * Get the list of all stations.
   */
  private getAllStations(): void {
    this.stationLoading = true;
    this.stationService
      .getAllStations()
      .pipe(first())
      .subscribe({
        next: (stations) => {
          this.stations = stations;
          this.filterStations();
          this.stationLoading = false;
        },
        error: (error: unknown) => {
          this.stationLoading = false;
          this.errorService.displayError(
            'Failed to get all stations for this data link field.',
            error,
            false
          );
        },
      });
  }

  /**
   * Get station questions for select matching value and display fields.
   *
   * @param nameStation The name station selected.
   */
  getStationQuestions(nameStation: string): void {
    this.questions = [];
    this.questionLoading = true;
    const targetStationId = this.stations.find(
      (station) => station.name === nameStation
    )?.rithmId;
    if (targetStationId) {
      this.dataLinkDefault.targetStationRithmId = targetStationId;
      this.stationService
        .getStationQuestions(targetStationId)
        .pipe(first())
        .subscribe({
          next: (questions) => {
            /** Update label name matching value and  display fields if question array is empty. */
            this.matchingValueLabel = !questions.length
              ? 'No Questions Found'
              : 'Matching Value';
            this.displayFieldsLabel = !questions.length
              ? 'No Questions Found'
              : 'Display Fields';

            this.questions = questions;
            this.resetField('selectedDisplayFields', []);
            this.resetField('selectedMatchingValue', '');
            this.questionLoading = false;
            this.dataLinkFieldForm.controls.selectedMatchingValue.markAllAsTouched();
            this.dataLinkFieldForm.controls.selectedDisplayFields.markAllAsTouched();
          },
          error: (error: unknown) => {
            this.questionLoading = false;
            this.errorService.displayError(
              'Failed to get station questions for this data link field.',
              error
            );
          },
        });
    }
  }

  /**
   * Reset a dataLinkFieldForm value control.
   *
   * @param controlName The name control.
   * @param value Value reset the control.
   */
  resetField(
    controlName:
      | 'selectedMatchingValue'
      | 'selectBaseValue'
      | 'selectedDisplayFields',
    value: unknown
  ): void {
    this.dataLinkFieldForm.controls[controlName].reset(value);
  }

  /**
   * The `onTouched` function.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  /**
   * Writes a value to this form.
   *
   * @param val The value to be written.
   */
  // eslint-disable-next-line
  writeValue(val: any): void {
    val && this.dataLinkFieldForm.setValue(val, { emitEvent: false });
  }

  /**
   * Registers a function with the `onChange` event.
   *
   * @param fn The function to register.
   */
  // eslint-disable-next-line
  registerOnChange(fn: any): void {
    // TODO: check for memory leak
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.dataLinkFieldForm.valueChanges.subscribe(fn);
    this.dataLinkFieldForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((val) => {
        if (this.dataLinkFieldForm.valid) {
          this.dataLinkDefault.matchingQuestionRithmId =
            val.selectedMatchingValue;
          this.dataLinkDefault.baseQuestionRithmId = val.selectBaseValue;
          this.dataLinkDefault.displayFields = val.selectedDisplayFields;
          this.stationService.dataLinkObject$.next(this.dataLinkDefault);
        }
      });
  }

  /**
   * Registers a function with the `onTouched` event.
   *
   * @param fn The function to register.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.dataLinkFieldForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'Data link field form is invalid',
          },
        };
  }

  /**
   * Gets the input value.
   *
   * @returns A string value.
   */
  get fieldValue(): string {
    let fieldVal = '';
    if (this.isStation) {
      fieldVal = this.field.value ? this.field.value : '';
    }
    return fieldVal;
  }

  /**
   * Filtered Values.
   *
   * @param value Current String in Field Forms.
   * @returns Filtered value.
   */
  private _filter(value: string): Station[] {
    const filterValue = value.toLowerCase();
    return this.stations.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Filter the list of all stations.
   */
  private filterStations(): void {
    /** Set the filter List for auto searching. */
    this.filteredStations$ =
      this.dataLinkFieldForm.controls.targetStation.valueChanges.pipe(
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
}
