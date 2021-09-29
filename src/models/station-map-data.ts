import { Point } from './point';

/**
 * Represents all info about a station as returned from the API.
 */
export interface StationMapData {
  /** The global Rithm id for the station. */
  rithmId?: string;

  /** The name of the station. */
  name: string;

  /** The number of documents in the station. */
  noOfDocuments: number;

  /** The coordinates for the location of the station on the overall map. */
  mapPoint: Point;

  /** The ids of the stations that connect TO this station. */
  incomingStationIds: string[];

  /** The ids of the stations that connect FROM this station. */
  outgoingStationIds: string[];
}
