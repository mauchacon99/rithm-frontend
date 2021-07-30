import { Component, Input } from '@angular/core';
import { FieldType, Question } from 'src/models';

/**
 * Reusable component for all fields involving numbers.
 */
@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss']
})
export class NumberFieldComponent {
  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = FieldType;
}
