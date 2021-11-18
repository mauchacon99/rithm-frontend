import { Injectable } from '@angular/core';
import { FlowMapElement, Point } from 'src/models';
import { CONNECTION_DEFAULT_COLOR, FLOW_PADDING, STATION_HEIGHT, STATION_WIDTH } from './map-constants';
import { MapService } from './map.service';

/**
 * Service for rendering and other behavior for a flow on the map.
 */
@Injectable({
  providedIn: 'root'
})
export class FlowElementService {

  /** The rendering this.canvasContext for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  constructor(
    private mapService: MapService
  ) { }

  /**
   * Test.
   */
  drawFlows(): void {
    if (!this.mapService.flowElements.length) {
      return; // nothing to draw
    }
    const rootFlow = this.mapService.flowElements.find((flow) => flow.isReadOnlyRootFlow);
    if (!rootFlow) {
      throw new Error('Root flow could not be found');
    }
    this.drawFlow(rootFlow);
  }

  /**
   * Draws a flow on the map.
   *
   * @param flow The station for which to draw the card.
   */
  drawFlow(flow: FlowMapElement): void {

    // If flow has a sub-flow, draw that first
    flow.subFlows.forEach((subFlowId) => {
      const subFlow = this.mapService.flowElements.find((flowElement) => flowElement.rithmId === subFlowId);
      if (!subFlow) {
        throw new Error(`Couldn't find a sub-flow for which an id exists: ${subFlowId}`);
      }
      this.drawFlow(subFlow);
    });

    if (flow.isReadOnlyRootFlow) {
      return;
    }

    let flowPoints: Point[] = [];

    // If flow contains stations, calculate the points
    if (flow.stations) {
      const flowStations = this.mapService.stationElements.filter((station) => flow.stations.includes(station.rithmId));

      // Get all the points within this flow
      for (const station of flowStations) {
        const scaledPadding = FLOW_PADDING * this.mapService.mapScale$.value;
        const maxX = station.canvasPoint.x + STATION_WIDTH * this.mapService.mapScale$.value;
        const maxY = station.canvasPoint.y + STATION_HEIGHT * this.mapService.mapScale$.value;

        flowPoints.push({ x: station.canvasPoint.x - scaledPadding, y: station.canvasPoint.y - scaledPadding }); // TL
        flowPoints.push({ x: maxX + scaledPadding, y: station.canvasPoint.y - scaledPadding }); // TR
        flowPoints.push({ x: station.canvasPoint.x - scaledPadding, y: maxY + scaledPadding }); // BL
        flowPoints.push({ x: maxX + scaledPadding, y: maxY + scaledPadding }); // BR
      }
    }

    if (flow.subFlows) {
      const subFlows = this.mapService.flowElements.filter((subFlow) => flow.subFlows.includes(subFlow.rithmId));
      subFlows.forEach((subFlow) => {
        flowPoints = flowPoints.concat(subFlow.boundaryPoints);
      });
    }

    // Determine the bounding box points
    let boundaryPoints = this.getConvexHull(flowPoints);
    flow.boundaryPoints = boundaryPoints;

    // Draw the bounding box
    const strokeColor = CONNECTION_DEFAULT_COLOR;
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error('Cannot draw flow if context is not defined');
    }

    const ctx = this.canvasContext;

    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;

    ctx.moveTo(boundaryPoints[0].x, boundaryPoints[0].y);
    boundaryPoints = boundaryPoints.concat(boundaryPoints.splice(0, 1));

    for (const point of boundaryPoints) {
      // Draw the flow name on the first boundary point
      if (boundaryPoints[0] === point) {
        ctx.fillText(flow.title, point.x, point.y);
      }
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
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

    if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
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
