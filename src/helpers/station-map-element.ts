import {
  BADGE_MARGIN,
  BADGE_RADIUS,
  BUTTON_RADIUS,
  BUTTON_Y_MARGIN,
  DEFAULT_CANVAS_POINT,
  NODE_RADIUS,
  NODE_Y_MARGIN,
  STATION_HEIGHT,
  STATION_WIDTH,
} from 'src/app/map/map-constants';
import {
  StationMapData,
  Point,
  StationElementHoverItem,
  MapMode,
  MapItemStatus,
} from 'src/models';

export interface StationMapElement extends StationMapData {
  /** The coordinates for the location of the station as rendered in the viewport. */
  canvasPoint: Point;

  /** Whether the station itself is currently being dragged. */
  dragging: boolean;

  /** The item the user is currently hovering over on this station, if any. */
  hoverItem: StationElementHoverItem;

  /** Whether a connected station is being added from this station or not. */
  isAddingConnected: boolean;
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
    this.hoverItem = StationElementHoverItem.None;
    this.isAddingConnected = false;
    Object.assign(this, stationMapData);
  }

  /**
   * Checks whether an element in the station is being hovered over.
   *
   * @param point The cursor location.
   * @param mode The current mapMode.
   * @param scale The scale of the map.
   */
  checkElementHover(point: Point, mode: MapMode, scale: number): void {
    //Connection node.
    if (this.isPointInConnectionNode(point, mode, scale)) {
      this.hoverItem = StationElementHoverItem.Node;
      //Option Button.
    } else if (this.isPointInOptionButton(point, mode, scale)) {
      this.hoverItem = StationElementHoverItem.Button;
      //Document badge.
    } else if (this.isPointInDocumentBadge(point, mode, scale)) {
      this.hoverItem = StationElementHoverItem.Badge;
      //station itself.
    } else if (this.isPointInStation(point, mode, scale)) {
      this.hoverItem = StationElementHoverItem.Station;
      //No hover.
    } else {
      this.hoverItem = StationElementHoverItem.None;
    }
  }

  /**
   * Checks whether point is in a connection node.
   *
   * @param point The cursor location.
   * @param mode The current mapMode.
   * @param scale The scale of the map.
   * @returns A boolean.
   */
  isPointInConnectionNode(point: Point, mode: MapMode, scale: number): boolean {
    const startingX = this.canvasPoint.x;
    const startingY = this.canvasPoint.y;
    const scaledStationHeight = STATION_HEIGHT * scale;
    const scaledStationWidth = STATION_WIDTH * scale;

    const interactiveNodeRadius = NODE_RADIUS * scale + 8;
    const scaledNodeYMargin = NODE_Y_MARGIN * scale;

    return (
      point.x >= startingX + scaledStationWidth - interactiveNodeRadius &&
      point.x <= startingX + scaledStationWidth + interactiveNodeRadius &&
      point.y >=
        startingY +
          scaledStationHeight -
          scaledNodeYMargin -
          interactiveNodeRadius &&
      point.y <=
        startingY +
          scaledStationHeight -
          scaledNodeYMargin +
          interactiveNodeRadius &&
      mode !== MapMode.View
    );
  }

  /**
   * Checks whether point is in an option button.
   *
   * @param point The cursor location.
   * @param mode The current mapMode.
   * @param scale The scale of the map.
   * @returns A boolean.
   */
  isPointInOptionButton(point: Point, mode: MapMode, scale: number): boolean {
    const startingX = this.canvasPoint.x;
    const startingY = this.canvasPoint.y;
    const scaledStationWidth = STATION_WIDTH * scale;

    const interactiveButtonRadius = BUTTON_RADIUS * scale + 9;
    const scaledButtonYMargin = BUTTON_Y_MARGIN * scale;
    const scaledButtonMargin = BADGE_MARGIN * scale;

    return (
      point.x >=
        startingX +
          scaledStationWidth -
          scaledButtonMargin -
          interactiveButtonRadius &&
      point.x <=
        startingX +
          scaledStationWidth -
          scaledButtonMargin +
          interactiveButtonRadius &&
      point.y >= startingY + scaledButtonYMargin - interactiveButtonRadius &&
      point.y <= startingY + scaledButtonYMargin + interactiveButtonRadius &&
      mode !== MapMode.View
    );
  }

  /**
   * Checks whether point is in a document badge.
   *
   * @param point The cursor location.
   * @param mode The current mapMode.
   * @param scale The scale of the map.
   * @returns A boolean.
   */
  isPointInDocumentBadge(point: Point, mode: MapMode, scale: number): boolean {
    const startingX = this.canvasPoint.x;
    const startingY = this.canvasPoint.y;
    const scaledStationWidth = STATION_WIDTH * scale;

    const interactiveBadgeRadius = BADGE_RADIUS * scale;
    const scaledBadgeMargin = BADGE_MARGIN * scale;

    return (
      point.x >=
        startingX +
          scaledStationWidth -
          scaledBadgeMargin -
          interactiveBadgeRadius &&
      point.x <=
        startingX +
          scaledStationWidth -
          scaledBadgeMargin +
          interactiveBadgeRadius &&
      point.y >= startingY + scaledBadgeMargin - interactiveBadgeRadius &&
      point.y <= startingY + scaledBadgeMargin + interactiveBadgeRadius
    );
  }

  /**
   * Checks whether point is in a station.
   *
   * @param point The cursor location.
   * @param mode The current mapMode.
   * @param scale The scale of the map.
   * @returns A boolean.
   */
  isPointInStation(point: Point, mode: MapMode, scale: number): boolean {
    const scaledStationHeight = STATION_HEIGHT * scale;
    const scaledStationWidth = STATION_WIDTH * scale;

    return (
      point.x >= this.canvasPoint.x &&
      point.x <= this.canvasPoint.x + scaledStationWidth &&
      point.y >= this.canvasPoint.y &&
      point.y <= this.canvasPoint.y + scaledStationHeight
    );
  }

  /**
   * Marks the status of the station element as updated.
   */
  markAsUpdated(): void {
    if (
      this.status !== MapItemStatus.Created &&
      this.status !== MapItemStatus.Deleted
    ) {
      this.status = MapItemStatus.Updated;
    }
  }

  /**
   * Marks the status of the station element as deleted.
   */
  markAsDeleted(): void {
    if (this.status !== MapItemStatus.Created) {
      this.status = MapItemStatus.Deleted;
    } else {
      throw new Error(
        'You seem to be trying mark a locally created station as deleted. ' +
          'You should instead remove it from the array of stations.'
      );
    }
  }

  /**
   * Compares the modified station with stored station data.
   *
   * @param station The station to compare this station against.
   * @returns Returns TRUE is data is same else FALSE.
   */
  isIdenticalTo(station: StationMapElement): boolean {
    return (
      JSON.stringify(this.previousStations) ===
        JSON.stringify(station.previousStations) &&
      JSON.stringify(this.nextStations) ===
        JSON.stringify(station.nextStations) &&
      JSON.stringify(this.mapPoint) === JSON.stringify(station.mapPoint) &&
      this.stationName === station.stationName &&
      this.notes === station.notes
    );
  }
}
