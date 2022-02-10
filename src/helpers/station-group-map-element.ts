import {
  StationGroupElementHoverItem,
  StationGroupMapData,
  MapItemStatus,
  Point,
  PathButton,
} from '../models';
import {
  GROUP_CHARACTER_SIZE,
  GROUP_NAME_HEIGHT,
  STATION_GROUP_NAME_PADDING,
} from 'src/app/map/map-constants';

export interface StationGroupMapElement extends StationGroupMapData {
  /** The points used for the boundary shape of the station group (the points used for the convex hull). */
  boundaryPoints: Point[];

  /** Whether the station group is currently being dragged or not. */
  dragging: boolean;

  /** What item the user is currently hovering over on this station group, if any. */
  hoverItem: StationGroupElementHoverItem;

  /** The path of the station group boundary. */
  path: Path2D;

  /** Whether the station group is disabled for selection or not.*/
  disabled: boolean;

  /** Whether the station group is selected or not. */
  selected: boolean;
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
    this.disabled = false;
    this.selected = false;
    this.hoverItem = StationGroupElementHoverItem.None;
    Object.assign(this, stationGroupMapData);
  }

  /**
   * Checks whether the station group boundary is being hovered over.
   *
   * @param point The cursor location.
   * @param canvasPoint The event canvas point.
   * @param ctx The rendering context for the canvas.
   * @param scale The scale of the map.
   */
  checkElementHover(
    point: Point,
    canvasPoint: Point,
    ctx: CanvasRenderingContext2D,
    scale: number
  ): void {
    //Saves the current state of the canvas context.
    ctx.save();
    //This will allow users to click in the area around group boundaries without having to click in the rendered space.
    ctx.lineWidth = 30;
    //If there's a defined path.
    if (this.path) {
      /* If cursor is hovering over a group boundary set hoverItem to that,
      if cursor is over group name, set hoverItem to that,
      otherwise set it to none. */
      if (
        this.pathButtons !== undefined &&
        this.status === MapItemStatus.Pending
      ) {
        for (const iconButton of this.pathButtons) {
          // If the mouse hovers over the icon button then hoverItem changes.
          if (
            this.isPointInStationGroupPendingButtons(
              canvasPoint,
              iconButton,
              ctx
            )
          ) {
            this.hoverItem = iconButton.typeButton;
            break;
          }
        }
      } else if (ctx.isPointInStroke(this.path, point.x, point.y)) {
        this.hoverItem = StationGroupElementHoverItem.Boundary;
      } else if (this.isPointInStationGroupName(canvasPoint, scale)) {
        this.hoverItem = StationGroupElementHoverItem.Name;
      } else {
        this.hoverItem = StationGroupElementHoverItem.None;
      }
    }
    //Restore the saved context state and undo the changes to it.
    ctx.restore();
  }

  /**
   * Checks whether point is in a station group name or not.
   *
   * @param point The cursor location.
   * @param scale The scale of the map.
   * @returns A boolean.
   */
  isPointInStationGroupName(point: Point, scale: number): boolean {
    const scaledStationHeight = GROUP_NAME_HEIGHT * scale;
    const scaledStationWidth = this.title.length * GROUP_CHARACTER_SIZE * scale;

    //Check if cursor is within a rectangle set around the station group name.
    return (
      point.x >= this.boundaryPoints[0].x - STATION_GROUP_NAME_PADDING &&
      point.x <= this.boundaryPoints[0].x + scaledStationWidth &&
      point.y >=
        this.boundaryPoints[this.boundaryPoints.length - 1].y -
          STATION_GROUP_NAME_PADDING &&
      point.y <=
        this.boundaryPoints[this.boundaryPoints.length - 1].y +
          scaledStationHeight
    );
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
    //Only mark as updated if the station group isn't already marked as created or deleted.
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
    //Only mark as deleted if the station group isn't already marked as created.
    if (
      this.status !== MapItemStatus.Created &&
      this.status !== MapItemStatus.Pending
    ) {
      this.status = MapItemStatus.Deleted;
    } else {
      throw new Error(
        'You seem to be trying mark a locally created station group as deleted. ' +
          'You should instead remove it from the array of station groups.'
      );
    }
  }

  /**
   * Checks whether point is in a station group buttons in status pending or not.
   *
   * @param point The cursor location.
   * @param pathButtons The path of the station group button.
   * @param ctx The rendering context for the canvas.
   * @returns A boolean.
   */
  isPointInStationGroupPendingButtons(
    point: Point,
    pathButtons: PathButton,
    ctx: CanvasRenderingContext2D
  ): boolean {
    // check whether the mouse is hovering over the icon path
    // Compares the path with the current point of the mouse to canvas context.
    return ctx.isPointInStroke(
      pathButtons.path,
      point.x * window.devicePixelRatio,
      point.y * window.devicePixelRatio
    );
  }
}
