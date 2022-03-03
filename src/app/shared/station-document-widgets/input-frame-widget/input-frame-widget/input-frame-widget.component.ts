import { Component, Input } from '@angular/core';
import { QuestionFieldType, Question } from 'src/models';

/**
 * Reusable component for displaying an input-frame-widget in station grid.
 */
@Component({
  selector: 'app-input-frame-widget',
  templateUrl: './input-frame-widget.component.html',
  styleUrls: ['./input-frame-widget.component.scss'],
})
export class InputFrameWidgetComponent {
  /** Questions to be displayed inside the widget. */
  @Input() fields!: Question[];

  /** The mode to display fields inside the widget. */
  @Input() widgetMode = 'layout';

  /** The list of questionFieldTypes. */
  fieldTypes = QuestionFieldType;
}
