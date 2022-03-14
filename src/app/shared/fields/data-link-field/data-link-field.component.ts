import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { first, map, Observable, startWith } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { Question, Station } from 'src/models';

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
  implements OnInit, ControlValueAccessor, Validator
{
  /** The form to add this field in the template. */
  dataLinkFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** Whether the instance comes from station or document. */
  @Input() isStation = true;

  /** The list of all stations. */
  stations: Station[] = [];

  /**Filtered form station List. */
  filteredStations$: Observable<Station[]> | undefined;

  /* Loading in input auto-complete the list of all stations. */
  stationLoading = false;

  /** Current station's fields as options for the select base value. */
  currentfields: Question[] = [];

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private errorService: ErrorService
  ) {}

  /**
   * Listen the currentQuestions Service.
   */
  private subscribeCurrentQuestions(): void {
    this.stationService.currentQuestions$
      .pipe(first())
      .subscribe((questions) => {
        if (questions.length) {
          this.currentfields = questions;
        }
      });
  }

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.dataLinkFieldForm = this.fb.group({
      [this.field.questionType]: [this.fieldValue, []],
      selectBaseValue: ['', []],
    });
    this.getAllStations();
    this.subscribeCurrentQuestions();
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
    this.filteredStations$ = this.dataLinkFieldForm.controls[
      this.field.questionType
    ]?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
}
