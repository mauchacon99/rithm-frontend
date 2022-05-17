import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ColumnsDocumentInfo,
  DashboardItem,
  SelectedItemWidgetModel,
  WidgetType,
} from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { AddWidgetModalComponent } from 'src/app/dashboard/widget-modal/add-widget-modal/add-widget-modal.component';

/** Description widget modal. */
@Component({
  selector:
    'app-description-widget-modal[itemWidgetModalSelected][widgetType][showDetailWidgetPopover]',
  templateUrl: './description-widget-modal.component.html',
  styleUrls: ['./description-widget-modal.component.scss'],
})
export class DescriptionWidgetModalComponent implements OnInit {
  /** Widget item selected. */
  @Input() itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Widget type to preview widget selected. */
  @Input() widgetType: WidgetType | 'defaultDocument' = WidgetType.Document;

  /** Show detail dashboard popover. */
  @Input() showDetailWidgetPopover = false;

  /**
   * Get data widget with stringify.
   *
   * @returns Data of widget by typeWidget.
   */
  get dataWidget(): string {
    if (this.itemWidgetModalSelected.itemType === 'document') {
      return JSON.stringify({
        documentRithmId: this.itemWidgetModalSelected.itemList?.rithmId,
        columns: [],
      });
    } else if (this.itemWidgetModalSelected.itemType === 'station') {
      return JSON.stringify({
        stationRithmId: this.itemWidgetModalSelected.itemList?.rithmId,
        columns:
          this.widgetType === WidgetType.StationMultiline ||
          this.widgetType === WidgetType.StationMultilineBanner
            ? [
                { name: ColumnsDocumentInfo.Name },
                { name: ColumnsDocumentInfo.LastUpdated },
                { name: ColumnsDocumentInfo.AssignedUser },
              ]
            : [{ name: ColumnsDocumentInfo.Name }],
      });
    } else if (this.itemWidgetModalSelected.itemType === 'group') {
      return JSON.stringify(
        this.widgetType === this.enumWidgetType.StationGroupTraffic
          ? {
              valueShowGraphic: 5,
              stationGroupRithmId:
                this.itemWidgetModalSelected.itemList?.rithmId,
            }
          : {
              stationGroupRithmId:
                this.itemWidgetModalSelected?.itemList?.rithmId,
            }
      );
    } else {
      return '';
    }
  }

  /**
   * Get all data of widget.
   *
   * @returns Data of dashboardItem.
   */
  get widgetItem(): DashboardItem {
    const minItemRows = this.minItemRowsWidget();
    const minItemCols = this.minItemColsWidget();

    const widgetType = this.widgetTypeWithoutDefault;
    const rithmId = `TEMPID-${Math.random().toString(36).slice(2)}`;
    return {
      rithmId,
      cols: minItemCols,
      rows: minItemRows,
      x: 0,
      y: 0,
      widgetType,
      data: this.dataWidget,
      minItemRows,
      minItemCols: minItemCols,
    };
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
      this.widgetTypeWithoutDefault ===
        this.enumWidgetType.StationTableBanner ||
      this.widgetTypeWithoutDefault ===
        this.enumWidgetType.ContainerProfileBanner ||
      this.widgetTypeWithoutDefault === this.enumWidgetType.StationMultiline ||
      this.widgetTypeWithoutDefault ===
        this.enumWidgetType.StationMultilineBanner
      ? 2
      : 1;
  }

  /**
   * Parse item cols for widget.
   *
   * @returns A number of minItemCols.
   */
  private minItemColsWidget(): number {
    return this.widgetType === this.enumWidgetType.PreBuiltContainer ||
      this.widgetType === this.enumWidgetType.PreBuiltStation
      ? 4
      : 3;
  }

  /** Save widget. */
  addWidget(): void {
    this.dialogRef.close(this.widgetItem);
  }
}
