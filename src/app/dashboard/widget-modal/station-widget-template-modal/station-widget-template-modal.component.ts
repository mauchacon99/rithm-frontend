import { Component, Input } from '@angular/core';
import { WidgetType } from 'src/models';

/** Station widget-template. */
@Component({
  selector: 'app-station-widget-template-modal[renderWidgetType]',
  templateUrl: './station-widget-template-modal.component.html',
  styleUrls: ['./station-widget-template-modal.component.scss'],
})
export class StationWidgetTemplateModalComponent {
  /** Widget type for render. */
  @Input() renderWidgetType: WidgetType = WidgetType.Station;

  /** Widget type for validation. */
  widgetType = WidgetType;
}
