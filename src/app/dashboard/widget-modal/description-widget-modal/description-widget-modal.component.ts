import { Component, Input, OnInit } from '@angular/core';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { DescriptionModalData } from 'src/models/description-modal-data';

/** Description widget modal. */
@Component({
  selector: 'app-description-widget-modal[itemWidgetModalSelected][widgetType]',
  templateUrl: './description-widget-modal.component.html',
  styleUrls: ['./description-widget-modal.component.scss'],
})
export class DescriptionWidgetModalComponent implements OnInit {
  /** Widget item selected. */
  @Input() itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Widget type to preview widget selected. */
  @Input() widgetType: WidgetType | 'defaultDocument' = WidgetType.Document;

  /** Data widget for app-document-widget. */
  dataWidget!: string;

  /** Enum widget type. */
  enumWidgetType = WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate;

  /** Data Description for description-widget-modal.  */
  dataDescriptionTemplate!: DescriptionModalData;

  /** Widget type without default. */
  widgetTypeWithoutDefault!: WidgetType;

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = dashboardService.dataTemplatePreviewWidgetModal;
  }

  /** Initial method. */
  ngOnInit(): void {
    this.widgetTypeWithoutDefault =
      this.widgetType === 'defaultDocument'
        ? this.enumWidgetType.Document
        : this.widgetType;

    this.dataDescriptionTemplate =
      this.dashboardService.dataDescriptionTemplate[
        this.widgetTypeWithoutDefault
      ];

    this.dataWidget = JSON.stringify({
      documentRithmId: this.itemWidgetModalSelected.itemList.rithmId,
      columns: [],
    });
  }
}
