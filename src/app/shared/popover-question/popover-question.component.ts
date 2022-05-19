import { Component, Input } from '@angular/core';
import {
  Question
} from 'src/models';
/**
 * Component for displaying full question data in popover.
 */
@Component({
  selector: 'app-popover-question[question]',
  templateUrl: './popover-question.component.html',
  styleUrls: ['./popover-question.component.scss']
})
export class PopoverQuestionComponent  {

/** Question to display. */
@Input() question!: Question;

}
