import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from '@angular/forms';
import { DocumentFieldValidation } from 'src/helpers/document-field-validation';
import { QuestionFieldType, Question } from 'src/models';

/**
 * Reusable component for all fields involving text.
 */
@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true
    }
  ]
})
export class TextFieldComponent implements OnInit, ControlValueAccessor, Validator {
  /** The form to add this field in the template. */
  textField!: FormGroup;

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
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
      switch(this.field.questionType.typeString) {
        case this.fieldTypeEnum.LongText:
          this.textField = this.fb.group({
            longText: ['', []]
          });
          break;
        case this.fieldTypeEnum.URL:
          this.textField = this.fb.group({
            url: ['', []]
          });
          break;
        case this.fieldTypeEnum.Email:
          this.textField = this.fb.group({
            email: ['', [Validators.email]]
          });
          break;
        default:
          this.textField = this.fb.group({
            shortText: ['', []]
          });
      }

    //Logic to determine if a field should be required, and the validators to give it.
    //The field is required. Validators.required must be included.
    if (this.field.isRequired && this.name() === 'email') {
      this.textField.get('email')?.setValidators([Validators.email, Validators.required]);
    } else if (this.field.isRequired && this.name() === 'url') {
      this.textField.get('url')?.setValidators([this.fieldValidation.urlValidation(), Validators.required]);
    } else if (this.field.isRequired && this.name() === 'longText') {
      this.textField.get('longText')?.setValidators([Validators.required]);
    } else if (this.field.isRequired && this.name() === 'shortText') {
      this.textField.get('shortText')?.setValidators([Validators.required]);
    //THe field is not required. Only need to set email and url.
    } else if (!this.field.isRequired && this.name() === 'email') {
      this.textField.get('email')?.setValidators([Validators.email]);
    } else if (!this.field.isRequired && this.name() === 'url') {
      this.textField.get('url')?.setValidators([this.fieldValidation.urlValidation()]);
    }

  }

  /**
   * FormControlName.
   *
   * @returns A string based on the field type.
   */
   name(): string {
    switch(this.field.questionType.typeString) {
      case this.fieldTypeEnum.LongText:
        return 'longText';
      case this.fieldTypeEnum.URL:
        return 'url';
      case this.fieldTypeEnum.Email:
        return 'email';
      default:
        return 'shortText';
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
    val && this.textField.setValue(val, { emitEvent: false });
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
    this.textField.valueChanges.subscribe(fn);
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
    isDisabled ? this.textField.disable() : this.textField.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.textField.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }

}
