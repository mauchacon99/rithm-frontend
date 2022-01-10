import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { QuestionFieldType, Question } from 'src/models';

/**
 * Reusable component for every field on a document.
 */
@Component({
  selector: 'app-document-field[field]',
  templateUrl: './document-field.component.html',
  styleUrls: ['./document-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocumentFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DocumentFieldComponent),
      multi: true,
    },
  ],
})
export class DocumentFieldComponent implements ControlValueAccessor, Validator {
  /** The form to add to the template.*/
  documentFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type. */
  fieldTypes = QuestionFieldType;

  constructor(private fb: FormBuilder) {
    this.documentFieldForm = this.fb.group({
      textFieldForm: this.fb.control(''),
      numberFieldForm: this.fb.control(''),
      selectFieldForm: this.fb.control(''),
      dateFieldForm: this.fb.control(''),
      checkFieldForm: this.fb.control(''),
      nestedFieldForm: this.fb.control(''),
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
    val && this.documentFieldForm.setValue(val, { emitEvent: false });
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
    this.documentFieldForm.valueChanges.subscribe(fn);
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
    isDisabled
      ? this.documentFieldForm.disable()
      : this.documentFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.documentFieldForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'User form is invalid',
          },
        };
  }
}
