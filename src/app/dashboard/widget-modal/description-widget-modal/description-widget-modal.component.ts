import { Component, Input, OnInit } from '@angular/core';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

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
  dataDescriptionTemplate = {
    // station data
    [WidgetType.Station]: {
      type: '',
      customizable: '',
      description: ``,
    },
    // StationTableBanner data
    [WidgetType.StationTableBanner]: {
      type: '',
      customizable: '',
      description: ``,
    },
    // groups data
    [WidgetType.StationGroup]: {
      type: '',
      customizable: '',
      description: ``,
    },
    // document data
    [WidgetType.Document]: {
      type: 'Document Template',
      customizable: 'List Values',
      description: `By default, the list widget displays all of the values associated with a document.
      Values can be optionally be hidden from on the widget in needed.`,
    },
    // DocumentListBanner data
    [WidgetType.DocumentListBanner]: {
      type: 'Document Template',
      customizable: 'List Values & Image',
      description: `Upload an image from the container to display as a banner image.
      List values can also be optionally hidden from on the widget as needed.`,
    },
  };

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

    this.dataWidget = JSON.stringify({
      documentRithmId: this.itemWidgetModalSelected.itemList.rithmId,
      columns: [],
    });
  }
}
