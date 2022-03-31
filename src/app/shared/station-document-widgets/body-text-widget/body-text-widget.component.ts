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
  @Output() openSettingDrawer: EventEmitter<Question> =
    new EventEmitter<Question>();

  /**
   * Open setting drawer.
   *
   * @param field The field for the setting drawer.
   */
  handleOpenSettingDrawer(field?: Question): void {
    if (this.widgetMode === 'setting') {
      this.openSettingDrawer.emit(field);
    }
  }
}
