/**
 * Represents the items of the documents, stations, groups tab in modal to add widgets.
 */
export interface ItemListWidgetModal {
  /** RithmId for documents stations and groups. */
  rithmId: string;
  /** Name documents station and groups. */
  name: string;
  /** Total documents. */
  totalDocuments?: number;
  /** Group Name when this data is from station. */
  groupName?: string;
  /** Whether is chained. */
  isChained: boolean;
  /** Total station. */
  totalStations?: number;
  /** Total sub groups. */
  totalSubGroups?: number;
  /** Name for station when this data is from document. */
  stationName?: string;
  /** Name for station group name when this data is from document. */
  stationGroupName?: string;
}
