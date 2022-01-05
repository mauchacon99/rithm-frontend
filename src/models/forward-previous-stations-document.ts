import { ConnectedStationInfo } from './connected-station-info';

/**
 * Represents forward and previous stations for a specific document.
 */
export interface ForwardPreviousStationsDocument {
  /** Station rithm id. */
  rithmId: string;

  /** The list of previous stations. */
  previousStations: ConnectedStationInfo[];

  /** The list of next stations. */
  nextStations: ConnectedStationInfo[];
}
