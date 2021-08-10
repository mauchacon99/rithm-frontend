import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from '@angular/forms';
import { QuestionFieldType, Question } from 'src/models';

/**
 * Reusable component for every field involving a checkbox.
 */
@Component({
  selector: 'app-check-field',
  templateUrl: './check-field.component.html',
  styleUrls: ['./check-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckFieldComponent),
      multi: true
    }
  ]
})
export class CheckFieldComponent implements OnInit, ControlValueAccessor, Validator {
  /** The form to add this field in the template. */
  checkField!: FormGroup;

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
      case this.fieldTypeEnum.CheckList:
        this.checkField = this.fb.group({
          checkList: [false, []]
        });
        break;
      default:
        this.checkField = this.fb.group({
          checkBox: [false, []]
        });
      }

    //Logic to determine if a field should be required, and the validators to give it.
    //The field is required. Validators.required must be included.
    if (this.field.isRequired && this.name() === 'checkList') {
      this.checkField.get('checkList')?.setValidators([Validators.requiredTrue]);
    } else if (this.field.isRequired && this.name() === 'checkBox') {
      this.checkField.get('CheckBox')?.setValidators([Validators.requiredTrue]);
    }
  }

  /**
   * FormControlName.
   *
   * @returns A string based on the field type.
   */
  name(): string {
    switch(this.field.questionType.typeString) {
      case this.fieldTypeEnum.CheckList:
        return 'checkList';
      default:
        return 'checkBox';
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
    val && this.checkField.setValue(val, { emitEvent: false });
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
    this.checkField.valueChanges.subscribe(fn);
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
    isDisabled ? this.checkField.disable() : this.checkField.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.checkField.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }

}
