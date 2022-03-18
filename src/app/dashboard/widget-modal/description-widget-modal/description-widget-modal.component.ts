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

  /** Enum widget type. */
  enumWidgetType = WidgetType;

  /** Widget type without default. */
  widgetTypeWithoutDefault!: WidgetType;

  /** Data widget. */
  dataWidget!: string;

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
    // StationGroupSearch data
    [WidgetType.StationGroupSearch]: {
      type: 'Group Template',
      customizable: 'Search result values',
      description: `User can query all the values saved on documents within a flow. By default the search results display the document
      name and the field that matches your search.`,
    },
  };

  /** Data required for widget. */
  dataWidgetRequired!: {
    /** Data required for widget Station. */
    [WidgetType.Station]: undefined;
    /** Data required for widget StationTableBanner. */
    [WidgetType.StationTableBanner]: undefined;
    /** Data required for widget StationTableBanner. */
    [WidgetType.StationGroup]: undefined;
    /** Data required for widget Document. */
    [WidgetType.Document]: {
      /** Document rithmID. */
      documentRithmId: string;
      /** Columns of document. */
      columns: [];
    };
    /** Data required for widget DocumentListBanner. */
    [WidgetType.DocumentListBanner]: {
      /** Document rithmID. */
      documentRithmId: string;
      /** Columns of document. */
      columns: [];
    };
    /** Data required for widget StationGroupSearch. */
    [WidgetType.StationGroupSearch]: {
      /** Station group. */
      stationGroup: string;
    };
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

    this.dataWidgetRequired = {
      [WidgetType.Station]: undefined,
      [WidgetType.StationTableBanner]: undefined,
      [WidgetType.StationGroup]: undefined,
      [WidgetType.Document]: {
        documentRithmId: this.itemWidgetModalSelected.itemList.rithmId,
        columns: [],
      },
      [WidgetType.DocumentListBanner]: {
        documentRithmId: this.itemWidgetModalSelected.itemList.rithmId,
        columns: [],
      },
      [WidgetType.StationGroupSearch]: {
        stationGroup: '',
      },
    };
    this.dataWidget = JSON.stringify(
      this.dataWidgetRequired[this.widgetTypeWithoutDefault]
    );
  }
}
