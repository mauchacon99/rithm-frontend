import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from '@angular/forms';
import { QuestionFieldType, Question } from 'src/models';

/**
 * Reusable field for every select/multi select dropdown.
 */
@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true
    }
  ]
})
export class SelectFieldComponent implements OnInit, ControlValueAccessor, Validator {
  /** The form to add this field in the template. */
  selectField!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  constructor(
    private fb: FormBuilder,
  ) { }

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    switch(this.field.questionType.typeString) {
      case this.fieldTypeEnum.LongText:
        this.selectField = this.fb.group({
          multiSelect: ['', []]
        });
        break;
      default:
        this.selectField = this.fb.group({
          select: ['', []]
        });
    }

    //Logic to determine if a field should be required, and the validators to give it.
    //The field is required. Validators.required must be included.
    if (this.field.isRequired && this.name() === 'multiSelect') {
      this.selectField.get('multiSelect')?.setValidators([Validators.required]);
    } else if (this.field.isRequired && this.name() === 'select') {
      this.selectField.get('select')?.setValidators([Validators.required]);
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
        return 'multiSelect';
      default:
        return 'select';
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
    val && this.selectField.setValue(val, { emitEvent: false });
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
    this.selectField.valueChanges.subscribe(fn);
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
    isDisabled ? this.selectField.disable() : this.selectField.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.selectField.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }

}
