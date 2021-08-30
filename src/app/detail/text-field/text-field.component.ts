import { Component, forwardRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, ValidatorFn, Validators
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
  /** Output the value of the field. */
  @Output() removeOptionField = new EventEmitter<Question>();

  /** The form to add this field in the template. */
  textFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** Add new field label from toolbar. */
  @Input() toolBar!: boolean;

  /** Does the field need to be removable? */
  @Input() removableField!: boolean;

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
    this.textFieldForm = this.fb.group({
      [this.field.questionType.typeString]: ['', []]
    });

    //Logic to determine if a field should be required, and the validators to give it.
    const validators: ValidatorFn[] = [];

    //The field is required. Validators.required must be included.
    if (this.field.isRequired) {
      validators.push(Validators.required);
    }

    //Need to set email and url.
    switch (this.field.questionType.typeString) {
      case QuestionFieldType.Email:
        validators.push(Validators.email);
        break;
      case QuestionFieldType.URL:
        validators.push(this.fieldValidation.urlValidation());
        break;
    }

    this.textFieldForm.get(this.field.questionType.typeString)?.setValidators(validators);

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
  // eslint-disable-next-line
  writeValue(val: any): void {
    val && this.textFieldForm.setValue(val, { emitEvent: false });
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
    this.textFieldForm.valueChanges.subscribe(fn);
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
    isDisabled ? this.textFieldForm.disable() : this.textFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.textFieldForm.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'Text field form is invalid'
      }
    };
  }

  /**
   * Emits an event to parent component to remove field from form.
   *
   * @param field The field to emit.
   */
  removeField(field: Question): void {
    this.removeOptionField.emit(field);
  }

}
