import { Component, Input, OnInit } from '@angular/core';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

/** Description widget modal. */
@Component({
  selector:
    'app-description-widget-modal[itemWidgetModalSelected][widgetType][dataWidget]',
  templateUrl: './description-widget-modal.component.html',
  styleUrls: ['./description-widget-modal.component.scss'],
})
export class DescriptionWidgetModalComponent implements OnInit {
  /** Widget item selected. */
  @Input() itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Widget type to preview widget selected. */
  @Input() widgetType: WidgetType | 'defaultDocument' = WidgetType.Document;

  /** Data widget for render widgets. */
  @Input() dataWidget!: string;

  /** Enum widget type. */
  enumWidgetType = WidgetType;

  /** Widget type without default. */
  widgetTypeWithoutDefault!: WidgetType;

  /** Data Description for description-widget-modal.  */
  dataDescriptionTemplate = {
    // station data
    [WidgetType.Station]: {
      type: 'Station Template',
      customizable: 'Table Columns',
      description: `By default. the table has a single column showing each document in your selected station.
      Custom banner images can also be added to the widget`,
    },
    // StationTableBanner data
    [WidgetType.StationTableBanner]: {
      type: 'Station Template',
      customizable: 'Table Columns & Image',
      description: `By default. the table has a single column showing each document in your selected station.
      Additional columns of data can be added as desired. Custom banner images can also be added to the widget`,
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
    // StationGroupSearch data
    [WidgetType.StationGroupSearch]: {
      type: 'Group Template',
      customizable: 'Search result values',
      description: `User can query all the values saved on documents within a flow. By default the search results display the document
      name and the field that matches your search.`,
    },
  };

  /** Data static for each template by widgetType. */
  dataTemplate;

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = dashboardService.dataTemplatePreviewWidgetModal;
  }

  /** Initial method. */
  ngOnInit(): void {
    this.widgetTypeWithoutDefault =
      this.widgetType === 'defaultDocument'
        ? this.enumWidgetType.Document
        : this.widgetType;
  }
}
