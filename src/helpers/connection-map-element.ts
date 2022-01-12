import {
  CONNECTION_ARROW_LENGTH,
  CONNECTION_HEIGHT_REDUCER,
  CONNECTION_NODE_OFFSET,
  STATION_HEIGHT,
  STATION_WIDTH,
} from 'src/app/map/map-constants';
import { StationMapElement } from 'src/helpers';
import { Point } from '../models';

/**
 * Represents all information about a connection line between any two stations.
 *
 */
export interface ConnectionMapElement {
  /** The id of the station from which the connection starts. */
  startStationRithmId: string;

  /** The name of the station from which the connection starts. */
  startStationName: string;

  /** The point from which the connection starts. */
  startPoint: Point;

  /** The id of the station from which the connection end. */
  endStationRithmId: string;

  /** The name of the station from which the connection end. */
  endStationName: string;

  /** The point at which the connection ends. */
  endPoint: Point;

  /** The path of the connection line. */
  path: Path2D;

  /** Whether the user is currently hovering over this connection. */
  hovering: boolean;
}

/**
 * Represents all info and behavior for a connection line as drawn on the map.
 */
export class ConnectionMapElement {
  /**
   * Creates a new 'ConnectionElement'.
   *
   * @param connectionStartStation Starting station.
   * @param connectionEndStation Ending station.
   * @param scale The map scale.
   */
  constructor(
    connectionStartStation: StationMapElement,
    connectionEndStation: StationMapElement,
    scale: number
  ) {
    this.startStationName = connectionStartStation.stationName;
    this.startStationRithmId = connectionStartStation.rithmId;
    this.setStartPoint(connectionStartStation.canvasPoint, scale);
    this.endStationName = connectionEndStation.stationName;
    this.endStationRithmId = connectionEndStation.rithmId;
    this.setEndPoint(connectionEndStation.canvasPoint, scale);
    this.path = this.getConnectionLine(this.startPoint, this.endPoint, scale);
    this.hovering = false;
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
    this.hovering = ctx.isPointInStroke(this.path, point.x, point.y);
    ctx.restore();
  }

  /**
   * Sets the startPoint for a connection.
   *
   * @param point The point given.
   * @param scale The current map scale.
   */
  setStartPoint(point: Point, scale: number): void {
    this.startPoint = {
      x: point.x + STATION_WIDTH * scale,
      y: point.y + (STATION_HEIGHT * scale) / 2,
    };
  }

  /**
   * Sets the endPoint for a connection.
   *
   * @param point The point given.
   * @param scale The current map scale.
   */
  setEndPoint(point: Point, scale: number): void {
    this.endPoint = {
      x: point.x,
      y: point.y + (STATION_HEIGHT * scale) / 2,
    };
  }

  /**
   * Get the line for a connection.
   *
   * @param startPoint The point at which the line starts.
   * @param endPoint The point at which the line ends.
   * @param scale The scale at which this should be rendered.
   * @returns Connection line between stations.
   */
  getConnectionLine(startPoint: Point, endPoint: Point, scale: number): Path2D {
    const path = new Path2D();
    path.moveTo(startPoint.x, startPoint.y);

    // add path
    if (startPoint.x - STATION_WIDTH * 1.5 * scale < endPoint.x) {
      const [controlPoint1, controlPoint2] =
        this.getConnectionLineControlPoints(startPoint, endPoint, scale);
      path.bezierCurveTo(
        controlPoint1.x,
        controlPoint1.y,
        controlPoint2.x,
        controlPoint2.y,
        endPoint.x,
        endPoint.y
      );
    } else {
      //Using trig to get points.
      const startArc: Point =
        startPoint.y >= endPoint.y + STATION_HEIGHT * scale ||
        (startPoint.y <= endPoint.y &&
          startPoint.y >= endPoint.y - STATION_HEIGHT * scale)
          ? {
              x: Math.floor(
                startPoint.x +
                  (STATION_HEIGHT / 3) * scale * Math.cos(1.5 * Math.PI)
              ),
              y: Math.floor(
                startPoint.y -
                  (STATION_HEIGHT / 3) * scale +
                  (STATION_HEIGHT / 3) * scale * Math.sin(1.5 * Math.PI)
              ),
            }
          : {
              x: Math.floor(
                startPoint.x +
                  (STATION_HEIGHT / 3) * scale * Math.cos(1.5 * Math.PI) -
                  (STATION_WIDTH / 1.5) * scale
              ),
              y: Math.floor(
                startPoint.y +
                  (STATION_HEIGHT / 3) * scale +
                  (STATION_HEIGHT / 3) * scale * Math.sin(0.5 * Math.PI)
              ),
            };
      const endArc: Point =
        startPoint.y <= endPoint.y
          ? {
              x: Math.floor(
                endPoint.x +
                  (STATION_HEIGHT / 3) * scale * Math.cos(1.5 * Math.PI)
              ),
              y: Math.floor(
                endPoint.y -
                  (STATION_HEIGHT / 3) * scale +
                  (STATION_HEIGHT / 3) * scale * Math.sin(1.5 * Math.PI)
              ),
            }
          : {
              x: Math.floor(
                endPoint.x +
                  (STATION_HEIGHT / 3) * scale * Math.cos(0.5 * Math.PI)
              ),
              y: Math.floor(
                endPoint.y +
                  (STATION_HEIGHT / 3) * scale +
                  (STATION_HEIGHT / 3) * scale * Math.sin(0.5 * Math.PI)
              ),
            };

      startPoint.y >= endPoint.y + STATION_HEIGHT * scale ||
      (startPoint.y <= endPoint.y &&
        startPoint.y >= endPoint.y - STATION_HEIGHT * scale)
        ? path.arc(
            startPoint.x,
            startPoint.y - (STATION_HEIGHT / 3) * scale,
            (STATION_HEIGHT / 3) * scale,
            0.5 * Math.PI,
            1.5 * Math.PI,
            true
          )
        : path.arc(
            startPoint.x,
            startPoint.y + (STATION_HEIGHT / 3) * scale,
            (STATION_HEIGHT / 3) * scale,
            1.5 * Math.PI,
            0.5 * Math.PI,
            false
          );
      path.bezierCurveTo(
        startArc.x - STATION_WIDTH * scale,
        startArc.y,
        endArc.x + STATION_WIDTH * scale,
        endArc.y,
        endArc.x,
        endArc.y
      );
      startPoint.y <= endPoint.y
        ? path.arc(
            endPoint.x,
            endPoint.y - (STATION_HEIGHT / 3) * scale,
            (STATION_HEIGHT / 3) * scale,
            1.5 * Math.PI,
            0.5 * Math.PI,
            true
          )
        : path.arc(
            endPoint.x,
            endPoint.y + (STATION_HEIGHT / 3) * scale,
            (STATION_HEIGHT / 3) * scale,
            0.5 * Math.PI,
            1.5 * Math.PI,
            false
          );
    }

    // add arrow
    const controlPoints = this.getConnectionLineControlPoints(
      startPoint,
      endPoint,
      scale
    );
    const ex = endPoint.x;
    const ey = endPoint.y;
    const norm =
      startPoint.x - STATION_WIDTH * 1.5 * scale > endPoint.x
        ? this.getNormalizedVectorPoint(
            { x: endPoint.x - 10, y: endPoint.y },
            endPoint
          )
        : this.getNormalizedVectorPoint(controlPoints[1], endPoint);
    const arrowWidth = CONNECTION_ARROW_LENGTH / 2;
    let x, y;
    x = (arrowWidth * norm.x + CONNECTION_ARROW_LENGTH * -norm.y) * scale;
    y = (arrowWidth * norm.y + CONNECTION_ARROW_LENGTH * norm.x) * scale;
    path.moveTo(ex + x, ey + y);
    path.lineTo(ex, ey);
    x = (arrowWidth * -norm.x + CONNECTION_ARROW_LENGTH * -norm.y) * scale;
    y = (arrowWidth * -norm.y + CONNECTION_ARROW_LENGTH * norm.x) * scale;
    path.lineTo(ex + x, ey + y);

    return path;
  }

  /**
   * Gets the control points for the connection line between two stations.
   *
   * @param startPoint The start point for the connection line.
   * @param endPoint The end point for the connection line.
   * @param scale The scale at which this should be rendered.
   * @returns A list of two control points.
   */
  private getConnectionLineControlPoints(
    startPoint: Point,
    endPoint: Point,
    scale: number
  ): Point[] {
    const controlPoint1 = { x: 0, y: 0 };
    const controlPoint2 = { x: 0, y: 0 };
    const heightDifference = startPoint.y - endPoint.y;

    controlPoint1.y = Math.floor(
      startPoint.y - heightDifference / CONNECTION_HEIGHT_REDUCER
    );
    controlPoint2.y = Math.floor(
      endPoint.y + heightDifference / CONNECTION_HEIGHT_REDUCER
    );

    controlPoint1.x = startPoint.x + CONNECTION_NODE_OFFSET * scale;
    controlPoint2.x = endPoint.x - CONNECTION_NODE_OFFSET * scale;

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
    const vectorMagnitude = Math.sqrt(
      xDistance * xDistance + yDistance * yDistance
    ); // Pythagorean theorem
    return {
      x: xDistance / vectorMagnitude,
      y: yDistance / vectorMagnitude,
    };
  }
}
