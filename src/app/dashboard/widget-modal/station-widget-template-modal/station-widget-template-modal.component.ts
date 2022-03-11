import { Component, Input } from '@angular/core';
import { WidgetType } from 'src/models';

/** Station widget-template. */
@Component({
  selector: 'app-station-widget-template-modal[widgetType]',
  templateUrl: './station-widget-template-modal.component.html',
  styleUrls: ['./station-widget-template-modal.component.scss'],
})
export class StationWidgetTemplateModalComponent {
  /** Widget type for render. */
  @Input() widgetType: WidgetType = WidgetType.Station;

  /** Widget type for validation. */
  enumWidgetType = WidgetType;
}
