import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
// eslint-disable-next-line max-len
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
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

  /** The document field to display. */
  @Input() field!: Question;

  /** Can the field be moved up. */
  @Input() movableUp!: boolean;

  /** Can the field be moved down? */
  @Input() movableDown!: boolean;

  /** Notifies that the field control to remove the field has been selected. */
  @Output() remove = new EventEmitter();

  /** Notifies that the field control to move the field has been selected. */
  @Output() move: EventEmitter<'up' | 'down'> = new EventEmitter();

  /** The form to add to the template.*/
  stationFieldForm!: FormGroup;

  /** The field type. */
  fieldType = QuestionFieldType;

  /** Instruction field to display. */
  instructionField: Question = {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Instructions',
    questionType: QuestionFieldType.Instructions,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  };

  /** Label field to display. */
  labelField: Question = {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Name your field',
    questionType: QuestionFieldType.ShortText,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
    value: ''
  };

  /** The field for adding an option to a select field. */
  selectOptionField: Question = {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Add Option',
    questionType: QuestionFieldType.ShortText,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  };

  /** The field for adding an item to a checklist field. */
  checklistOptionField: Question = {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Add Item',
    questionType: QuestionFieldType.ShortText,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  };

  /** Array of options for a select/multi-select/checklist field. */
  options: Question[] = [];

  /** The RithmId of the Station. */
  @Input() stationRithmId = '';

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
  ) { }

  /**
   * On component initialization.
   */
  ngOnInit(): void {
    this.labelField.value = this.field.prompt;
    this.labelField.questionType = this.field.questionType;
    if (this.field.questionType === this.fieldType.Select
      || this.field.questionType === this.fieldType.MultiSelect
      || this.field.questionType === this.fieldType.CheckList) {
      this.addOption(this.field.questionType);
    }
    this.stationFieldForm = this.fb.group({
      instructionsField: [''],
      [this.field.questionType]: [''],
      optionField: ['']
    });
    this.stationFieldForm.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        // eslint-disable-next-line no-console
       this.stationService.touchStationForm();
      });
  }

  /**
   * Emits a new move event to move the field up.
   */
  moveFieldUp(): void {
    this.move.emit('up');
  }

  /** Emits a new move event to move the field down. */
  moveFieldDown(): void {
    this.move.emit('down');
  }

  /** Emits a new event to remove the field. */
  removeField(): void {
    this.remove.emit();
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
   * @param checkboxEvent Event fired when the checkbox changes.
   */
  setRequired(checkboxEvent: MatCheckboxChange): void {
    this.field.isRequired = checkboxEvent.checked;
    this.stationService.touchStationForm();
  }

  /**
   * Sets the private status of a field.
   *
   * @param checkboxEvent Observes MatCheckbox changes.
   */
  setPrivate(checkboxEvent: MatCheckboxChange): void {
    this.field.isPrivate = checkboxEvent.checked;
    this.stationService.touchStationForm();
  }

  /**
   * Sets the read-only status of a field.
   *
   * @param checkboxEvent Event fired when the checkbox changes.
   */
  setEditable(checkboxEvent: MatCheckboxChange): void {
    this.field.isReadOnly = checkboxEvent.checked;
    if (!this.field.isReadOnly) {
       this.field.isRequired = false;
    }
    this.stationService.touchStationForm();
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
    val && this.stationFieldForm.patchValue(val, { emitEvent: false });
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
        message: 'Station field is invalid'
      }
    };
  }
}
