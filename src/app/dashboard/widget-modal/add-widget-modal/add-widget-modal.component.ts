import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';

/** Dialog Modal for add widgets. */
@Component({
  selector: 'app-add-widget-modal',
  templateUrl: './add-widget-modal.component.html',
  styleUrls: ['./add-widget-modal.component.scss'],
})
export class AddWidgetModalComponent {
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
}
