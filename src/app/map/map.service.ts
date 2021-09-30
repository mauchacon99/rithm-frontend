import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MapMode, Point, StationMapData } from 'src/models';
import { DEFAULT_CANVAS_POINT, DEFAULT_SCALE } from './map-constants';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';

const MICROSERVICE_PATH = '/mapservice/api/map';

/**
 * Service for all general map behavior.
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(
    private http: HttpClient
    ) {
    this.getMapElements()
    .pipe(first())
    .subscribe((data) => {
      this.mapElements$.next(data);
    }, (error: unknown) => {
      throw new Error(`Map service error: ${error}`);
    });
  }

 /** This behavior subject will track the array of stations. */
  mapElements$ = new BehaviorSubject<StationMapData[]>([]);

  /** An array that stores a backup of the array of stations tracked in mapElements$ when buildMap is called. */
  storedMapElements: StationMapData[] = [];

  /** The rendering context for the canvas element for the map. */
  canvasContext?: CanvasRenderingContext2D;

  /** The current mode of interaction on the map. */
  mapMode$ = new BehaviorSubject(MapMode.view);

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
   * Gets all map elements for a given organization.
   *
   * @returns Retrieves all map elements for a given organization.
   */
  getMapElements(): Observable<StationMapData[]> {
    return this.http.get<StationMapData[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/stations`);
  }

  /**
   * Create a new Station.
   *
   * @param coords The coordinates where the station will be placed.
   * @returns The new station.
   */
  createNewStation(coords: Point): StationMapData {
    const mapCoords = this.getMapPoint(coords);
    return {
      rithmId: '0',
      name: 'Untitled Station',
      mapPoint: mapCoords,
      noOfDocuments: 0,
      incomingStationIds: [],
      outgoingStationIds: [],
    };
  }

  /**
   * Enters build mode for the map.
   */
  buildMap(): void {
    this.mapElements$
    .pipe(first())
    .subscribe((stations) => {
    //This makes a deep copy of data instead of referencing it.
      this.storedMapElements = JSON.parse(JSON.stringify(stations));
      this.mapMode$.next(MapMode.build);
    }, (error: unknown) => {
      throw new Error(`Map service error: ${error}`);
    });
  }

  /**
   * Cancels local map changes and returns to view mode.
   */
  cancelMapChanges(): void {
    if (this.storedMapElements.length > 0) {
      this.mapElements$.next(JSON.parse(JSON.stringify(this.storedMapElements)));
      this.storedMapElements = [];
    }
    this.mapMode$.next(MapMode.view);
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
