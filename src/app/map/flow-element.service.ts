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
   * Draws all the flow boundaries on the map. Starts from the deepest flows and works back to the root.
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
   * Draws a specific flow on the map. Draws any nested flows first through recursion.
   *
   * @param flow The flow to be drawn on the map.
   */
  private drawFlow(flow: FlowMapElement): void {

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
    if (flow.stations.length) {
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

    if (flow.subFlows.length) {
      const subFlows = this.mapService.flowElements.filter((subFlow) => flow.subFlows.includes(subFlow.rithmId));
      subFlows.forEach((subFlow) => {
        flowPoints = flowPoints.concat(this.getPaddedFlowBoundaryPoints(subFlow.boundaryPoints));
      });
    }

    // Determine the bounding box points
    const boundaryPoints = this.getConvexHull(flowPoints);
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
    flow.boundaryPoints = boundaryPoints.concat(boundaryPoints.splice(0, 1));

    for (const point of flow.boundaryPoints) {
      // Draw the flow name on the first boundary point
      if (flow.boundaryPoints[0] === point) {
        ctx.fillText(flow.title, point.x, point.y);
      }
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
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
