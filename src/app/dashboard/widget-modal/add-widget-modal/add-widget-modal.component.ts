import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectedItemWidgetModel } from 'src/models';

/** Dialog Modal for add widgets. */
@Component({
  selector: 'app-add-widget-modal',
  templateUrl: './add-widget-modal.component.html',
  styleUrls: ['./add-widget-modal.component.scss'],
})
export class AddWidgetModalComponent {
  /** The type of item clicked on for list-widget-modal to display. */
  @Output() itemSelected = new EventEmitter<SelectedItemWidgetModel>();

  /** Tab Parents selected. */
  tabParentSelect = 0;

  /** Dashboard rithm id. */
  dashboardRithmId = '';

  /** */
  identifyShowElement: 'document' | 'station' | 'group' | 'tabs' = 'tabs';

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
   * Sending the type for the selected element.
   *
   * @param element The type of element.
   */
  selectTypeElement(element: SelectedItemWidgetModel): void {
    this.itemSelected.emit(element);
    this.identifyShowElement = element.itemType;
  }
}
