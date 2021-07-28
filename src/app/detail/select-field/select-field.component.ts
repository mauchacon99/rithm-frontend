import { Component, Input } from '@angular/core';
import { Question } from 'src/models/question';

/**
 * Reusable field for every select/multi select dropdown.
 */
@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent {
  /** The document field to display. */
  @Input() field!: Question;

}
