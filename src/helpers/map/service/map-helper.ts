import { BehaviorSubject } from 'rxjs';
import {
  ABOVE_MAX,
  BELOW_MIN,
  DEFAULT_CANVAS_POINT,
  DEFAULT_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_RENDER_STATION_ELEMENTS,
  ZOOM_VELOCITY,
} from 'src/app/map/map-constants';
import { BoundaryMapElement } from 'src/helpers';
import { MapMode, Point } from 'src/models';
import { MapStationHelper } from './map-station-helper';

/**
 * Represents methods that handle for the Map.
 */
export class MapHelper {
  /** An object containing the data needed to properly display and interact with the map boundary box. */
  boundaryElement?: BoundaryMapElement;

  /** The rendering context for the canvas element for the map. */
  canvasContext?: CanvasRenderingContext2D;

  /**
   * The coordinate at which the canvas is currently rendering in regards to the overall map.
   * Default is { x: 0, y: 0 }. The top-left corner of the canvas is where this point is set.
   */
  currentCanvasPoint$: BehaviorSubject<Point> = new BehaviorSubject(
    DEFAULT_CANVAS_POINT
  );

  /** The current scale of the map. Default is 1. */
  mapScale$ = new BehaviorSubject(DEFAULT_SCALE);

  /** The current mode of interaction on the map. Default is View. */
  mapMode$ = new BehaviorSubject(MapMode.View);

  /** Notifies when the map data has been received. */
  mapDataReceived$ = new BehaviorSubject(false);

  /**
   * The number of zoom levels to increment or decrement.
   * Scale should be slowly changed as this happens.
   */
  zoomCount$ = new BehaviorSubject(0);

  /**
   * Gets the center point of the canvas.
   *
   * @returns The center point of the canvas.
   */
  getCanvasCenterPoint(): Point {
    if (!this.canvasContext) {
      throw new Error(
        'Cannot get center point of canvas when canvas context is not set'
      );
    }

    //Get the canvas dimensions.
    const canvasBoundingRect =
      this.canvasContext?.canvas.getBoundingClientRect();
    //Return half the width and height of the canvas.
    return {
      x: canvasBoundingRect.width / 2,
      y: canvasBoundingRect.height / 2,
    };
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
   * Find's the center of a user's map by looking at the mapPoints of the furthest left, top, right and bottom stations.
   *
   * @returns The center point of the map.
   */
  getMapCenterPoint(): Point {
    if (!this.boundaryElement) {
      throw new Error(
        'Cannot get center point of map if map boundaries are not defined.'
      );
    }

    //Use the min and max mapPoints of the boundary element to find the middle.
    const minPoint = this.boundaryElement.minMapPoint;
    const maxPoint = this.boundaryElement.maxMapPoint;

    const center: Point = {
      x: Math.floor((minPoint.x + maxPoint.x) / 2),
      y: Math.floor((minPoint.y + maxPoint.y) / 2),
    };
    return center;
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
   * @param stationHelper The map station helper reference.
   */
  setBoundary(stationHelper: MapStationHelper): void {
    this.boundaryElement = new BoundaryMapElement(
      stationHelper.stationElements
    );
  }

  /**
   * Registers the canvas rendering context from the component for use elsewhere.
   *
   * @param canvasContext The rendering context for the canvas element.
   */
  registerCanvasContext(canvasContext: CanvasRenderingContext2D): void {
    this.canvasContext = canvasContext;
  }

  /**
   * Deep copy an array or object to retain type.
   * This helper method is added to allow us to create copies of arrays and objects instead of referencing them.
   * TODO: Separate this into separate file since it's not specific to the map.
   *
   * @param source The array or object to copy.
   * @returns The copied array or object.
   */
  deepCopy<T>(source: T): T {
    return Array.isArray(source)
      ? source.map((item) => this.deepCopy(item))
      : source instanceof Date
      ? new Date(source.getTime())
      : source && typeof source === 'object'
      ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
          Object.defineProperty(
            o,
            prop,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Object.getOwnPropertyDescriptor(source, prop)!
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          o[prop] = this.deepCopy((source as { [key: string]: any })[prop]);
          return o;
        }, Object.create(Object.getPrototypeOf(source)))
      : (source as T);
  }

  /**
   * Zooms the map by adjusting the map scale and position.
   *
   * @param zoomingIn Zooming in or out?
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   * @param zoomAmount How much to zoom in/out.
   */
  zoom(
    zoomingIn: boolean,
    zoomOrigin = this.getCanvasCenterPoint(),
    zoomAmount = ZOOM_VELOCITY
  ): void {
    //Reset zoomCount and return if attempting to zoom past min or max scale.
    if (
      (this.mapScale$.value <= MIN_SCALE && !zoomingIn) ||
      (this.mapScale$.value >= MAX_SCALE && zoomingIn)
    ) {
      this.zoomCount$.next(0);
      return;
    }

    // Reset zoomCount and return if attempting to zoom out past a certain point while not in view mode.
    if (
      this.mapScale$.value <= SCALE_RENDER_STATION_ELEMENTS / zoomAmount &&
      !zoomingIn &&
      this.mapMode$.value !== MapMode.View
    ) {
      this.zoomCount$.next(0);
      return;
    }

    //Set so that we can move the currentCanvasPoint closer or further away based on zoom direction.
    const translateDirection = zoomingIn ? -1 : 1;

    /* What will we change the scale to when we're finished?
    When we zoom out we make the scale smaller, when we zoom in we make it larger.
    zoomAmount is set up to be exponential. */
    const newScale = zoomingIn
      ? this.mapScale$.value / zoomAmount
      : this.mapScale$.value * zoomAmount;

    //We have translateLogic in a const so that we don't have to repeat code for both x and y coords.
    const translateLogic = (zoom: boolean, coord: 'x' | 'y'): number => {
      //If zooming in.
      if (zoom) {
        //Return amount to translate a given coord based on the arithmetic.
        return Math.round(
          //current scale to new scale
          (zoomOrigin[coord] / this.mapScale$.value -
            zoomOrigin[coord] / newScale) *
            translateDirection
        );
        //If zooming out.
      } else {
        //Return amount to translate a given coord based on the arithmetic.
        return Math.round(
          //new scale to current scale
          (zoomOrigin[coord] / newScale -
            zoomOrigin[coord] / this.mapScale$.value) *
            translateDirection
        );
      }
    };

    //Subtract the number returned from translateLogic from x coord of currentCanvasPoint to pan the map that amount.
    this.currentCanvasPoint$.value.x -= translateLogic(zoomingIn, 'x');
    //Subtract the number returned from translateLogic from y coord of currentCanvasPoint to pan the map that amount.
    this.currentCanvasPoint$.value.y -= translateLogic(zoomingIn, 'y');

    //Set the mapScale to the new scale as long as it isn't above or below the max or min allowed.
    this.mapScale$.next(
      zoomingIn ? Math.min(ABOVE_MAX, newScale) : Math.max(BELOW_MIN, newScale)
    );
  }

  /**
   * Updates the mapPoints of the map boundary.
   *
   * @param stationHelper The map station helper reference.
   */
  updateBoundary(stationHelper: MapStationHelper): void {
    if (this.boundaryElement) {
      this.boundaryElement.updatePoints(stationHelper.stationElements);
    }
  }
}
