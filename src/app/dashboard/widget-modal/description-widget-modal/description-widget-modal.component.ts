import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DashboardItem, SelectedItemWidgetModel, WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { AddWidgetModalComponent } from 'src/app/dashboard/widget-modal/add-widget-modal/add-widget-modal.component';

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

  /**
   * Get data widget with stringify.
   *
   * @returns Data of widget by typeWidget.
   */
  get dataWidget(): string {
    let dataWidget = '';

    switch (this.itemWidgetModalSelected.itemType) {
      case 'document':
        dataWidget = JSON.stringify({
          documentRithmId: this.itemWidgetModalSelected.itemList.rithmId,
          columns: [],
        });
        break;
      case 'station':
        dataWidget = JSON.stringify({
          stationRithmId: this.itemWidgetModalSelected.itemList.rithmId,
          columns: [{ name: 'name' }],
        });
        break;
      case 'group':
        dataWidget = JSON.stringify({
          stationGroupRithmId: this.itemWidgetModalSelected.itemList.rithmId,
        });
        break;
    }
    return dataWidget;
  }

  /** Enum widget type. */
  enumWidgetType = WidgetType;

  /** Widget type without default. */
  widgetTypeWithoutDefault!: WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate;

  constructor(
    private dashboardService: DashboardService,
    private dialogRef: MatDialogRef<AddWidgetModalComponent>
  ) {
    this.dataTemplate = dashboardService.dataTemplatePreviewWidgetModal;
  }

  /** Initial method. */
  ngOnInit(): void {
    this.widgetTypeWithoutDefault =
      this.widgetType === 'defaultDocument'
        ? this.enumWidgetType.Document
        : this.widgetType;
  }

  /**
   * Parse item rows for widget.
   *
   * @returns A number of minItemRows.
   */
  private minItemRowsWidget(): number {
    return this.widgetTypeWithoutDefault ===
      this.enumWidgetType.DocumentListBanner ||
      this.widgetTypeWithoutDefault === this.enumWidgetType.StationTableBanner
      ? 2
      : 1;
  }

  /** Save widget. */
  addWidget(): void {
    const minItemRows = this.minItemRowsWidget();
    const widgetType = this.widgetTypeWithoutDefault;
    const rithmId = `TEMPID-${Math.random().toString(36).slice(2)}`;
    const widgetItem: DashboardItem = {
      rithmId,
      cols: 3,
      rows: minItemRows,
      x: 0,
      y: 0,
      widgetType,
      data: this.dataWidget,
      minItemRows,
      minItemCols: 3,
      image: null,
    };
    this.dialogRef.close(widgetItem);
  }
}
