import { Component, forwardRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, NG_VALUE_ACCESSOR, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Question, QuestionFieldType } from 'src/models';
/**
 * Station Template Component.
 */
@Component({
  selector: 'app-station-template',
  templateUrl: './station-template.component.html',
  styleUrls: ['./station-template.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StationTemplateComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => StationTemplateComponent),
      multi: true
    }
  ]
})
export class StationTemplateComponent {
  /** The form to add to station. */
  stationTemplateForm!: FormGroup;

  /** The station fields in the template area. */
  @Input() stationFields!: Question[];

  /** Add new field label from toolbar. */
  @Input() toolBar!: boolean;

  /** The general instructions field. */
  readonly stationInstructionsField = {
    prompt: 'General Instructions',
    instructions: '',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.LongText,
      validationExpression: '.+',
    },
    isReadOnly: false,
    isRequired: false,
    isPrivate: false
  };

  constructor(
    private fb: FormBuilder
  ) {
    this.stationTemplateForm = this.fb.group({
      stationFieldForm: this.fb.control('')
    });
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
    val && this.stationTemplateForm.setValue(val, { emitEvent: false });
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
    this.stationTemplateForm.valueChanges.subscribe(fn);
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
    isDisabled ? this.stationTemplateForm.disable() : this.stationTemplateForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.stationTemplateForm.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }

  /**
   * Can the field be moved up.
   *
   * @param fieldIndex The index of the field.
   * @returns True if the field can be moved up.
   */
  canFieldMoveUp(fieldIndex: number): boolean {
    return fieldIndex === 0 ? false : this.stationFields.length - 1 === fieldIndex ? true : true;
  }

  /**
   * Can the field be moved down.
   *
   * @param fieldIndex The index of the field.
   * @returns True if the field can be moved down.
   */
  canFieldMoveDown(fieldIndex: number): boolean {
    return fieldIndex === 0 ? true : this.stationFields.length - 1 === fieldIndex ? false : true;
  }

}
