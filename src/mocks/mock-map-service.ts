import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ZOOM_VELOCITY } from 'src/app/map/map-constants';
import { StationGroupMapElement, StationMapElement } from 'src/helpers';
import {
  MapData,
  MapItemStatus,
  MapMode,
  Point,
  StationGroupMapData,
  StationMapData,
} from 'src/models';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mocks methods of the `MapService`.
 */
export class MockMapService {
  /** Notifies when the map data has been received. */
  mapDataReceived$ = new BehaviorSubject(false);

  /** The rendering context for the canvas element for the map. */
  canvasContext?: CanvasRenderingContext2D;

  /** This behavior subject will track the array of stations. */
  mapElements$ = new BehaviorSubject<StationMapData[]>([]);

  /** The station elements displayed on the map. */
  stationElements: StationMapElement[] = [];

  /** The station group elements displayed on the map. */
  stationGroupMapData: StationGroupMapData[] = [
    {
      rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
      title: 'Rithm Group',
      organizationRithmId: '',
      stations: [],
      subStationGroups: [],
      status: MapItemStatus.Normal,
      isReadOnlyRootStationGroup: false,
    },
  ];

  /** Informs the map when station group elements have changed. */
  stationGroupElementsChanged$ = new BehaviorSubject(false);

  /** The station group elements displayed on the map. */
  stationGroupElements: StationGroupMapElement[] = [];

  /** The station element displayed on the map. */
  station = new StationMapElement({
    rithmId: uuidv4(),
    stationName: 'Untitled Station',
    mapPoint: {
      x: 12,
      y: 15,
    },
    noOfDocuments: 0,
    previousStations: [],
    nextStations: [],
    status: MapItemStatus.Created,
    notes: '',
  });

  /** The current mode of interaction on the map. */
  mapMode$ = new BehaviorSubject(MapMode.Build);

  /** The current scale of the map. */
  mapScale$ = new BehaviorSubject(1);

  /** The coordinate at which the canvas is currently rendering in regards to the overall map. */
  currentCanvasPoint$: BehaviorSubject<Point> = new BehaviorSubject({
    x: 0,
    y: 0,
  });

  /** The coordinate at which the current mouse point in the overall map. */
  currentMousePoint$: BehaviorSubject<Point> = new BehaviorSubject({
    x: 0,
    y: 0,
  });

  /** Check current mouse click if clicked the station option button. */
  stationButtonClick$ = new BehaviorSubject({ click: false, data: {} });

  /** Check if mouse clicked outside of the option menu in canvas area. */
  matMenuStatus$ = new BehaviorSubject(false);

  /** The number of zoom levels to increment or decrement. */
  zoomCount$ = new BehaviorSubject(0);

  /** Informs the map when station elements have changed. */
  stationElementsChanged$ = new BehaviorSubject(false);

  /** Checks if there should be panning towards the center of the map. */
  centerPan$ = new BehaviorSubject(false);

  /** Passes pan info to the map-canvas. */
  centerPanVelocity$ = new BehaviorSubject<Point>({ x: 0, y: 0 });

  /**
   * Creates a new `MockMapService`.
   *
   */
  constructor() {
    this.station.isAddingConnected = true;
    this.stationElements.push(this.station);
    this.stationGroupElements = this.stationGroupMapData.map(
      (e) => new StationGroupMapElement(e)
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
   * Gets all map elements for a given organization.
   *
   * @returns Retrieves all map elements for a given organization.
   */
  getMapData(): Observable<MapData> {
    const data: MapData = {
      stations: [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          stationName: 'Development',
          noOfDocuments: 5,
          mapPoint: {
            x: 12,
            y: 15,
          },
          previousStations: [],
          nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0988'],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
          stationName: 'Step 1',
          noOfDocuments: 5,
          mapPoint: {
            x: 200,
            y: 80,
          },
          previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          stationName: 'Step 2',
          noOfDocuments: 5,
          mapPoint: {
            x: 500,
            y: 400,
          },
          previousStations: [],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
          stationName: 'Step 3',
          noOfDocuments: 5,
          mapPoint: {
            x: 50,
            y: 240,
          },
          previousStations: [],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
      ],
      stationGroups: [
        {
          rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
          organizationRithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
          title: 'Group 1',
          stations: [
            'ED6148C9-ABB7-408E-A210-9242B2735B1C',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0990',
            'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
            'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          ],
          subStationGroups: [],
          status: MapItemStatus.Normal,
          isReadOnlyRootStationGroup: false,
        },
        {
          rithmId: '',
          title: '',
          stations: [],
          subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
          status: MapItemStatus.Normal,
          isReadOnlyRootStationGroup: true,
        },
      ],
    };
    return of(data).pipe(delay(1000));
  }

  /**
   * Create a new Station.
   *
   * @param coords The coordinates where the station will be placed.
   */
  // eslint-disable-next-line
  createNewStation(coords: Point): void { }

  /**
   * Updates station status to delete.
   *
   * @param station The station for which status has to be set to delete.
   */
  // eslint-disable-next-line
  deleteStation(station: StationMapElement): void { }

  /**
   * Enters build mode for the map.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  buildMap(): void { }

  /**
   * Cancels local map changes and returns to view mode.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cancelMapChanges(): void { }

  /**
   * Publishes local map changes to the server.
   *
   * @param mapData Data sending to the API.
   * @returns Observable of Comment.
   */
  publishMap(mapData: MapData): Observable<unknown> {
    if (!mapData) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Some error message',
            },
          })
      ).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }

  /**
   * Zooms the map by adjusting the map scale and position.
   *
   * @param zoomingIn Zooming in or out?
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   * @param zoomAmount How much to zoom in/out.
   */
  zoom(
    /* eslint-disable */
    zoomingIn: boolean,
    zoomOrigin = this.getCanvasCenterPoint(),
    zoomAmount = ZOOM_VELOCITY
  ): void { }
  /* eslint-enable */

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
    const canvasBoundingRect =
      this.canvasContext?.canvas.getBoundingClientRect();
    return {
      x: canvasBoundingRect.width / 2,
      y: canvasBoundingRect.height / 2,
    };
  }

  /**
   * Gets the x-coordinate on the canvas for a given map x-coordinate.
   *
   * @param mapX The x-coordinate on the map.
   * @returns The x-coordinate for the canvas.
   */
  getCanvasX(mapX: number): number {
    return Math.floor(
      (mapX - this.currentCanvasPoint$.value.x) * this.mapScale$.value
    );
  }

  /**
   * Gets the y-coordinate on the canvas for a given map y-coordinate.
   *
   * @param mapY The y-coordinate on the map.
   * @returns The y-coordinate for the canvas.
   */
  getCanvasY(mapY: number): number {
    return Math.floor(
      (mapY - this.currentCanvasPoint$.value.y) * this.mapScale$.value
    );
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
   * Disable publish button until some changes in map/station.
   *
   * @returns Returns true if no stations are updated and false if any station is updated.
   */
  get mapHasChanges(): boolean {
    return this.stationElements.some(
      (station) => station.status !== MapItemStatus.Normal
    );
  }

  /**
   * Set's isAddingConnected property of station to false if it's true.
   */
  disableConnectedStationMode(): void {
    this.stationElements
      .filter((station) => station.isAddingConnected)
      .map((connectedStation) => {
        connectedStation.isAddingConnected = false;
      });
  }

  /**
   * Reset disable and true status to false when a station-group is deselected.
   */
  resetSelectedStationGroupStationStatus(): void {
    this.stationGroupElements.map((stationGroup) => {
      stationGroup.selected = false;
      stationGroup.disabled = false;
      stationGroup.stations.map((station) => {
        const stationIndex = this.stationElements.findIndex(
          (st) => st.rithmId === station
        );
        this.stationElements[stationIndex].selected = false;
        this.stationElements[stationIndex].disabled = false;
      });
    });
  }
}
