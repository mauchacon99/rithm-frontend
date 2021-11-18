
/**
 * Represents all information about a connection line between any two stations.
 *
 */
 export interface ConnectionLineInfo {

  /** The name of the station from which connection starts. */
  readonly connectionStartStationName: string;

  /** The name of the station from which connection end. */
  readonly connectionEndStationName: string;

  /** The id of the station from which connection starts. */
  readonly connectionStartStationRithmId: string;

  /** The id of the station from which connection end. */
  readonly connectionEndStationRithmId: string;

  /** The path of connection line. */
  readonly path: Path2D;
}
