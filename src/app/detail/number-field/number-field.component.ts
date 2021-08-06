import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from '@angular/forms';
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
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberFieldComponent),
      multi: true
    }
  ]
})
export class NumberFieldComponent implements OnInit, ControlValueAccessor, Validator {
  /** The form to add this field in the template. */
  numberField!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Helper class for field validation. */
  fieldValidation = new DocumentFieldValidation();

  constructor(
    private fb: FormBuilder,
  ) { }

  /**
   * Set up Formbuilder group.
   */
  ngOnInit(): void {
    switch(this.field.questionType.typeString) {
      case this.fieldTypeEnum.Address:
        this.numberField = this.fb.group({
          address: ['', []]
        });
        break;
      case this.fieldTypeEnum.Currency:
        this.numberField = this.fb.group({
          currency: ['', []]
        });
        break;
      case this.fieldTypeEnum.Phone:
        this.numberField = this.fb.group({
          phone: ['', []]
        });
        break;
      default:
        this.numberField = this.fb.group({
          number: ['', []]
        });
    }

    //Logic to determine if a field should be required, and the validators to give it.
    //The field is required. Validators.required must be included.
    if (this.field.isRequired && this.name() === 'address') {
      this.numberField.get('address')?.setValidators([this.fieldValidation.zipValidation(), Validators.required]);
    } else if (this.field.isRequired && this.name() === 'currency') {
      this.numberField.get('currency')?.setValidators([this.fieldValidation.currencyValidation(), Validators.required]);
    } else if (this.field.isRequired && this.name() === 'phone') {
      this.numberField.get('phone')?.setValidators([this.fieldValidation.phoneValidation(),Validators.required]);
    } else if (this.field.isRequired && this.name() === 'number') {
      this.numberField.get('number')?.setValidators([Validators.required]);
    //The field is not required. Only need to set address, currency and phone.
    } else if (!this.field.isRequired && this.name() === 'address') {
      this.numberField.get('address')?.setValidators([this.fieldValidation.zipValidation()]);
    } else if (!this.field.isRequired && this.name() === 'currency') {
      this.numberField.get('currency')?.setValidators([this.fieldValidation.currencyValidation()]);
    } else if (!this.field.isRequired && this.name() === 'phone') {
      this.numberField.get('phone')?.setValidators([this.fieldValidation.phoneValidation()]);
    }

  }

  /**
   * FormControlName.
   *
   * @returns A string based on the field type.
   */
   name(): string {
    switch(this.field.questionType.typeString) {
      case this.fieldTypeEnum.Address:
        return 'address';
      case this.fieldTypeEnum.Currency:
        return 'currency';
      case this.fieldTypeEnum.Phone:
        return 'phone';
      default:
        return 'number';
    }
  }

  /**
   * The `onTouched` function.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => { };

  /**
   * Writes a value to this form.
   *
   * @param val The value to be written.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  writeValue(val: any): void {
    val && this.numberField.setValue(val, { emitEvent: false });
  }

  /**
   * Registers a function with the `onChange` event.
   *
   * @param fn The function to register.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  registerOnChange(fn: any): void {
    // TODO: check for memory leak
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.numberField.valueChanges.subscribe(fn);
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
    isDisabled ? this.numberField.disable() : this.numberField.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.numberField.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }

}
