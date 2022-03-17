import { Component, Input } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { WidgetType } from 'src/models';

/**
 * The component for templates widgets of the groups.
 */
@Component({
  selector: 'app-group-widget-template-modal[widgetType]',
  templateUrl: './group-widget-template-modal.component.html',
  styleUrls: ['./group-widget-template-modal.component.scss']
})
export class GroupWidgetTemplateModalComponent {
  /** Type of widget to show. */
  @Input() widgetType:WidgetType = WidgetType.GroupSearch;

  /** Data static for each template by widgetType. */
  dataTemplate;

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = dashboardService.dataTemplatePreviewWidgetModal;
  }
}
