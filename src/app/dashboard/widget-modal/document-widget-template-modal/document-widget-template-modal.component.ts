import { Component, Input } from '@angular/core';
import { WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

/**
 * The component for templates widgets of the document.
 */
@Component({
  selector: 'app-document-widget-template-modal[widgetType]',
  templateUrl: './document-widget-template-modal.component.html',
  styleUrls: ['./document-widget-template-modal.component.scss'],
})
export class DocumentWidgetTemplateModalComponent {
  /** Type of widget to show. */
  @Input() widgetType:
    | WidgetType.Document
    | WidgetType.DocumentListBanner
    | 'defaultDocument' = 'defaultDocument';

  /** Enum widgetType. */
  enumWidgetType = WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate;

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = dashboardService.dataTemplatePreviewWidgetModal;
  }
}
