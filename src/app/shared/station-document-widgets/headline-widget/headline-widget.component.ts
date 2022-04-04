import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from 'src/models';
/**
 * Reusable component for displaying an headline-widget in station grid.
 */
@Component({
  selector: 'app-headline-widget',
  templateUrl: './headline-widget.component.html',
  styleUrls: ['./headline-widget.component.scss'],
})
export class HeadlineWidgetComponent {
  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer: EventEmitter<Question | string> =
    new EventEmitter<Question | string>();

  /** The mode to display fields inside the widget. */
  @Input() widgetMode!: 'layout' | 'setting';

  /** Headline text for the widget. */
  public headlineTextValue = 'Form Title';

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
