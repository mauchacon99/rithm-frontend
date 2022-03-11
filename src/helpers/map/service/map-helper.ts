import { BehaviorSubject } from 'rxjs';
import { DEFAULT_CANVAS_POINT, DEFAULT_SCALE } from 'src/app/map/map-constants';
import { BoundaryMapElement } from 'src/helpers';
import { Point } from 'src/models';
import { MapStationHelper } from './map-station-helper';

/**
 * Represents methods that handle for the Map.
 */
export class MapHelper {
  /** The current scale of the map. Default is 1. */
  mapScale$ = new BehaviorSubject(DEFAULT_SCALE);

  /** An object containing the data needed to properly display and interact with the map boundary box. */
  boundaryElement?: BoundaryMapElement;

  /**
   * The coordinate at which the canvas is currently rendering in regards to the overall map.
   * Default is { x: 0, y: 0 }. The top-left corner of the canvas is where this point is set.
   */
  currentCanvasPoint$: BehaviorSubject<Point> = new BehaviorSubject(
    DEFAULT_CANVAS_POINT
  );

  /**
   * Gets the point on the canvas for a given map point.
   *
   * @param mapPoint The point on the map.
   * @returns The point for the canvas.
   */
  getCanvasPoint(mapPoint: Point): Point {
    return {
      x: this.getCanvasX(mapPoint.x),
      y: this.getCanvasY(mapPoint.y),
    };
  }

  /**
   * Gets the x-coordinate on the canvas for a given map x-coordinate.
   *
   * @param mapX The x-coordinate on the map.
   * @returns The x-coordinate for the canvas.
   */
  getCanvasX(mapX: number): number {
    return (mapX - this.currentCanvasPoint$.value.x) * this.mapScale$.value;
  }

  /**
   * Gets the y-coordinate on the canvas for a given map y-coordinate.
   *
   * @param mapY The y-coordinate on the map.
   * @returns The y-coordinate for the canvas.
   */
  getCanvasY(mapY: number): number {
    return (mapY - this.currentCanvasPoint$.value.y) * this.mapScale$.value;
  }

  /**
   * Gets the point on the map for a given canvas point.
   *
   * @param canvasPoint The point on the canvas.
   * @returns The point for the map.
   */
  getMapPoint(canvasPoint: Point): Point {
    return {
      x: this.getMapX(canvasPoint.x),
      y: this.getMapY(canvasPoint.y),
    };
  }

  /**
   * Gets the x-coordinate on the map for a given canvas x-coordinate.
   *
   * @param canvasX The x-coordinate on the canvas.
   * @returns The x-coordinate for the map.
   */
  getMapX(canvasX: number): number {
    return Math.floor(
      canvasX * (1 / this.mapScale$.value) + this.currentCanvasPoint$.value.x
    );
  }

  /**
   * Gets the y-coordinate on the map for a given canvas y-coordinate.
   *
   * @param canvasY The y-coordinate on the canvas.
   * @returns The y-coordinate for the map.
   */
  getMapY(canvasY: number): number {
    return Math.floor(
      canvasY * (1 / this.mapScale$.value) + this.currentCanvasPoint$.value.y
    );
  }

  /**
   * Sets the boundary element based on info from this.stationElements.
   *
   * @param stationHelper T.
   */
  setBoundary(stationHelper: MapStationHelper): void {
    this.boundaryElement = new BoundaryMapElement(
      stationHelper.stationElements
    );
  }
}
