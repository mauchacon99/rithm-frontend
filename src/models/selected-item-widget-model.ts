import { ItemListWidgetModal } from './item-list-widget-modal-data';

/**
 *
 */
export interface SelectedItemWidgetModel {
  /** Identify element in three tabs.  */
  itemType: 'station' | 'document' | 'group' | 'preBuilt';

  /** Element specific. */
  itemList?: ItemListWidgetModal;
}
