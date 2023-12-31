import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DocumentFieldValidation } from 'src/helpers/document-field-validation';
import { QuestionFieldType, Question, DocumentAnswer } from 'src/models';
import { DocumentService } from 'src/app/core/document.service';

/**
 * Reusable component for all fields involving numbers.
 */
@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberFieldComponent),
      multi: true,
    },
  ],
})
export class NumberFieldComponent
  implements OnInit, ControlValueAccessor, Validator
{
  /** The document field to display. */
  @Input() field!: Question;

  /** Whether to validate input text mask (true by default). */
  @Input() validateMask = true;

  /** The form to add this field in the template. */
  numberFieldForm!: FormGroup;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Helper class for field validation. */
  fieldValidation = new DocumentFieldValidation();

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService
  ) {}

  /**
   * Set up Formbuilder group.
   */
  ngOnInit(): void {
    this.numberFieldForm = this.fb.group({
      [this.field.questionType]: [
        {
          value: this.fieldValue !== undefined ? this.fieldValue : '',
          disabled: this.field.isReadOnly,
        },
        [],
      ],
    });

    //Logic to determine if a field should be required, and the validators to give it.
    const validators: ValidatorFn[] = [];

    //The field is required. Validators.required must be included.
    if (this.field.isRequired) {
      validators.push(Validators.required);
    }

    if (this.validateMask) {
      //Need to set zip, currency and phone validation.
      switch (this.field.questionType) {
        case QuestionFieldType.Zip:
          validators.push(this.fieldValidation.zipValidation());
          break;
        case QuestionFieldType.Currency:
          validators.push(this.fieldValidation.currencyValidation());
          break;
        case QuestionFieldType.Phone:
          validators.push(this.fieldValidation.phoneValidation());
          break;
      }
    }

    this.numberFieldForm
      .get(this.field.questionType)
      ?.setValidators(validators);

    this.numberFieldForm.get(this.field.questionType)?.markAsTouched();
    this.numberFieldForm.get(this.field.questionType)?.updateValueAndValidity();
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
    val && this.numberFieldForm.setValue(val, { emitEvent: false });
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
    this.numberFieldForm.valueChanges.subscribe(fn);
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
    isDisabled ? this.numberFieldForm.disable() : this.numberFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.numberFieldForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'Number field form is invalid',
          },
        };
  }

  /**
   * Allow the answer to be updated in the documentTemplate through a subject.
   *
   */
  updateFieldAnswer(): void {
    const documentAnswer: DocumentAnswer = {
      questionRithmId: this.field.rithmId,
      documentRithmId: '',
      stationRithmId: '',
      value: this.numberFieldForm.controls[this.field.questionType].value,
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
  get fieldValue(): string | number | undefined {
    let fieldVal;
    if (this.field.answer && this.field.answer?.referAttribute) {
      switch (this.field.answer?.referAttribute) {
        case 'asInt':
          fieldVal = this.field.answer?.asInt ? this.field.answer?.asInt : 0;
          break;
        case 'asDecimal':
          fieldVal = this.field.answer?.asDecimal
            ? this.field.answer?.asDecimal
            : 0.0;
          break;
        case 'asString':
          fieldVal = this.field.answer?.asString
            ? this.field.answer?.asString.replace(/[)]/g, ') ')
            : '';
          break;
        default:
          fieldVal = undefined;
          break;
      }
    }
    return fieldVal;
  }
}
