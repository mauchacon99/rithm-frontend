import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardItem, SelectedItemWidgetModel, WidgetType } from 'src/models';

/** Dialog Modal for add widgets. */
@Component({
  selector: 'app-add-widget-modal',
  templateUrl: './add-widget-modal.component.html',
  styleUrls: ['./add-widget-modal.component.scss'],
})
export class AddWidgetModalComponent {
  /**
   * Get data widget with stringify.
   *
   * @returns Data of widget by typeWidget.
   */
  get dataWidget(): string {
    let dataWidget = '';
    if (this.itemWidgetModalSelected.itemType === 'document') {
      dataWidget = JSON.stringify({
        documentRithmId: this.itemWidgetModalSelected.itemList.rithmId,
        columns: [],
      });
    } else if (this.itemWidgetModalSelected.itemType === 'station') {
      dataWidget = JSON.stringify({
        stationRithmId: this.itemWidgetModalSelected.itemList.rithmId,
        columns: [{ name: 'name' }],
      });
    }

    return dataWidget;
  }

  /** Selected item to show list widget. */
  itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Title of preview widget selected. */
  previewWidgetTypeSelected: WidgetType | 'defaultDocument' | null = null;

  /** Dashboard rithm id. */
  dashboardRithmId = '';

  /** The element type to be shown. */
  identifyShowElement: 'document' | 'station' | 'group' | 'tabs' = 'tabs';

  /** Tab Parents selected. */
  tabParentSelect = 0;

  /** Enum widget type. */
  enumWidgetType = WidgetType;

  constructor(
    private dialogRef: MatDialogRef<AddWidgetModalComponent>,
    @Inject(MAT_DIALOG_DATA) public matData: string
  ) {
    this.dashboardRithmId = matData;
  }

  /** Close add widgets modal. */
  closeModal(): void {
    this.dialogRef.close();
  }

  /**
   * Getting the type for the selected element.
   *
   * @param element The type of element.
   */
  selectTypeElement(element: SelectedItemWidgetModel): void {
    this.itemWidgetModalSelected = element;
    this.identifyShowElement = element.itemType;
  }

  /** Return to widget list when identifyShowElement is not tabs. */
  returnCustomLists(): void {
    this.previewWidgetTypeSelected
      ? (this.previewWidgetTypeSelected = null)
      : (this.identifyShowElement = 'tabs');
  }

  /**
   * Parse item rows for widget.
   *
   * @returns A number of minItemRows.
   */
  private minItemRowsWidget(): number {
    return this.previewWidgetTypeSelected ===
      this.enumWidgetType.DocumentListBanner ||
      this.previewWidgetTypeSelected === this.enumWidgetType.StationTableBanner
      ? 2
      : 1;
  }

  /**
   * Parse widget type.
   *
   * @returns Only data of interface WidgetType.
   */
  private widgetTypeToItem(): WidgetType {
    return !this.previewWidgetTypeSelected ||
      this.previewWidgetTypeSelected === 'defaultDocument'
      ? this.enumWidgetType.Document
      : this.previewWidgetTypeSelected;
  }

  /** Save widget. */
  addWidget(): void {
    const minItemRows = this.minItemRowsWidget();
    const widgetType = this.widgetTypeToItem();

    const widgetItem: DashboardItem = {
      rithmId: '',
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
