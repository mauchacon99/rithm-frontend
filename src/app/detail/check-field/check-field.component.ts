import { Component, Input } from '@angular/core';
import { QuestionFieldType, Question } from 'src/models';

/**
 * Reusable component for every field involving a checkbox.
 */
@Component({
  selector: 'app-check-field',
  templateUrl: './check-field.component.html',
  styleUrls: ['./check-field.component.scss']
})
export class CheckFieldComponent {
  /** The document field to display. */
  @Input() field!: Question;

  /**
   * Whether this check field is for a checklist.
   *
   * @returns True if field is a checklist, false if it a checkbox.
   */
  get isChecklistField(): boolean {
    return this.field.questionType.typeString === QuestionFieldType.CheckList;
  }

}
