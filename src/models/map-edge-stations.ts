/**
 * Represents the X or Y mapPoints or canvasPoints of the furthest top, right, bottom and left stations.
 */
 export interface MapEdgeStations {

  /** Smallest X coordinate. The left-most station. */
  minX: number;

  /** Largest X coordinate. The right-most station. */
  maxX: number;

  /** Smallest Y coordinate. The top-most station. */
  minY: number;

  /** Largest Y coordinate. The bottom-most station. */
  maxY: number;

}
