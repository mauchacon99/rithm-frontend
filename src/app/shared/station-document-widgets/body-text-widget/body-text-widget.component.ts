import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Question } from 'src/models';
/**
 * Reusable component for displaying an body-text-widget in station grid.
 */
@Component({
  selector: 'app-body-text-widget',
  templateUrl: './body-text-widget.component.html',
  styleUrls: ['./body-text-widget.component.scss'],
})
export class BodyTextWidgetComponent {
  /** The mode to display fields inside the widget. */
  @Input() widgetMode!: 'layout' | 'setting';

  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer: EventEmitter<Question | string> =
    new EventEmitter<Question | string>();

  /** Text value to show on body text widget. */
  bodyTextValue = 'Write something descriptive';

  /**
   * Open setting drawer.
   *
   * @param field The field for the setting drawer.
   */
  handleOpenSettingDrawer(field?: Question | string): void {
    if (this.widgetMode === 'setting') {
      this.openSettingDrawer.emit(field);
    }
  }
}
