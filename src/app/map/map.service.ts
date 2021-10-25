import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MapMode, Point, MapData, MapItemStatus, FlowMapElement } from 'src/models';
import { DEFAULT_CANVAS_POINT, DEFAULT_SCALE, MAX_SCALE, MIN_SCALE } from './map-constants';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { StationMapElement } from 'src/helpers';

const MICROSERVICE_PATH_STATION = '/stationservice/api/station';

const MICROSERVICE_PATH = '/mapservice/api/map';

/**
 * Service for all general map behavior.
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {
 /** This behavior subject will track the array of stations and flows. */
  mapData: MapData = {stations: [], flows: []};

  /** Notifies when the map data has been received. */
  mapDataRecieved$ = new BehaviorSubject(false);

  /** The station elements displayed on the map. */
  stationElements: StationMapElement[] = [];

  /** An array that stores a backup of stationElements when buildMap is called. */
  storedStationElements: StationMapElement[] = [];

  /** The flow elements displayed on the map. */
  flowElements: FlowMapElement[] = [];

  /** An array that stores a backup of flowElements when buildMap is called. */
  storedFlowElements: FlowMapElement[] = [];

  /** The rendering context for the canvas element for the map. */
  canvasContext?: CanvasRenderingContext2D;

  /** The current mode of interaction on the map. */
  mapMode$ = new BehaviorSubject(MapMode.View);

  /** The current scale of the map. */
  mapScale$ = new BehaviorSubject(DEFAULT_SCALE);

  /** The coordinate at which the canvas is currently rendering in regards to the overall map. */
  currentCanvasPoint$: BehaviorSubject<Point> = new BehaviorSubject(DEFAULT_CANVAS_POINT);

  constructor(private http: HttpClient) { }

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
  getMapElements(): Observable<MapData> {
    return this.http.get<MapData>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/all`)
    .pipe(map((data) => {
      data.stations.map((e) => {
        e.status = MapItemStatus.Normal;
      });
      data.flows.map((e) => {
        e.status = MapItemStatus.Normal;
      });
      this.mapData = data;
      this.useStationData();
      this.mapDataRecieved$.next(true);
      return data;
    }));
  }

  /**
   * Converts station data so it can be drawn on the canvas.
   */
  useStationData(): void {
    this.stationElements = this.mapData.stations.map((e) => new StationMapElement(e));
    this.flowElements = this.mapData.flows.map((e) => new FlowMapElement(e));
  }

  /**
   * Create a new Station.
   *
   * @param coords The coordinates where the station will be placed.
   */
  createNewStation(coords: Point): void {
    const mapCoords = this.getMapPoint(coords);
    const newStation = new StationMapElement({
      rithmId: uuidv4(),
      stationName: 'Untitled Station',
      mapPoint: mapCoords,
      noOfDocuments: 0,
      previousStations: [],
      nextStations: [],
      status: MapItemStatus.Created,
    });

    //update the stationElements array.
    this.stationElements.push(newStation);
    this.mapDataRecieved$.next(true);
  }

  /**
   * Updates station status to delete.
   *
   * @param station The station for which status has to be set to delete.
   */
  deleteStation(station: StationMapElement): void {
    const index = this.stationElements.findIndex(e => e.rithmId === station.rithmId);
    if (index >= 0 ) {
      this.stationElements[index].status = MapItemStatus.Deleted;
    }
    this.mapDataRecieved$.next(true);
  }

  /**
   * Deep copy an array or object to retain type.
   *
   * @param source The array or object to copy.
   * @returns The copied array or object.
   */
   deepCopy<T>(source: T): T {
    return Array.isArray(source)
    ? source.map(item => this.deepCopy(item))
    : source instanceof Date
    ? new Date(source.getTime())
    : source && typeof source === 'object'
          ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
             Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             o[prop] = this.deepCopy((source as { [key: string]: any })[prop]);
             return o;
          }, Object.create(Object.getPrototypeOf(source)))
    : source as T;
  }

  /**
   * Enters build mode for the map.
   */
  buildMap(): void {
    this.storedStationElements = this.deepCopy(this.stationElements);
    this.storedFlowElements = this.deepCopy(this.flowElements);
    this.mapMode$.next(MapMode.Build);
  }

  /**
   * Cancels local map changes and returns to view mode.
   */
  cancelMapChanges(): void {
    if (this.storedStationElements.length > 0) {
      this.stationElements = this.deepCopy(this.storedStationElements);
      this.storedStationElements = [];
    }
    if (this.storedFlowElements.length > 0) {
      this.flowElements = this.deepCopy(this.storedFlowElements);
      this.storedFlowElements = [];
    }
    this.mapMode$.next(MapMode.View);
    this.mapDataRecieved$.next(true);
  }

  /**
   * Publishes local map changes to the server.
   *
   * @returns Observable of publish data.
   */
  publishMap(): Observable<unknown> {
    const filteredData: MapData = {
      stations: this.stationElements.filter((e) => e.status !== MapItemStatus.Normal),
      flows: this.flowElements.filter((e) => e.status !== MapItemStatus.Normal)
    };

    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH_STATION}/map`, filteredData );
  }

  /**
   * Zooms the map by adjusting the map scale and position.
   *
   * @param scaleFactor The multiplier by which to scale the size of elements on the map.
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   */
  zoom(scaleFactor: number, zoomOrigin = this.getCanvasCenterPoint()): void {

    const zoomingIn = scaleFactor > 1;

    // Don't zoom if limits are reached
    if (this.mapScale$.value <= MIN_SCALE && !zoomingIn || this.mapScale$.value >= MAX_SCALE && zoomingIn) {
      return;
    }

    const translateDirection = zoomingIn ? -1 : 1;

    // translate current viewport position
    const newScale = this.mapScale$.value * scaleFactor;

    // TODO: Find a cleaner way to refactor the specific scale; also isn't working for non 2x .5x?
    this.currentCanvasPoint$.value.x -= Math.round(zoomOrigin.x / (zoomingIn ? newScale : this.mapScale$.value) * translateDirection);
    this.currentCanvasPoint$.value.y -= Math.round(zoomOrigin.y / (zoomingIn ? newScale : this.mapScale$.value) * translateDirection);

    // scale
    this.mapScale$.next(zoomingIn ? Math.min(MAX_SCALE, newScale) : Math.max(MIN_SCALE, newScale));
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
