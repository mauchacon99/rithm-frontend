import { MapItemStatus } from '.';
import { Point } from './point';

/**
 * Represents all info about a station as returned from and to be sent to the API.
 */
export interface StationMapData {
  /** The global Rithm id for the station. */
  readonly rithmId: string;

  /** The name of the station. */
  stationName: string;

  /** The number of documents in the station. */
  readonly noOfDocuments: number;

  /** The coordinates for the location of the station on the overall map. */
  mapPoint: Point;

  /** The ids of the stations that connect TO this station. */
  previousStations: string[];

  /** The ids of the stations that connect FROM this station. */
  nextStations: string[];

  /** The status of the station (what should happen to this station). */
  status: MapItemStatus;

  /** The notes on a station for an admin. */
  notes: string;
}
