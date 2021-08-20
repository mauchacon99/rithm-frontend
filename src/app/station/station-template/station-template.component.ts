import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Question, QuestionFieldType } from 'src/models';
/**
 * Station Template Component.
 */
@Component({
  selector: 'app-station-template',
  templateUrl: './station-template.component.html',
  styleUrls: ['./station-template.component.scss']
})
export class StationTemplateComponent {
  /** The form to add to station. */
  stationTemplateForm!: FormGroup;

  /** The station fields in the template area. */
  @Input() stationFields!: Question[];

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
