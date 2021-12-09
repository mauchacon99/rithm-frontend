import { MapEdgeStations } from "./map-edge-stations";

/**
 * Represents the data needed to calculate the edge of the map.
 */
 export interface MapEdgeData {

  /** The mapPoints of the furthest left, right, top and bottom stations. */
  mapPoints: MapEdgeStations;

  /** The mapPoints of the furthest left, right, top and bottom stations. */
  canvasPoints: MapEdgeStations;

}
