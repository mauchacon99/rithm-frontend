import {
  FlowElementHoverItem,
  FlowMapData,
  MapItemStatus,
  Point,
} from '../models';

export interface FlowMapElement extends FlowMapData {
  /** The points used for the boundary shape of the flow (the points used for the convex hull). */
  boundaryPoints: Point[];

  /** Whether the flow is currently being dragged or not. */
  dragging: boolean;

  /** What item the user is currently hovering over on this flow, if any. */
  hoverItem: FlowElementHoverItem;

  /** The path of the flow boundary. */
  path: Path2D;

  /** Whether the station group is disabled for selection or not. */
  disabled: boolean;

  /** Whether the station group is selected or not. */
  selected: boolean;
}

/**
 * Represents all info and behavior for a flow as drawn on the map.
 */
export class FlowMapElement {
  /**
   * Creates a new `FlowMapElement`.
   *
   * @param flowMapData The `FlowMapData` returned from the API.
   */
  constructor(flowMapData: FlowMapData) {
    this.boundaryPoints = [];
    this.dragging = false;
    this.disabled = false;
    this.selected = false;
    this.hoverItem = FlowElementHoverItem.None;
    Object.assign(this, flowMapData);
  }

  /**
   * Checks whether the flow boundary is being hovered over.
   *
   * @param point The cursor location.
   * @param ctx The rendering context for the canvas.
   */
  checkElementHover(point: Point, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.lineWidth = 30;
    if (this.path) {
      this.hoverItem = ctx.isPointInStroke(this.path, point.x, point.y)
        ? FlowElementHoverItem.Boundary
        : FlowElementHoverItem.None;
    }
    ctx.restore();
  }

  /**
   * Whether the flow is empty and does not contain any stations or sub flows.
   *
   * @returns Whether the flow is empty.
   */
  get isEmpty(): boolean {
    return !this.stations.length && !this.subFlows.length;
  }

  /**
   * Marks the status of the flow element as updated.
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
   * Marks the status of the flow element as deleted.
   */
  markAsDeleted(): void {
    if (this.status !== MapItemStatus.Created) {
      this.status = MapItemStatus.Deleted;
    } else {
      throw new Error(
        'You seem to be trying mark a locally created flow group as deleted. ' +
          'You should instead remove it from the array of flows.'
      );
    }
  }
}
