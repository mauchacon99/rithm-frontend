import { DEFAULT_CANVAS_POINT } from 'src/app/map/map-constants';
import { StationMapData, Point, StationElementHoverType } from 'src/models';

export interface StationMapElement extends StationMapData {
  /** The coordinates for the location of the station as rendered in the viewport. */
  canvasPoint: Point;

  /** Whether the station is currently being dragged or not. */
  dragging: boolean;

  /** Whether the station is currently hovering? */
  hoverActive: StationElementHoverType;
}

/**
 * Represents all info and behavior for a station as drawn on the map.
 */
export class StationMapElement {

  /**
   * Creates a new `StationMapElement`.
   *
   * @param stationMapData The `StationMapData` returned from the API.
   */
  constructor(stationMapData: StationMapData) {
    this.canvasPoint = DEFAULT_CANVAS_POINT;
    this.dragging = false;
    this.hoverActive = StationElementHoverType.none;
    Object.assign(this, stationMapData);
  }
}
