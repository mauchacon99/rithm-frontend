import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator, Validators
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Question, QuestionFieldType } from 'src/models';
/**
 * Station Field Component.
 */
@Component({
  selector: 'app-station-field[field][movableUp][movableDown]',
  templateUrl: './station-field.component.html',
  styleUrls: ['./station-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StationFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => StationFieldComponent),
      multi: true
    }
  ]
})
export class StationFieldComponent implements OnInit, ControlValueAccessor, Validator {
  /** The form to add to the template.*/
  stationFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** Can the field be moved up. */
  @Input() movableUp!: boolean;

  /** Can the field be moved down? */
  @Input() movableDown!: boolean;

  /** Add new field label from toolbar. */
  @Input() toolBar!: boolean;

  /** The field control button clicked. */
  @Output() clickedFieldControl = new EventEmitter<string>();

  /** The field type. */
  fieldType = QuestionFieldType;

  /** Instruction field to display. */
  instructionField: Question = {
    prompt: 'Instructions',
    instructions: '',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.LongText,
      validationExpression: '.+'
    },
    isReadOnly: false,
    isRequired: false,
    isPrivate: false
  };

  /** Label field to display. */
  labelField: Question = {
    prompt: 'Label',
    instructions: '',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.ShortText,
      validationExpression: '.+'
    },
    isReadOnly: false,
    isRequired: true,
    isPrivate: false
  };

  /** The field for adding an option to a select field. */
  selectOptionField: Question = {
    prompt: 'Add Option',
    instructions: '',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.ShortText,
      validationExpression: '.+'
    },
    isReadOnly: false,
    isRequired: true,
    isPrivate: false
  };

  /** The field for adding an item to a checklist field. */
  checklistOptionField: Question = {
    prompt: 'Add Item',
    instructions: '',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.ShortText,
      validationExpression: '.+'
    },
    isReadOnly: false,
    isRequired: true,
    isPrivate: false
  };

  /** Array of options for a select/multi-select/checklist field. */
  options: Question[] = [];

  constructor(
    private fb: FormBuilder,
  ) { }

  /**
   * On component initialization.
   */
  ngOnInit(): void {
    this.labelField.questionType.typeString = this.field.questionType.typeString;
    if (this.field.questionType.typeString === this.fieldType.Select
      || this.field.questionType.typeString === this.fieldType.MultiSelect
      || this.field.questionType.typeString === this.fieldType.CheckList) {
      this.addOption(this.field.questionType.typeString);
    }


    this.stationFieldForm = this.fb.group({
      instructionsField: ['', []],
      [this.field.questionType.typeString]: ['', [Validators.required]],
      optionField: ['', [Validators.required]]
    });
  }

  /**
   * Inform parent how the field should be moved or removed based on the button clicked.
   *
   * @param button The field control button click.
   */
  fieldControlClick(button: string): void {
    this.clickedFieldControl.emit(button);
  }

  /**
   * Add an option to the options array.
   *
   * @param fieldType The field type.
   */
  addOption(fieldType: QuestionFieldType): void {
    this.options.push(fieldType === QuestionFieldType.Select ? this.selectOptionField : this.checklistOptionField);
  }

  /**
   * Remove an option from the options array.
   *
   * @param index The index of the field to remove.
   */
  removeOption(index: number): void {
    this.options.splice(index, 1);
  }

  /**
   * Sets the required status of a field.
   *
   * @param ob Observes MatCheckbox changes.
   */
  setRequired(ob: MatCheckboxChange): void {
    this.field.isRequired = ob.checked;
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
    val && this.stationFieldForm.setValue(val, { emitEvent: false });
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
    this.stationFieldForm.valueChanges.subscribe(fn);
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
    isDisabled ? this.stationFieldForm.disable() : this.stationFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.stationFieldForm.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }
}
