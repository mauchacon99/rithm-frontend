
/**
 * Represents all information about a connected station.
 *
 * @see `ConnectedStationInfoViewModel` model in the back end.
 */
export interface ConnectedStationInfo {

  /** Station rithm id. */
  readonly rithmId: string;

  /** The name of the station. */
  readonly name: string;
}
