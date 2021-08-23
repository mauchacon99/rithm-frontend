import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Question, QuestionFieldType } from 'src/models';
/**
 * Station Field Component.
 */
@Component({
  selector: 'app-station-field[field][movableUp][movableDown]',
  templateUrl: './station-field.component.html',
  styleUrls: ['./station-field.component.scss']
})
export class StationFieldComponent implements OnInit {
  /** The document field to display. */
  @Input() field!: Question;

  /** Can the field be moved up. */
  @Input() movableUp!: boolean;

  /** Can the field be moved down? */
  @Input() movableDown!: boolean;

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

  /**
   * On component initialization.
   */
  ngOnInit(): void {
    this.labelField.questionType.typeString = this.field.questionType.typeString;
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

}
