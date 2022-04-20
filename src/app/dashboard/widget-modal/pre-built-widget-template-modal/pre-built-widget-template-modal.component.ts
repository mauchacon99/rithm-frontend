import { Component, Input } from '@angular/core';
import { WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
/**
 * The component for pre built widget modal.
 */
@Component({
  selector: 'app-pre-built-widget-template-modal',
  templateUrl: './pre-built-widget-template-modal.component.html',
  styleUrls: ['./pre-built-widget-template-modal.component.scss'],
})
export class PreBuiltWidgetTemplateModalComponent {
  /** Type of widget to show. */
  @Input() widgetType: WidgetType = WidgetType.PreBuiltContainer;

  /** Widget type for validation. */
  enumWidgetType = WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate;

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = dashboardService.dataTemplatePreviewWidgetModal;
  }
}
