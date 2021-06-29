
/**
 * Represents all information about connected Station.
 */
 export interface ConnectedStationInfo {

  /** The name name of the station. */
  stationName: string;

  /** Total documents currently in the station. */
  totalDocuments: number;

  /** Whether the station generates new documents or not. */
  isGenerator: boolean;
}
