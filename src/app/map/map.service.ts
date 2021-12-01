import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MapMode, Point, MapData, MapItemStatus, FlowMapElement, EnvironmentName } from 'src/models';
import { ABOVE_MAX, BELOW_MIN, DEFAULT_CANVAS_POINT, DEFAULT_SCALE,
  MAX_SCALE, MIN_SCALE, SCALE_RENDER_STATION_ELEMENTS, ZOOM_VELOCITY, DEFAULT_MOUSE_POINT } from './map-constants';
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
  mapData: MapData = { stations: [], flows: [] };

  /** Notifies when the map data has been received. */
  mapDataReceived$ = new BehaviorSubject(false);

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

  /** The number of zoom levels to increment or decrement. */
  zoomCount$ = new BehaviorSubject(0);

  /** The coordinate at which the canvas is currently rendering in regards to the overall map. */
  currentCanvasPoint$: BehaviorSubject<Point> = new BehaviorSubject(DEFAULT_CANVAS_POINT);

  /** The coordinate at which the current mouse point in the overall map. */
  currentMousePoint$: BehaviorSubject<Point> = new BehaviorSubject(DEFAULT_MOUSE_POINT);

  /** Check current mouse click if clicked the station option button. */
  stationButtonClick$ = new BehaviorSubject({ click: false, data: {} });

  /** Check if mouse clicked outside of the option menu in canvas area. */
  matMenuStatus$ = new BehaviorSubject(false);

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
        if (environment.name === EnvironmentName.Dev || environment.name === EnvironmentName.Test) {
          this.validateMapData();
        }
        this.mapDataReceived$.next(true);
        return data;
      }));
  }

  /**
   * Converts station data so it can be drawn on the canvas.
   */
  private useStationData(): void {
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
    this.mapDataReceived$.next(true);
  }

  /**
   * Updates station status to delete.
   *
   * @param station The station for which status has to be set to delete.
   */
  deleteStation(station: StationMapElement): void {
    const index = this.stationElements.findIndex(e => e.rithmId === station.rithmId);
    if (index >= 0 ) {
      if (this.stationElements[index].status === MapItemStatus.Created) {
        this.stationElements.splice(index, 1);
      } else {
        this.stationElements[index].markAsDeleted();
      }
    }
    this.flowElements.map((e) => {
      if (e.stations.includes(station.rithmId)) {
        e.stations = e.stations.filter(stn => stn !== station.rithmId);
        e.markAsUpdated();
      }
    });
    this.mapDataReceived$.next(true);
  }

  /**
   * Removes the connections from a station, and removes that station from the connections of previous and next stations.
   *
   * @param station The station for which connections has to be removed.
   */
   removeStationConnection(station: StationMapElement): void {
    this.stationElements.map((e) => {
      if (e.rithmId === station.rithmId) {
        e.previousStations = [];
        e.nextStations = [];
        e.markAsUpdated();
      }

      if (e.previousStations.includes(station.rithmId)) {
        e.previousStations.splice(e.previousStations.indexOf(station.rithmId), 1);
        e.markAsUpdated();
      }

      if (e.nextStations.includes(station.rithmId)) {
        e.nextStations.splice(e.nextStations.indexOf(station.rithmId), 1);
        e.markAsUpdated();
      }
    });
    this.mapDataReceived$.next(true);
  }

  /**
   * Deep copy an array or object to retain type.
   *
   * @param source The array or object to copy.
   * @returns The copied array or object.
   */
  private deepCopy<T>(source: T): T {
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
    this.mapDataReceived$.next(true);
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

    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH_STATION}/map`, filteredData);
  }

  /**
   * Calls the zoom() method a number of times equal to the zoomCount.
   *
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   * @param pinch Remove delay if zoom is a pinch zoom.
   */
  handleZoom(zoomOrigin = this.getCanvasCenterPoint(), pinch: boolean): void {

    const zoomLogic = () => {
      if (this.zoomCount$.value > 0) {
        this.zoom(true, zoomOrigin);
        this.zoomCount$.next(this.zoomCount$.value - 1);
        if (this.zoomCount$.value > 0) {
          this.handleZoom(zoomOrigin, pinch);
        }
      }

      if (this.zoomCount$.value < 0) {
        this.zoom(false, zoomOrigin);
        this.zoomCount$.next(this.zoomCount$.value + 1);
        if (this.zoomCount$.value < 0) {
          this.handleZoom(zoomOrigin, pinch);
        }
      }
    };

    if (!pinch) {
      setTimeout(() => {
        zoomLogic();
      }, this.zoomCount$.value > 10 || this.zoomCount$.value < -10 ? 4 : 10);
    } else {
      zoomLogic();
    }
  }

  /**
   * Zooms the map by adjusting the map scale and position.
   *
   * @param zoomingIn Zooming in or out?
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   * @param zoomAmount How much to zoom in/out.
   */
  zoom(zoomingIn: boolean, zoomOrigin = this.getCanvasCenterPoint(), zoomAmount = ZOOM_VELOCITY): void {

    // Don't zoom if limits are reached
    if (this.mapScale$.value <= MIN_SCALE && !zoomingIn || this.mapScale$.value >= MAX_SCALE && zoomingIn) {
      this.zoomCount$.next(0);
      return;
    }

    // Don't zoom out past a certain point if in build mode
    if (this.mapScale$.value <= SCALE_RENDER_STATION_ELEMENTS/zoomAmount && !zoomingIn && this.mapMode$.value !== MapMode.View) {
      this.zoomCount$.next(0);
      return;
    }

    const translateDirection = zoomingIn ? -1 : 1;

    // translate current viewport position
    const newScale = zoomingIn ? this.mapScale$.value / zoomAmount : this.mapScale$.value * zoomAmount;

    const translateLogic = (zoom: boolean, coord: 'x' | 'y'): number => {
      if (zoom) {
        return Math.round(
          (zoomOrigin[coord] / this.mapScale$.value - zoomOrigin[coord] / newScale) * translateDirection
        );
      } else {
        return Math.round(
          (zoomOrigin[coord] / newScale - zoomOrigin[coord] / this.mapScale$.value) * translateDirection
        );
      }
    };

    this.currentCanvasPoint$.value.x -= translateLogic(zoomingIn, 'x');
    this.currentCanvasPoint$.value.y -= translateLogic(zoomingIn, 'y');

    // scale
    this.mapScale$.next(zoomingIn ? Math.min(ABOVE_MAX, newScale) : Math.max(BELOW_MIN, newScale));
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

  /**
   * Validates that data returned from the API doesn't contain any logical problems.
   */
  private validateMapData(): void {
    this.validateConnections();
    this.validateStationsBelongToExactlyOneFlow();
    this.validateFlowsBelongToExactlyOneFlow();
  }

  /**
   * Validates that all connections exist and are made in both origin station and destination station.
   */
  private validateConnections(): void {
    for (const station of this.stationElements) {
      for (const outgoingStationId of station.nextStations) {
        const outgoingConnectedStation = this.stationElements.find((stationElement) => stationElement.rithmId === outgoingStationId);
        if (!outgoingConnectedStation) {
          // eslint-disable-next-line no-console
          console.error(`Station ${station.stationName} is connected to a next station ${outgoingStationId},
           but no station element was found with that id.`);
        } else {
          if (!outgoingConnectedStation.previousStations.includes(station.rithmId)) {
            // eslint-disable-next-line no-console
            console.error(`Station ${station.stationName}:${station.rithmId} is connected to a next station
              ${outgoingConnectedStation.stationName}:${outgoingStationId}, but that station doesn't report the originating id in the
              previous stations.`);
          }
        }
      }
    }
  }

  /**
   * Validates that stations belong to exactly one immediate parent flow.
   */
  private validateStationsBelongToExactlyOneFlow(): void {
    // Each station should belong to exactly one flow.
    for (const station of this.stationElements) {
      const flowsThatContainThisStation = this.flowElements.filter((flow) => flow.stations.includes(station.rithmId));
      if (flowsThatContainThisStation.length > 1) {
        const flowDetails: string = flowsThatContainThisStation.map((flowInfo) => `${flowInfo.rithmId}: ${flowInfo.title}`).toString();
        // eslint-disable-next-line no-console
        console.error(`The station ${station.rithmId}: ${station.stationName} is contained in ${flowsThatContainThisStation.length} flows:
          ${flowDetails}`);
      } else if (!flowsThatContainThisStation.length) {
        // eslint-disable-next-line no-console
        console.error(`No flows contain the station: ${station.stationName}: ${station.rithmId}`);
      }
    }
  }

  /**
   * Validates that flows belong to exactly one immediate parent flow.
   */
  private validateFlowsBelongToExactlyOneFlow(): void {
    // Each flow should belong to exactly one flow.
    for (const flow of this.flowElements) {
      const flowsThatContainThisFlow = this.flowElements.filter((flowElement) => flowElement.subFlows.includes(flow.rithmId));
      if (flowsThatContainThisFlow.length > 1) {
        // eslint-disable-next-line no-console
        console.error(`The flow ${flow.rithmId}: ${flow.title} is contained in ${flowsThatContainThisFlow.length} flows!`);
      } else if (!flowsThatContainThisFlow.length && !flow.isReadOnlyRootFlow) {
        // eslint-disable-next-line no-console
        console.error(`No flows contain the flow: ${flow.title} ${flow.rithmId}`);
      }
    }
  }

}
