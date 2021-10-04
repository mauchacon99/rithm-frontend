import { StationMapData } from '.';

/**
 * Contains all the elements displayed on the map.
 */
export interface MapData {

  /** List of all stations in the map. */
  stations: StationMapData[];

  /** List of all flows in the map. */
  flows: unknown[]; // Define this later
}
