import { Component, forwardRef, Input, OnInit } from '@angular/core';
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
import { DateAdapter } from '@angular/material/core';
import { DocumentService } from 'src/app/core/document.service';
import { DocumentFieldValidation } from 'src/helpers/document-field-validation';
import { QuestionFieldType, Question, DocumentAnswer } from 'src/models';

/**
 * Reusable component for every date field.
 */
@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateFieldComponent),
      multi: true,
    },
  ],
})
export class DateFieldComponent
  implements OnInit, ControlValueAccessor, Validator
{
  /** The form to add this field in the template. */
  dateFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Helper class for field validation. */
  fieldValidation = new DocumentFieldValidation();

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    readonly adapter: DateAdapter<Date>
  ) {
    this.adapter.setLocale('en-EN');
  }

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.dateFieldForm = this.fb.group({
      date: [this.fieldValue, []],
    });

    if (this.field.isRequired) {
      this.dateFieldForm.get('date')?.setValidators([Validators.required]);
    }

    this.dateFieldForm.get('date')?.markAsTouched();
    this.dateFieldForm.get('date')?.updateValueAndValidity();
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
    val && this.dateFieldForm.setValue(val, { emitEvent: false });
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
    this.dateFieldForm.valueChanges.subscribe(fn);
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
   * Sets the disabled state of this form control.
   *
   * @param isDisabled The disabled state to set.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.dateFieldForm.disable() : this.dateFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.dateFieldForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'Date field form is invalid',
          },
        };
  }

  /**
   * Allow the answer to be updated in the documentTemplate through a subject.
   *
   */
  updateFieldAnswer(): void {
    const pickedDate = new Date(this.dateFieldForm.controls['date'].value)
      .toISOString()
      .slice(0, 10);
    const documentAnswer: DocumentAnswer = {
      questionRithmId: this.field.rithmId,
      documentRithmId: '',
      stationRithmId: '',
      value: pickedDate,
      type: this.field.questionType,
      questionUpdated: true,
    };
    this.documentService.updateAnswerSubject(documentAnswer);
  }

  /**
   * Gets the input/textArea value.
   *
   * @returns A string value.
   */
  get fieldValue(): string {
    let fieldVal = '';
    if (this.field.answer && this.field.answer?.asDate?.length) {
      fieldVal = this.field.answer?.asDate;
    }
    return fieldVal;
  }
}
