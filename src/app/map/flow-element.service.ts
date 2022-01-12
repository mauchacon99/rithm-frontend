import { Injectable } from '@angular/core';
import { FlowMapElement } from 'src/helpers';
import { FlowElementHoverItem, Point } from 'src/models';
import {
  CONNECTION_DEFAULT_COLOR,
  FLOW_PADDING,
  STATION_HEIGHT,
  STATION_WIDTH,
  CONNECTION_LINE_WIDTH,
  BUTTON_DEFAULT_COLOR,
  DEFAULT_SCALE,
  GROUP_NAME_PADDING,
  FONT_SIZE_MODIFIER,
  NODE_HOVER_COLOR,
} from './map-constants';
import { MapService } from './map.service';

/**
 * Service for rendering and other behavior for a flow on the map.
 */
@Injectable({
  providedIn: 'root',
})
export class FlowElementService {
  /** The rendering this.canvasContext for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  /** The default scale value for the station card. */
  private mapScale = DEFAULT_SCALE;

  constructor(private mapService: MapService) {
    this.mapService.mapScale$.subscribe((scale) => (this.mapScale = scale));
  }

  /**
   * Draws all the flow boundaries on the map. Starts from the deepest flows and works back to the root.
   */
  drawFlows(): void {
    if (!this.mapService.flowElements.length) {
      return;
    }
    const rootFlow = this.mapService.flowElements.find(
      (flow) => flow.isReadOnlyRootFlow
    );
    if (!rootFlow) {
      throw new Error('Root flow could not be found');
    }
    this.drawFlow(rootFlow);
  }

  /**
   * Draws a specific flow on the map. Draws any nested flows first through recursion.
   *
   * @param flow The flow to be drawn on the map.
   */
  private drawFlow(flow: FlowMapElement): void {
    // If flow has a sub-flow, draw that first
    flow.subFlows.forEach((subFlowId) => {
      const subFlow = this.mapService.flowElements.find(
        (flowElement) => flowElement.rithmId === subFlowId
      );
      if (!subFlow) {
        throw new Error(
          `Couldn't find a sub-flow for which an id exists: ${subFlowId}`
        );
      }
      this.drawFlow(subFlow);
    });

    if (flow.isReadOnlyRootFlow) {
      return; // No need to calculate/render the root flow
    }

    // Determine the points within the flow
    const pointsWithinFlow: Point[] = [];
    pointsWithinFlow.push(...this.getStationPointsForFlow(flow));
    pointsWithinFlow.push(...this.getSubFlowPointsForFlow(flow));

    // Determine the points for the boundary line
    flow.boundaryPoints = this.getConvexHull(pointsWithinFlow);

    // TODO: Render an empty flow
    if (flow.boundaryPoints.length > 0) {
      this.setFlowBoundaryPath(flow);
      this.drawFlowBoundaryLine(flow);
      this.drawFlowName(flow);
    }
  }

  /**
   * Draws the boundary line on the map for a flow.
   *
   * @param flow The flow for which to draw the flow boundary line.
   */
  private drawFlowBoundaryLine(flow: FlowMapElement): void {
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw flow boundary line if context is not defined'
      );
    }
    const ctx = this.canvasContext;

    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.strokeStyle =
      flow.hoverItem === FlowElementHoverItem.Boundary
        ? NODE_HOVER_COLOR
        : CONNECTION_DEFAULT_COLOR;
    ctx.lineWidth = CONNECTION_LINE_WIDTH;
    ctx.stroke(flow.path);
    ctx.setLineDash([]);
  }

  /**
   * Draws the flow name on the map.
   *
   * @param flow The flow for which to draw the name.
   */
  private drawFlowName(flow: FlowMapElement): void {
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error('Cannot draw flow name if context is not defined');
    }
    // TODO: Update this to be more dynamic
    this.canvasContext.fillStyle =
      flow.hoverItem === FlowElementHoverItem.Name
        ? NODE_HOVER_COLOR
        : BUTTON_DEFAULT_COLOR;
    const fontSize = Math.ceil(FONT_SIZE_MODIFIER * this.mapScale);
    this.canvasContext.font = `bold ${fontSize}px Montserrat`;
    this.canvasContext.fillText(
      flow.title,
      flow.boundaryPoints[0].x + GROUP_NAME_PADDING,
      flow.boundaryPoints[flow.boundaryPoints.length - 1].y + GROUP_NAME_PADDING
    );
  }

  /**
   * Set's the flow boundary path on the map for a flow.
   *
   * @param flow The flow for which path needs to be set.
   */
  private setFlowBoundaryPath(flow: FlowMapElement): void {
    const path = new Path2D();

    path.moveTo(flow.boundaryPoints[0].x, flow.boundaryPoints[0].y);
    flow.boundaryPoints = flow.boundaryPoints.concat(
      flow.boundaryPoints.splice(0, 1)
    ); // Shift the first point to the back

    for (const boundaryPoint of flow.boundaryPoints) {
      path.lineTo(boundaryPoint.x, boundaryPoint.y);
    }
    flow.path = path;
  }

  /**
   * Gets a list of all the station points that are contained within a flow.
   *
   * @param flow The flow for which to get the points.
   * @returns A list of contained points representing the stations.
   */
  private getStationPointsForFlow(flow: FlowMapElement): Point[] {
    if (!flow.stations.length) {
      return []; // Nothing to do here
    }

    // Get the stations within the flow
    const flowStations = this.mapService.stationElements.filter((station) =>
      flow.stations.includes(station.rithmId)
    );

    // Get all the station points within this flow
    const stationPointsWithinFlow: Point[] = [];
    for (const station of flowStations) {
      const scaledPadding = FLOW_PADDING * this.mapService.mapScale$.value;
      const maxX =
        station.canvasPoint.x + STATION_WIDTH * this.mapService.mapScale$.value;
      const maxY =
        station.canvasPoint.y +
        STATION_HEIGHT * this.mapService.mapScale$.value;

      stationPointsWithinFlow.push({
        x: station.canvasPoint.x - scaledPadding,
        y: station.canvasPoint.y - scaledPadding,
      }); // TL
      stationPointsWithinFlow.push({
        x: maxX + scaledPadding,
        y: station.canvasPoint.y - scaledPadding,
      }); // TR
      stationPointsWithinFlow.push({
        x: station.canvasPoint.x - scaledPadding,
        y: maxY + scaledPadding,
      }); // BL
      stationPointsWithinFlow.push({
        x: maxX + scaledPadding,
        y: maxY + scaledPadding,
      }); // BR
    }
    return stationPointsWithinFlow;
  }

  /**
   * Gets a list of all the pre-calculated, sub-flow points that are contained within a flow.
   *
   * @param flow The flow for which to get the points.
   * @returns A list of contained points representing the flow boundary of the sub-flows.
   */
  private getSubFlowPointsForFlow(flow: FlowMapElement): Point[] {
    if (!flow.subFlows.length) {
      return [];
    }
    // Get the sub-flows within the flow
    const subFlows = this.mapService.flowElements.filter((subFlow) =>
      flow.subFlows.includes(subFlow.rithmId)
    );

    // Get all the points for sub-flows
    const subFlowPointsWithinFlow: Point[] = [];
    subFlows.forEach((subFlow) => {
      subFlowPointsWithinFlow.push(
        ...this.getPaddedFlowBoundaryPoints(subFlow.boundaryPoints)
      );
    });
    return subFlowPointsWithinFlow;
  }

  /**
   * Adds flow padding to the provided boundary points and returns it.
   *
   * @param boundaryPoints The existing flow boundary points for which to add padding.
   * @returns The padded flow boundary points.
   */
  private getPaddedFlowBoundaryPoints(boundaryPoints: Point[]): Point[] {
    const updatedBoundaryPoints = [...boundaryPoints]; // Deep copy
    const minX = Math.min(...updatedBoundaryPoints.map((point) => point.x));
    const maxX = Math.max(...updatedBoundaryPoints.map((point) => point.x));
    const minY = Math.min(...updatedBoundaryPoints.map((point) => point.y));
    const maxY = Math.max(...updatedBoundaryPoints.map((point) => point.y));
    // Get center average point of boundary
    // const averageCenterPoint = {
    //   x: minX + maxX / 2,
    //   y: minY + maxY / 2
    // };

    for (const point of updatedBoundaryPoints) {
      if (point.x === maxX) {
        point.x += FLOW_PADDING * this.mapService.mapScale$.value;
      } else if (point.x === minX) {
        point.x -= FLOW_PADDING * this.mapService.mapScale$.value;
      }

      if (point.y === maxY) {
        point.y += FLOW_PADDING * this.mapService.mapScale$.value;
      } else if (point.y === minY) {
        point.y -= FLOW_PADDING * this.mapService.mapScale$.value;
      }
    }

    return updatedBoundaryPoints;
  }

  /**
   * Gets a new array of points representing the convex hull of the given set of points. The convex hull excludes collinear points.
   * This algorithm runs in O(n log n) time.
   *
   * @param points The unsorted points for which to get the points.
   * @returns The convex hull for the points.
   */
  private getConvexHull(points: Point[]): Point[] {
    const newPoints = points.slice();
    newPoints.sort(this.comparePoints);
    return this.getConvexHullPresorted(newPoints);
  }

  /**
   * Gets the convex hull of a pre-sorted set of points.
   *
   * @param points The sorted points to be contained in the convex hull.
   * @returns The convex hull for the points.
   */
  private getConvexHullPresorted(points: Point[]): Point[] {
    if (points.length <= 1) {
      return points.slice();
    }

    // Andrew's monotone chain algorithm. Positive y coordinates correspond to "up"
    // as per the mathematical convention, instead of "down" as per the computer
    // graphics convention. This doesn't affect the correctness of the result.

    // TODO: Refactor this; some duplicated code and vague variable names

    const upperHull: Point[] = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      while (upperHull.length >= 2) {
        const q = upperHull[upperHull.length - 1];
        const r = upperHull[upperHull.length - 2];
        if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) {
          upperHull.pop();
        } else {
          break;
        }
      }
      upperHull.push(p);
    }
    upperHull.pop();

    const lowerHull: Point[] = [];
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      while (lowerHull.length >= 2) {
        const q = lowerHull[lowerHull.length - 1];
        const r = lowerHull[lowerHull.length - 2];
        if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) {
          lowerHull.pop();
        } else {
          break;
        }
      }
      lowerHull.push(p);
    }
    lowerHull.pop();

    if (
      upperHull.length === 1 &&
      lowerHull.length === 1 &&
      upperHull[0].x === lowerHull[0].x &&
      upperHull[0].y === lowerHull[0].y
    ) {
      return upperHull;
    } else {
      return upperHull.concat(lowerHull);
    }
  }

  /**
   * Compares the position of one point to another.
   *
   * @param pointA The first point to compare.
   * @param pointB The second point to compare.
   * @returns A number indicating the position of `pointA` in relation to `pointB`.
   */
  private comparePoints(pointA: Point, pointB: Point): number {
    if (pointA.x < pointB.x) {
      return -1;
    } else if (pointA.x > pointB.x) {
      return 1;
    } else if (pointA.y < pointB.y) {
      return -1;
    } else if (pointA.y > pointB.y) {
      return 1;
    } else {
      return 0;
    }
  }
}
