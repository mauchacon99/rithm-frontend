import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectedItemWidgetModel } from 'src/models';

/** Dialog Modal for add widgets. */
@Component({
  selector: 'app-add-widget-modal',
  templateUrl: './add-widget-modal.component.html',
  styleUrls: ['./add-widget-modal.component.scss'],
})
export class AddWidgetModalComponent {
  /** Dashboard rithm id. */
  dashboardRithmId = '';

  /** The element type to be shown. */
  identifyShowElement: 'document' | 'station' | 'group' | 'tabs' = 'tabs';

  /** Selected item to show list widget. */
  itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Tab Parents selected. */
  tabParentSelect = 0;

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
    this.identifyShowElement = 'tabs';
  }
}
