import { Injectable } from '@angular/core';
import { Point } from 'src/models';

/**
 * Service for rendering and other behavior for a connection on the map.
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectionElementService {

  /** The rendering this.canvasContext for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  /**
   * Draws a connection on the map.
   *
   * @param startPoint The start point for the connection.
   * @param endPoint The end point for the connection.
   */
  private drawConnection(startPoint: Point, endPoint: Point): void {
    if (!this.canvasContext) {
      throw new Error('Cannot draw connection if context is not defined');
    }
    this.drawConnectionLine(startPoint, endPoint);
    this.drawConnectionArrow(endPoint);
  }

  /**
   * Draws the line for a connection.
   *
   * @param startPoint The point at which the line starts.
   * @param endPoint The point at which the line ends.
   */
  private drawConnectionLine(startPoint: Point, endPoint: Point): void {
    if (!this.canvasContext) {
      throw new Error('Cannot draw connection line if context is not defined');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [controlPoint1, controlPoint2] = this.getConnectionLineControlPoints(startPoint, endPoint);

    // TODO: Draw connection line
  }

  /**
   * Draws the arrow on the end of a connection.
   *
   * @param endPoint The endpoint for the connection line where the arrow should be drawn.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private drawConnectionArrow(endPoint: Point): void {
    if (!this.canvasContext) {
      throw new Error('Cannot draw connection arrow if context is not defined');
    }

    // TODO: Draw connection arrow
  }

  /**
   * Gets the control points for the connection line between two stations.
   *
   * @param startPoint The start point for the connection line.
   * @param endPoint The end point for the connection line.
   * @returns A list of two control points.
   */
  private getConnectionLineControlPoints(startPoint: Point, endPoint: Point): Point[] {
    const controlPoint1 = { x: 0, y: 0 };
    const controlPoint2 = { x: 0, y: 0 };
    const heightDifference = startPoint.y - endPoint.y;

    controlPoint1.y = Math.floor(startPoint.y - heightDifference / 5); // TODO: Fix magic number; what does 5 represent?
    controlPoint2.y = Math.floor(endPoint.y + heightDifference / 5);

    controlPoint1.x = startPoint.x + 80; // TODO: Fix magic number; what does 80 represent?
    controlPoint2.x = endPoint.x - 80;

    return [controlPoint1, controlPoint2];
  }

  /**
   * Gets the normalized vector point for two given points.
   *
   * @see https://bit.ly/3nDVGc6
   * @param point1 The first point for which to get the normalized vector.
   * @param point2 The second point for which to get the normalized vector.
   * @returns The normalized vector point (unit vector).
   */
  private getNormalizedVectorPoint(point1: Point, point2: Point): Point {
    const xDistance = -(point2.y - point1.y);
    const yDistance = point2.x - point1.x;
    const vectorMagnitude = Math.sqrt(xDistance * xDistance + yDistance * yDistance); // Pythagorean theorem
    return {
      x: xDistance / vectorMagnitude,
      y: yDistance / vectorMagnitude
    };
  }
}
