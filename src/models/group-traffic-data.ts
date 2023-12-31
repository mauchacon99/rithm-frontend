/** Interface to graph document traffic by station. */
export interface GroupTrafficData {
  /** RithmId group station. */
  stationGroupRithmId: string;
  /** Title the station group. */
  title: string;
  /** Station names. */
  labels: string[];
  /** Represents the number of documents per station. */
  stationDocumentCounts: number[];
  /** Represents the average number of document flows per station. */
  averageDocumentFlow: number[];
  /** Each position represents tooltip of each position of the averageDocumentFlow. */
  averageDocumentFlowLabels: string[];
}
