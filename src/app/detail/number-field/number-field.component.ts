import { Component, forwardRef, Input, OnInit, NgZone } from '@angular/core';
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
import { first } from 'rxjs';
import { DocumentFieldValidation } from 'src/helpers/document-field-validation';
import { QuestionFieldType, Question } from 'src/models';

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
  /** The form to add this field in the template. */
  numberFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Helper class for field validation. */
  fieldValidation = new DocumentFieldValidation();

  constructor(private fb: FormBuilder, private ngZone: NgZone) {}

  /**
   * Set up Formbuilder group.
   */
  ngOnInit(): void {
    this.numberFieldForm = this.fb.group({
      [this.field.questionType]: ['', []],
    });

    //Logic to determine if a field should be required, and the validators to give it.
    const validators: ValidatorFn[] = [];

    //The field is required. Validators.required must be included.
    if (this.field.isRequired) {
      validators.push(Validators.required);
    }

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
    this.ngZone.onStable.pipe(first()).subscribe(() => {
      this.numberFieldForm.get(this.field.questionType)?.markAsTouched();
      this.numberFieldForm
        .get(this.field.questionType)
        ?.updateValueAndValidity();
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
}
