import { Component, Input } from '@angular/core';
import { Question } from 'src/models';

/**
 * Component for all fields.
 */
@Component({
  selector: 'app-all-fields',
  templateUrl: './all-fields.component.html',
  styleUrls: ['./all-fields.component.scss']
})
export class AllFieldsComponent {

/** The private questions loaded by station-component. */
@Input() questions: Question[] = [];

}
