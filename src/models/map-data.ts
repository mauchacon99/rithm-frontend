import { StationGroupMapData, StationMapData } from '.';

/**
 * Contains all the data displayed on the map.
 */
export interface MapData {
  /** List of all stations in the map. */
  stations: StationMapData[];

  /** List of all station groups in the map. */
  stationGroups: StationGroupMapData[];
}
