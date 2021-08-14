import { Component, Input } from '@angular/core';
import { Question, QuestionFieldType } from 'src/models';
/**
 * Station Field Component.
 */
@Component({
  selector: 'app-station-field[field]',
  templateUrl: './station-field.component.html',
  styleUrls: ['./station-field.component.scss']
})
export class StationFieldComponent {
  /** The document field to display. */
  @Input() field!: Question;

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
    isRequired: false,
    isPrivate: false
  };

  /** Array of options for a select/multi-select/checklist field. */
  options: Question[] = [this.labelField];

  /**
   * Add an option to the options array.
   */
  addOption(): void {
    this.options.push(this.labelField);
  }

}
