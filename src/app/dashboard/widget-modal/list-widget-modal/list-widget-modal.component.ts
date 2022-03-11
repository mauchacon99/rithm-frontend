import { Component } from '@angular/core';
import { WidgetType } from 'src/models';

/**
 * The component for list widget modal.
 */
@Component({
  selector: 'app-list-widget-modal',
  templateUrl: './list-widget-modal.component.html',
  styleUrls: ['./list-widget-modal.component.scss'],
})
export class ListWidgetModalComponent {
  /** Enum widget types. */
  widgetType = WidgetType;
}
