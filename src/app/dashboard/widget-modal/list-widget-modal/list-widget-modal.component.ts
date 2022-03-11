import { Component, Input } from '@angular/core';
import { SelectedItemWidgetModel } from 'src/models';
import { WidgetType } from 'src/models/enums';

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

  /** Enum widget types. */
  enumWidgetType = WidgetType;
}
