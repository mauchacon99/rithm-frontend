
/**
 * Represents all information about a connected station.
 *
 * @see `ConnectedStationInfoViewModel` model in the back end.
 */
 export interface ConnectedStationInfo {

  /** The name name of the station. */
  stationName: string;

  /** Total documents currently in the station. */
  totalDocuments: number;

  /** Whether the station generates new documents or not. */
  isGenerator: boolean;
}
