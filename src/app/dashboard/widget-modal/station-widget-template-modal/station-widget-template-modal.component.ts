import { Component, Input } from '@angular/core';
import { WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

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

  /** Widget type for validation. */
  enumWidgetType = WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate;

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = this.dashboardService.dataTemplatePreviewWidgetModal;
  }
}
