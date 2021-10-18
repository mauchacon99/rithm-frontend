import { FlowMapData, Point } from '.';

export interface FlowMapElement extends FlowMapData {

  /** The points used for the boundary shape of the flow (the points used for the convex hull). */
  boundaryPoints: Point[];
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

    Object.assign(this, flowMapData);
  }
}
