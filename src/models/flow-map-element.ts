import { FlowElementHoverType, FlowMapData, Point } from '.';

export interface FlowMapElement extends FlowMapData {

  /** The points used for the boundary shape of the flow (the points used for the convex hull). */
  boundaryPoints: Point[];

  /** Whether the flow is currently being dragged or not. */
  dragging: boolean;

  /** Whether the flow is currently hovering? */
  hoverActive: FlowElementHoverType;
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
   * Whether the flow is empty and does not contain any stations or sub flows.
   *
   * @returns Whether the flow is empty.
   */
  get isEmpty(): boolean {
    return !this.stations && !this.subFlows;
  }

}
