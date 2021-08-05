import { Component, Input } from '@angular/core';
import { QuestionFieldType, Question } from 'src/models';

/**
 * Reusable component for every date field.
 */
@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss']
})
export class DateFieldComponent {

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

}
