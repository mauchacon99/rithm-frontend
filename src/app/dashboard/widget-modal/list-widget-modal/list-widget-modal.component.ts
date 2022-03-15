import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';

/**
 * The component for list widget modal.
 */
@Component({
  selector: 'app-list-widget-modal[itemWidgetModalSelected]',
  templateUrl: './list-widget-modal.component.html',
  styleUrls: ['./list-widget-modal.component.scss'],
})
export class ListWidgetModalComponent {
  /** Item widget modal selected. */
  @Input() itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Title preview widget selected emit. */
  @Output() previewWidgetSelected = new EventEmitter<string>();

  /** Enum widget types. */
  enumWidgetType = WidgetType;

  /**
   * Emit preview widget selected.
   *
   * @param titlePreviewWidgetSelected String title preview widget selected.
   */
  emitPreviewWidgetSelected(titlePreviewWidgetSelected: string): void {
    this.previewWidgetSelected.emit(titlePreviewWidgetSelected);
  }
}
