/** Interface to graph document traffic by station. */
export interface GroupTrafficData {
  /** RithmId group station. */
  stationGroupRithmId: string;
  /** Station names. */
  labels: string[];
  /** Represents the number of documents per station. */
  stationDocuments: number[];
  /** Represents the average number of document flows per station. */
  averageDocumentStation: number[];
}
