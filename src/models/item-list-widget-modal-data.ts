import { itemTypeWidgetModal } from './enums/item-type-widget-modal';

/**
 * Represents the items of the documents, stations, groups tab in modal to add widgets.
 */
export interface ItemListWidgetModal {
  /** Id of the element according to the list type. */
  rithmId: string;
  /** Title. */
  title: string;
  /** Subtitle. */
  subTitle: string;
  /** Group. */
  group: string;
  /** Group type. */
  groupType: string;
  /** Item type. */
  itemType: itemTypeWidgetModal;
}
