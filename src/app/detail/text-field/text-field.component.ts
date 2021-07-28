import { Component, Input } from '@angular/core';
import { Question } from 'src/models';
import { FieldType } from 'src/models/enums/field-type.enum';

/**
 * Reusable component for all fields involving text.
 */
@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent {
    /** The document field to display. */
    @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = FieldType;

}
