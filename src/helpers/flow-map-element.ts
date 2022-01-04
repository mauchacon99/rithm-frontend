import { FlowElementHoverType, FlowMapData, MapItemStatus, Point } from '../models';

export interface FlowMapElement extends FlowMapData {

  /** The points used for the boundary shape of the flow (the points used for the convex hull). */
  boundaryPoints: Point[];

  /** Whether the flow is currently being dragged or not. */
  dragging: boolean;

  /** Whether the flow is currently hovering? */
  hoverActive: FlowElementHoverType;

  /** The path of the flow boundary. */
  path: Path2D;
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
    this.hoverActive = FlowElementHoverType.None;
    Object.assign(this, flowMapData);
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
      this.hoverActive = ctx.isPointInStroke(this.path, point.x, point.y) ? FlowElementHoverType.Boundary : FlowElementHoverType.None;
    }
    ctx.restore();
  }

  /**
   * Whether the flow is empty and does not contain any stations or sub flows.
   *
   * @returns Whether the flow is empty.
   */
  get isEmpty(): boolean {
    return !this.stations && !this.subFlows;
  }

  /**
   * Marks the status of the flow element as updated.
   */
   markAsUpdated(): void {
    if (this.status !== MapItemStatus.Created && this.status !== MapItemStatus.Deleted) {
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
      throw new Error('You seem to be trying mark a locally created flow group as deleted. ' +
        'You should instead remove it from the array of flows.');
    }
  }

}
