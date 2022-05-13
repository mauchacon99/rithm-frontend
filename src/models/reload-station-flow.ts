/**
 * Represents the data to reload stations when flowed a document.
 */
export interface ReloadStationFlow {
  /** The current station. */
  currentStation: string;

  /** The station flowed. */
  stationFlow: string[];

  /** Document rithmId flowed. */
  documentFlow: string;
}
