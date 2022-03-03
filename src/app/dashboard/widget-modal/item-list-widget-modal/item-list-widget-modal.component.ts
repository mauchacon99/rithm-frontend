import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ItemListWidgetModal } from 'src/models';

/**
 * Component for item list widget modal.
 */
@Component({
  selector: 'app-item-list-widget-modal[itemListWidgetModal][type]',
  templateUrl: './item-list-widget-modal.component.html',
  styleUrls: ['./item-list-widget-modal.component.scss'],
})
export class ItemListWidgetModalComponent {
  /** The item list widget modal. */
  @Input() itemListWidgetModal!: MatTableDataSource<ItemListWidgetModal>;

  /** The item list widget modal. */
  @Input() type!: string;

  /** Columns to display. */
  displayedColumnsTableDocument: string[] = [
    'mainInformation',
    'generalInformation',
    'action',
  ];
}
