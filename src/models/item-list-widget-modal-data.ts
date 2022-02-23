/**
 * Represents the items of the documents, stations, groups tab.
 */
export interface ItemListWidgetModal {
  /** Station rithm id. */
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

enum itemTypeWidgetModal {
  Document = 'document',
  Station = 'station',
  Group = 'group',
}
