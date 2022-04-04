import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from 'src/models';
/**
 *
 */
@Component({
  selector: 'app-title-widget',
  templateUrl: './title-widget.component.html',
  styleUrls: ['./title-widget.component.scss'],
})
export class TitleWidgetComponent {
  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer: EventEmitter<Question | string> =
    new EventEmitter<Question | string>();

  /** The mode to display fields inside the widget. */
  @Input() widgetMode!: 'layout' | 'setting';

  /**Title text value */
  titleTextValue = 'Form Title';

  /**
   * Open setting drawer.
   *
   * @param value The value for the setting drawer.
   */
  openFieldSettingDrawer(value: Question | string): void {
    if (this.widgetMode === 'setting') {
      this.openSettingDrawer.emit(value);
    }
  }
}
