import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapMode, Point } from 'src/models';
import { DEFAULT_CANVAS_POINT, DEFAULT_SCALE } from './map-constants';

/**
 * Service for all general map behavior.
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {

  /** The rendering context for the canvas element for the map. */
  canvasContext?: CanvasRenderingContext2D;

  /** The current mode of interaction on the map. */
  mapMode$ = new BehaviorSubject(MapMode.build);

  /** The current scale of the map. */
  mapScale$ = new BehaviorSubject(DEFAULT_SCALE);

  /** The coordinate at which the canvas is currently rendering in regards to the overall map. */
  currentCanvasPoint$: BehaviorSubject<Point> = new BehaviorSubject(DEFAULT_CANVAS_POINT);

  /**
   * Registers the canvas rendering context from the component for use elsewhere.
   *
   * @param canvasContext The rendering context for the canvas element.
   */
  registerCanvasContext(canvasContext: CanvasRenderingContext2D): void {
    this.canvasContext = canvasContext;
  }

  /**
   * Retrieves all map elements for a given organization.
   */
  getMapElements(): void {
    // TODO: HTTP request to get all elements on the map
  }

  /**
   * Enters build mode for the map.
   */
  buildMap(): void {
    // TODO: Enter build mode
  }

  /**
   * Cancels local map changes and returns to view mode.
   */
  cancelMapChanges(): void {
    // TODO: Remove all local map changes
  }

  /**
   * Publishes local map changes to the server.
   */
  publishMap(): void {
    // TODO: HTTP request to push saved map changes to server
  }

  /**
   * Zooms the map by adjusting the map scale and position.
   *
   * @param scaleFactor The multiplier by which to scale the size of elements on the map.
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  zoom(scaleFactor: number, zoomOrigin = this.getCanvasCenterPoint()): void {
    // TODO: Implement map zoom
  }

  /**
   * Gets the center point of the canvas.
   *
   * @returns The center point of the canvas.
   */
  getCanvasCenterPoint(): Point {
    if (!this.canvasContext) {
      throw new Error('Cannot get center point of canvas when canvas context is not set');
    }
    const canvasBoundingRect = this.canvasContext?.canvas.getBoundingClientRect();
    return {
      x: canvasBoundingRect.width / 2,
      y: canvasBoundingRect.height / 2
    };
  }

  /**
   * Gets the x-coordinate on the canvas for a given map x-coordinate.
   *
   * @param mapX The x-coordinate on the map.
   * @returns The x-coordinate for the canvas.
   */
  getCanvasX(mapX: number): number {
    return Math.floor((mapX - this.currentCanvasPoint$.value.x) * this.mapScale$.value);
  }

  /**
   * Gets the y-coordinate on the canvas for a given map y-coordinate.
   *
   * @param mapY The y-coordinate on the map.
   * @returns The y-coordinate for the canvas.
   */
  getCanvasY(mapY: number): number {
    return Math.floor((mapY - this.currentCanvasPoint$.value.y) * this.mapScale$.value);
  }

  /**
   * Gets the point on the canvas for a given map point.
   *
   * @param mapPoint The point on the map.
   * @returns The point for the canvas.
   */
  getCanvasPoint(mapPoint: Point): Point {
    return {
      x: this.getCanvasX(mapPoint.x),
      y: this.getCanvasY(mapPoint.y)
    };
  }

  /**
   * Gets the x-coordinate on the map for a given canvas x-coordinate.
   *
   * @param canvasX The x-coordinate on the canvas.
   * @returns The x-coordinate for the map.
   */
  getMapX(canvasX: number): number {
    return Math.floor(canvasX * (1 / this.mapScale$.value) + this.currentCanvasPoint$.value.x);
  }

  /**
   * Gets the y-coordinate on the map for a given canvas y-coordinate.
   *
   * @param canvasY The y-coordinate on the canvas.
   * @returns The y-coordinate for the map.
   */
  getMapY(canvasY: number): number {
    return Math.floor(canvasY * (1 / this.mapScale$.value) + this.currentCanvasPoint$.value.y);
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
      y: this.getMapY(canvasPoint.y)
    };
  }

}