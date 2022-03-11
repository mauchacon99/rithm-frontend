import { Component, Input } from '@angular/core';
import { WidgetType } from 'src/models/enums';

/**
 * The component for list widget modal.
 */
@Component({
  selector: 'app-list-widget-modal[selectedWidgetType]',
  templateUrl: './list-widget-modal.component.html',
  styleUrls: ['./list-widget-modal.component.scss'],
})
export class ListWidgetModalComponent {
  /** Type of tabs. */
  @Input() selectedWidgetType: 'document' | 'station' | 'group' = 'document';

  /** Widget type for station-widget-template. */
  widgetType = WidgetType;
}
