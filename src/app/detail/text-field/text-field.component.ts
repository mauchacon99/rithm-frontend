import { Component, forwardRef, Input, OnInit } from '@angular/core';
// eslint-disable-next-line max-len
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { FieldType, Question } from 'src/models';

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
  fieldTypeEnum = FieldType;

  constructor(
    private fb: FormBuilder,
  ) { }

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.textField = this.fb.group({
      shortText: ['', [Validators.required]],
      // longText: ['', [Validators.required]],
      // email: ['', [Validators.email, Validators.required]],
      // url: ['', [Validators.required]]
    });
  }

  /**
   * FormControlName.
   *
   * @returns A string based on the field type.
   */
   name(): string {
    switch(this.field?.type) {
      case this.fieldTypeEnum.URL:
        return 'url';
      case this.fieldTypeEnum.EMAIL:
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
