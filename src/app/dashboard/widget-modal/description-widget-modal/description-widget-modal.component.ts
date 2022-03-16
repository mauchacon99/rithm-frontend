import { Component, Input } from '@angular/core';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

/** Description widget modal. */
@Component({
  selector: 'app-description-widget-modal[itemWidgetModalSelected][widgetType]',
  templateUrl: './description-widget-modal.component.html',
  styleUrls: ['./description-widget-modal.component.scss'],
})
export class DescriptionWidgetModalComponent {
  /** Widget item selected. */
  @Input() itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Title preview widget item selected. */
  @Input() widgetType!: WidgetType | 'defaultDocument';

  /** Data static for each template by widgetType. */
  dataTemplate;

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = this.dashboardService.dataTemplatePreviewWidgetModal;
  }
}
