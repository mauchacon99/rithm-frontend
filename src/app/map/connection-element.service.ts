import { Injectable } from '@angular/core';
import { Point } from 'src/models';
import { CONNECTION_ARROW_LENGTH, CONNECTION_DEFAULT_COLOR, CONNECTION_HEIGHT_REDUCER,
  CONNECTION_LINE_WIDTH, CONNECTION_LINE_WIDTH_ZOOM_OUT, CONNECTION_NODE_OFFSET,
  DEFAULT_SCALE, SCALE_RENDER_STATION_ELEMENTS, STATION_HEIGHT, STATION_WIDTH, ZOOM_VELOCITY } from './map-constants';
import { MapService } from './map.service';

/**
 * Service for rendering and other behavior for a connection on the map.
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectionElementService {

  /** The rendering this.canvasContext for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  /** The default scale value for the station card. */
  private mapScale = DEFAULT_SCALE;

  constructor(private mapService: MapService) {
    this.mapService.mapScale$.subscribe((scale) => {
      this.mapScale = scale;
    });
  }

  /**
   * Draws a connection on the map.
   *
   * @param startPoint The start point for the connection.
   * @param endPoint The end point for the connection.
   */
  drawConnection(startPoint: Point, endPoint: Point): void {
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error('Cannot draw connection if context is not defined');
    }

    this.drawConnectionLine(startPoint, endPoint);
    this.drawConnectionArrow(startPoint, endPoint);
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

    // Draw connection line
    this.canvasContext.setLineDash([0, 0]);

    // Line
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(startPoint.x, startPoint.y);
    if (startPoint.x - STATION_WIDTH*1.5*this.mapScale < endPoint.x) {
      const [controlPoint1, controlPoint2] = this.getConnectionLineControlPoints(startPoint, endPoint);
      this.canvasContext.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
    } else {
      //Using trig to get points.
      const startArc: Point = startPoint.y >= endPoint.y + STATION_HEIGHT*this.mapScale
      || (startPoint.y <= endPoint.y &&  startPoint.y >= endPoint.y - STATION_HEIGHT*this.mapScale) ?
      {
        x: Math.floor(startPoint.x + STATION_HEIGHT/3*this.mapScale * Math.cos(1.5*Math.PI)),
        y: Math.floor(startPoint.y - STATION_HEIGHT/3*this.mapScale + STATION_HEIGHT/3*this.mapScale * Math.sin(1.5*Math.PI))
      } :
      {
        x: Math.floor((startPoint.x + STATION_HEIGHT/3*this.mapScale * Math.cos(1.5*Math.PI)) - STATION_WIDTH/1.5*this.mapScale),
        y: Math.floor(startPoint.y + STATION_HEIGHT/3*this.mapScale + STATION_HEIGHT/3*this.mapScale * Math.sin(.5*Math.PI))
      };
      const endArc: Point = startPoint.y <= endPoint.y ?
      {
        x: Math.floor(endPoint.x + STATION_HEIGHT/3*this.mapScale * Math.cos(1.5*Math.PI)),
        y: Math.floor(endPoint.y - STATION_HEIGHT/3*this.mapScale + STATION_HEIGHT/3*this.mapScale * Math.sin(1.5*Math.PI))
      } :
      {
        x: Math.floor(endPoint.x + STATION_HEIGHT/3*this.mapScale * Math.cos(.5*Math.PI)),
        y: Math.floor(endPoint.y + STATION_HEIGHT/3*this.mapScale + STATION_HEIGHT/3*this.mapScale * Math.sin(.5*Math.PI))
      };

      startPoint.y >= endPoint.y + STATION_HEIGHT*this.mapScale
      || (startPoint.y <= endPoint.y  &&  startPoint.y >= endPoint.y - STATION_HEIGHT*this.mapScale) ?
        this.canvasContext.arc(
          startPoint.x, startPoint.y - STATION_HEIGHT/3*this.mapScale, STATION_HEIGHT/3*this.mapScale, .5 * Math.PI, 1.5 * Math.PI, true) :
        this.canvasContext.arc(
          startPoint.x, startPoint.y + STATION_HEIGHT/3*this.mapScale, STATION_HEIGHT/3*this.mapScale, 1.5 * Math.PI, .5 * Math.PI, false);
      this.canvasContext.bezierCurveTo(
        startArc.x - STATION_WIDTH*this.mapScale, startArc.y,
        endArc.x + STATION_WIDTH*this.mapScale, endArc.y,
        endArc.x, endArc.y);
      startPoint.y <= endPoint.y ?
        this.canvasContext.arc(
          endPoint.x, endPoint.y - STATION_HEIGHT/3*this.mapScale , STATION_HEIGHT/3*this.mapScale, 1.5 * Math.PI, .5 * Math.PI, true) :
        this.canvasContext.arc(
          endPoint.x, endPoint.y + STATION_HEIGHT/3*this.mapScale , STATION_HEIGHT/3*this.mapScale, .5 * Math.PI, 1.5 * Math.PI, false);
    }
    this.canvasContext.lineWidth = this.mapScale > SCALE_RENDER_STATION_ELEMENTS/Math.pow(ZOOM_VELOCITY,4)
    ? CONNECTION_LINE_WIDTH : CONNECTION_LINE_WIDTH_ZOOM_OUT;
    this.canvasContext.strokeStyle = CONNECTION_DEFAULT_COLOR;
    this.canvasContext.stroke();
  }

  /**
   * Draws the arrow on the end of a connection.
   *
   * @param startPoint The Start Point for the connection line from where the arrow should be drawn.
   * @param endPoint The endpoint for the connection line where the arrow should be drawn.
   */
  private drawConnectionArrow(startPoint: Point, endPoint: Point): void {
    if (!this.canvasContext) {
      throw new Error('Cannot draw connection arrow if context is not defined');
    }
    const controlPoints = this.getConnectionLineControlPoints(startPoint, endPoint);

    const ex = endPoint.x;
    const ey = endPoint.y;
    const norm = startPoint.x - STATION_WIDTH*1.5*this.mapScale > endPoint.x ?
    this.getNormalizedVectorPoint({x: endPoint.x - 10, y: endPoint.y}, endPoint)
    : this.getNormalizedVectorPoint(controlPoints[1], endPoint);

    const arrowWidth = CONNECTION_ARROW_LENGTH / 2;
    let x, y;
    x = (arrowWidth * norm.x + CONNECTION_ARROW_LENGTH * -norm.y) * this.mapScale;
    y = (arrowWidth * norm.y + CONNECTION_ARROW_LENGTH * norm.x) * this.mapScale;
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(ex + x, ey + y);
    this.canvasContext.lineTo(ex, ey);
    x = (arrowWidth * -norm.x + CONNECTION_ARROW_LENGTH * -norm.y) * this.mapScale;
    y = (arrowWidth * -norm.y + CONNECTION_ARROW_LENGTH * norm.x) * this.mapScale;
    this.canvasContext.lineTo(ex + x, ey + y);
    this.canvasContext.fillStyle = CONNECTION_DEFAULT_COLOR;
    this.canvasContext.stroke();
    this.canvasContext.fill();
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

    controlPoint1.y = Math.floor(startPoint.y - heightDifference / CONNECTION_HEIGHT_REDUCER);
    controlPoint2.y = Math.floor(endPoint.y + heightDifference / CONNECTION_HEIGHT_REDUCER);

    controlPoint1.x = startPoint.x + CONNECTION_NODE_OFFSET * this.mapScale;
    controlPoint2.x = endPoint.x - CONNECTION_NODE_OFFSET * this.mapScale;

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
