/**
 * Represents the items of the documents, stations, groups tab in modal to add widgets.
 */
export interface ItemListWidgetModal {
  /** Document rithmId. */
  documentRithmId?: string;
  /** Station rithmId. */
  stationRithmId?: string;
  /** Group rithmId. */
  groupRithmId?: string;
  /** Document name. */
  documentName?: string;
  /** Station name. */
  stationName?: string;
  /** Group name. */
  groupName?: string;
  /** Whether the group is chained. */
  isChainedGroup?: boolean;
  /** Total documents. */
  totalDocuments?: number;
  /** Total station. */
  totalStations?: number;
  /** Total sub groups. */
  totalSubGroups?: number;
}
