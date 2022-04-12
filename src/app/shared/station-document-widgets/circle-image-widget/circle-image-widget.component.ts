import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from 'src/models';

/**
 *
 */
@Component({
  selector: 'app-circle-image-widget',
  templateUrl: './circle-image-widget.component.html',
  styleUrls: ['./circle-image-widget.component.scss'],
})
export class CircleImageWidgetComponent {
  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer: EventEmitter<Question | string> =
    new EventEmitter<Question | string>();

  /** The mode to display fields inside the widget. */
  @Input() widgetMode!: 'layout' | 'setting';
}
