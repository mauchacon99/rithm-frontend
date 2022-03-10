import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ItemListWidgetModal, SelectedItemWidgetModel } from 'src/models';

/**
 * Component for item list widget modal.
 */
@Component({
  selector: 'app-item-list-widget-modal[itemListWidgetModal][itemType]',
  templateUrl: './item-list-widget-modal.component.html',
  styleUrls: ['./item-list-widget-modal.component.scss'],
})
export class ItemListWidgetModalComponent {
  /** The item list widget modal. */
  @Input() itemListWidgetModal!: MatTableDataSource<ItemListWidgetModal>;

  /** The item list widget modal. */
  @Input() itemType: 'document' | 'station' | 'group' = 'document';

  /** The type of item clicked on for list-widget-modal to display. */
  @Output() itemSelected = new EventEmitter<SelectedItemWidgetModel>();

  /** Columns to display. */
  displayedColumnsTableDocument: string[] = [
    'mainInformation',
    'generalInformation',
    'action',
  ];

  /**
   * Sending the type for the selected element.
   *
   * @param element The data for the item selected.
   */
  selectTypeElement(element: ItemListWidgetModal): void {
    this.itemSelected.emit({ itemType: this.itemType, itemList: element });
  }
}
