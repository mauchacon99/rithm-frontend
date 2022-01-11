import { Component, forwardRef, Input, NgZone, OnInit } from '@angular/core';
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
import { first, Subject, takeUntil } from 'rxjs';
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
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckFieldComponent),
      multi: true,
    },
  ],
})
export class CheckFieldComponent
  implements OnInit, ControlValueAccessor, Validator
{
  /** The form to add this field in the template. */
  checkFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  constructor(private fb: FormBuilder, private ngZone: NgZone) {}

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    // eslint-disable-next-line prefer-const
    let fields: { [key: string]: unknown } = {};

    this.field.possibleAnswers?.forEach((something, index) => {
      fields[`checkItem${index}`] = [false];
    });

    this.checkFieldForm = this.fb.group(fields);

    //Logic to determine if a field should be required, and the validators to give it.
    const validators: ValidatorFn[] = [];

    //The field is required. Validators.required must be included.
    if (this.field.isRequired) {
      validators.push(Validators.required);
    }

    //Set required error if no checkbox has been checked.
    this.checkFieldForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((checkItem) => {
        const checks = Object.values(checkItem);
        if (checks.some((check) => check)) {
          this.checkFieldForm.setErrors(null);
        } else {
          this.checkFieldForm.setErrors({ required: true });
        }
      });

    this.checkFieldForm.setValidators(validators);
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
    val && this.checkFieldForm.setValue(val, { emitEvent: false });
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
    this.checkFieldForm.valueChanges.subscribe(fn);
    this.ngZone.onStable.pipe(first()).subscribe(() => {
      this.checkFieldForm.markAsTouched();
      this.checkFieldForm.updateValueAndValidity();
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
    isDisabled ? this.checkFieldForm.disable() : this.checkFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.checkFieldForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'Check field form is invalid',
          },
        };
  }
}
