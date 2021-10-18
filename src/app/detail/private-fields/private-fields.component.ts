import { Component, Input } from '@angular/core';
import { Question } from 'src/models';

/**
 * Component for station private fields extension panel.
 */
@Component({
  selector: 'app-private-fields',
  templateUrl: './private-fields.component.html',
  styleUrls: ['./private-fields.component.scss']
})
export class PrivateFieldsComponent {

  /** The private questions loaded by station-component. */
  @Input() questions: Question[] = [];

}
