import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from 'src/models';

/**
 *
 */
@Component({
  selector: 'app-banner-widget',
  templateUrl: './banner-widget.component.html',
  styleUrls: ['./banner-widget.component.scss'],
})
export class BannerWidgetComponent {
  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer: EventEmitter<Question | string> =
    new EventEmitter<Question | string>();

  /** The mode to display fields inside the widget. */
  @Input() widgetMode!: 'layout' | 'setting';
}
