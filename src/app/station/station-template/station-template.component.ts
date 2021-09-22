import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALUE_ACCESSOR, NG_VALIDATORS,
  ValidationErrors, Validator
} from '@angular/forms';
import { Question, QuestionFieldType } from 'src/models';

/**
 * Component for the list of fields on the station template.
 */
@Component({
  selector: 'app-station-template[fields]',
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
export class StationTemplateComponent implements ControlValueAccessor, Validator {

  /** The station fields in the template area. */
  @Input() fields!: Question[];

  /** The form to add to station. */
  stationTemplateForm: FormGroup;

  /** The general instructions field. */
  readonly stationInstructionsField: Question = {
    prompt: 'General Instructions',
    instructions: '',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.LongText,
      validationExpression: '.+',
    },
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    children: [],
  };

  constructor(
    private fb: FormBuilder
  ) {
    this.stationTemplateForm = this.fb.group({
      stationFieldForm: this.fb.control('')
    });
  }

  /**
   * Can the field be moved up.
   *
   * @param fieldIndex The index of the field.
   * @returns True if the field can be moved up.
   */
  canFieldMoveUp(fieldIndex: number): boolean {
    return fieldIndex === 0 ? false : this.fields.length - 1 === fieldIndex ? true : true;
  }

  /**
   * Can the field be moved down.
   *
   * @param fieldIndex The index of the field.
   * @returns True if the field can be moved down.
   */
  canFieldMoveDown(fieldIndex: number): boolean {
    return fieldIndex === 0 ? true : this.fields.length - 1 === fieldIndex ? false : true;
  }

  /**
   * Moves a field up or down within the template.
   *
   * @param direction The direction to move the field.
   * @param index The current index of the field in the list.
   */
  move(direction: 'up' | 'down', index: number): void {
    const questionToMove = this.fields.splice(index, 1);
    const directionToMove = direction === 'up' ? -1 : 1;
    this.fields.splice(index + directionToMove, 0, questionToMove[0]);
  }

  /**
   * Removes a field from the template.
   *
   * @param index The current index of the field in the list.
   */
  remove(index: number): void {
    this.fields.splice(index, 1);
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
        message: 'Station template form is invalid'
      }
    };
  }

}
