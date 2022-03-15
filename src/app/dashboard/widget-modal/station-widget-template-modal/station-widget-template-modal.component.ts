import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetType } from 'src/models';

/** Station widget-template. */
@Component({
  selector: 'app-station-widget-template-modal[widgetType]',
  templateUrl: './station-widget-template-modal.component.html',
  styleUrls: ['./station-widget-template-modal.component.scss'],
})
export class StationWidgetTemplateModalComponent {
  /** Type of widget to show. */
  @Input() widgetType: WidgetType.Station | WidgetType.StationTableBanner =
    WidgetType.Station;

  /** Title preview widget selected emit. */
  @Output() previewWidgetSelected = new EventEmitter<string>();

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

  /** Emit preview widget selected. */
  emitPreviewWidgetSelected(): void {
    this.previewWidgetSelected.emit(this.dataTemplate[this.widgetType].title);
  }
}
