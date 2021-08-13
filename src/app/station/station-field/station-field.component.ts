import { Component, Input } from '@angular/core';
import { Question } from 'src/models';
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

}
