import { ConnectedStationInfo } from './connected-station-info';

/**
 * Represents forward and previous stations for a specific document.
 */
 export interface ForwardPreviousStationsDocument {

  /** The list of previous stations. */
  previousStations: ConnectedStationInfo[];

  /** The list of following stations. */
  followingStations: ConnectedStationInfo[];
}
