import {
  StationGroupElementHoverItem,
  StationGroupMapData,
  MapItemStatus,
  Point,
} from '../models';

export interface StationGroupMapElement extends StationGroupMapData {
  /** The points used for the boundary shape of the station group (the points used for the convex hull). */
  boundaryPoints: Point[];

  /** Whether the station group is currently being dragged or not. */
  dragging: boolean;

  /** What item the user is currently hovering over on this station group, if any. */
  hoverItem: StationGroupElementHoverItem;

  /** The path of the station group boundary. */
  path: Path2D;
}

/**
 * Represents all info and behavior for a station group as drawn on the map.
 */
export class StationGroupMapElement {
  /**
   * Creates a new `StationGroupMapElement`.
   *
   * @param stationGroupMapData The `StationGroupMapData` returned from the API.
   */
  constructor(stationGroupMapData: StationGroupMapData) {
    this.boundaryPoints = [];
    this.dragging = false;
    this.hoverItem = StationGroupElementHoverItem.None;
    Object.assign(this, stationGroupMapData);
  }

  /**
   * Checks whether an element in the station is being hovered over.
   *
   * @param point The cursor location.
   * @param ctx The rendering context for the canvas.
   */
  checkElementHover(point: Point, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.lineWidth = 30;
    if (this.path) {
      this.hoverItem = ctx.isPointInStroke(this.path, point.x, point.y)
        ? StationGroupElementHoverItem.Boundary
        : StationGroupElementHoverItem.None;
    }
    ctx.restore();
  }

  /**
   * Whether the station group is empty and does not contain any stations or sub station groups.
   *
   * @returns Whether the station group is empty.
   */
  get isEmpty(): boolean {
    return !this.stations.length && !this.subStationGroups.length;
  }

  /**
   * Marks the status of the station group element as updated.
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
   * Marks the status of the station group element as deleted.
   */
  markAsDeleted(): void {
    if (this.status !== MapItemStatus.Created) {
      this.status = MapItemStatus.Deleted;
    } else {
      throw new Error(
        'You seem to be trying mark a locally created station group as deleted. ' +
          'You should instead remove it from the array of station groups.'
      );
    }
  }
}
