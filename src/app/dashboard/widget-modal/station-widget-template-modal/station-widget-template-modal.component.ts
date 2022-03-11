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
  /** Type of widget to show. */
  @Input() widgetType: WidgetType.Station | WidgetType.StationTableBanner =
    WidgetType.Station;

  /** Widget type for validation. */
  enumWidgetType = WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate = {
    [this.enumWidgetType.Station]: {
      title: 'Table',
      description:
        'Build a custom table with specific values from each document in the station.',
    },
    [this.enumWidgetType.StationTableBanner]: {
      title: 'Table With Banner Image',
      description:
        'Build a custom table with specific values from each document in the station.',
    },
  };
}
