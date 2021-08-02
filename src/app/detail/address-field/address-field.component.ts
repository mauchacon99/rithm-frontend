import { Component, Input } from '@angular/core';
import { FieldType, Question } from 'src/models';

/**
 * Reusable component for every address field.
 */
@Component({
  selector: 'app-address-field',
  templateUrl: './address-field.component.html',
  styleUrls: ['./address-field.component.scss']
})
export class AddressFieldComponent {

    /** The document field to display. */
    @Input() field!: Question;

    /** The field type of the input. */
    fieldTypeEnum = FieldType;

}
