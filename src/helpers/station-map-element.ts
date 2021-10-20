import { DEFAULT_CANVAS_POINT, NODE_RADIUS, NODE_Y_MARGIN, STATION_HEIGHT, STATION_WIDTH } from 'src/app/map/map-constants';
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
    this.hoverActive = StationElementHoverType.None;
    Object.assign(this, stationMapData);
  }

  /**
   * Checks whether an element in the station is being hovered over.
   *
   * @param point The cursor location.
   * @param scale The scale of the map.
   */
  checkElementHover(point: Point, scale: number): void {
    const startingX = this.canvasPoint.x;
    const startingY = this.canvasPoint.y;

    const interactiveNodeRadius = NODE_RADIUS * scale + 8;
    const scaledStationHeight = STATION_HEIGHT * scale;
    const scaledStationWidth = STATION_WIDTH * scale;
    const scaledNodeYMargin = NODE_Y_MARGIN * scale;

    //Connection node.
    if (point.x >= startingX + scaledStationWidth - interactiveNodeRadius
      && point.x <= startingX + scaledStationWidth + interactiveNodeRadius
      && point.y >= startingY + scaledStationHeight - scaledNodeYMargin - interactiveNodeRadius
      && point.y <= startingY + scaledStationHeight - scaledNodeYMargin + interactiveNodeRadius
    ) {
      this.hoverActive = StationElementHoverType.Node;
    //No hover.
    } else {
      this.hoverActive = StationElementHoverType.None;
    }
  }
}
