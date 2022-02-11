/**
 * Represents all info about a station.
 */
export interface Station {
  /** The global Rithm ID for this station. */
  rithmId: string;

  /** The name of the station. */
  name: string;

  /** Instructions for working in the station. */
  instructions: string;
}
