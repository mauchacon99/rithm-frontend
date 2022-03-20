import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  MapMode,
  Point,
  MapData,
  MapItemStatus,
  EnvironmentName,
  MatMenuOption,
  CenterPanType,
} from 'src/models';
import {
  DEFAULT_CANVAS_POINT,
  DEFAULT_SCALE,
  MAX_SCALE,
  ZOOM_VELOCITY,
  DEFAULT_MOUSE_POINT,
  STATION_WIDTH,
  STATION_HEIGHT,
  SCALE_REDUCED_RENDER,
  CENTER_ZOOM_BUFFER,
  STATION_PAN_CENTER_WIDTH,
  STATION_PAN_CENTER_HEIGHT,
} from './map-constants';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import {
  BoundaryMapElement,
  ConnectionMapElement,
  StationGroupMapElement,
  StationMapElement,
  MapHelper,
  MapConnectionHelper,
  MapStationGroupHelper,
  MapStationHelper,
} from 'src/helpers';

const MICROSERVICE_PATH_STATION = '/stationservice/api/station';

const MICROSERVICE_PATH = '/mapservice/api/map';

/**
 * Service for all general map behavior.
 */
@Injectable({
  providedIn: 'root',
})
export class MapService {
  /** This will track the array of stations and station groups received from the backend. */
  mapData: MapData = { stations: [], stationGroups: [] };

  /** Notifies when the map data has been received. */
  mapDataReceived$ = new BehaviorSubject(false);

  /** Informs the map when station elements have changed. */
  stationElementsChanged$ = new BehaviorSubject(false);

  /** Informs the map when station group elements have changed. */
  stationGroupElementsChanged$ = new BehaviorSubject(false);

  /** An object containing the data needed to properly display and interact with the map boundary box. */
  boundaryElement?: BoundaryMapElement;

  /** The rendering context for the canvas element for the map. */
  canvasContext?: CanvasRenderingContext2D;

  /** The current mode of interaction on the map. Default is View. */
  mapMode$ = new BehaviorSubject(MapMode.View);

  /** The current scale of the map. Default is 1. */
  mapScale$ = new BehaviorSubject(DEFAULT_SCALE);

  /**
   * The number of zoom levels to increment or decrement.
   * Scale should be slowly changed as this happens.
   */
  zoomCount$ = new BehaviorSubject(0);

  /** Informs the map that which drawer is opened. */
  isDrawerOpened$ = new BehaviorSubject(false);

  /** The View Station Button Click, informs to make the init Load on the map. */
  viewStationButtonClick$ = new BehaviorSubject(true);

  /**
   * The coordinate at which the canvas is currently rendering in regards to the overall map.
   * Default is { x: 0, y: 0 }. The top-left corner of the canvas is where this point is set.
   */
  currentCanvasPoint$: BehaviorSubject<Point> = new BehaviorSubject(
    DEFAULT_CANVAS_POINT
  );

  /**
   * The coordinate at which the current cursor is located in the overall map.
   * When the cursor is not currently being tracked,
   * it should be set to {x: -1, y: -1} to show it is not currently on the canvas.
   */
  currentMousePoint$: BehaviorSubject<Point> = new BehaviorSubject(
    DEFAULT_MOUSE_POINT
  );

  /**
   * Note if, and which station option button was clicked.
   * This is required so that the option menu pulls down on the right station.
   */
  stationButtonClick$ = new BehaviorSubject({
    click: MatMenuOption.None,
    data: {},
  });

  /** Check if clicked outside of the option menu in canvas area. This closes the option menu. */
  matMenuStatus$ = new BehaviorSubject(false);

  /** Checks if there should be panning towards the center of the map. */
  centerActive$ = new BehaviorSubject(false);

  /** Passes auto pan velocity for when the center button is pressed to the map-canvas. */
  centerPanVelocity$ = new BehaviorSubject<Point>({ x: 0, y: 0 });

  /** The number of times this.center() should be called. It will continually be incremented until centering is done.*/
  centerCount$ = new BehaviorSubject(0);

  /** The Station rithm Id centered on the map. */
  centerStationRithmId$ = new BehaviorSubject('');

  /** If station group option button was clicked. */
  stationGroupOptionButtonClick$ = new BehaviorSubject({
    click: false,
    data: {},
  });

  /** The Map Helper. */
  mapHelper = new MapHelper();

  /** The Map Connection Helper. */
  mapConnectionHelper = new MapConnectionHelper(this.mapHelper);

  /** The Map Station Helper. */
  mapStationHelper = new MapStationHelper(this.mapHelper);

  /** The Station Group Helper. */
  mapStationGroupHelper = new MapStationGroupHelper(this.mapHelper);

  /** The copy of station group which is being edited. */
  tempStationGroup$ = new BehaviorSubject({});

  constructor(private http: HttpClient) {}

  /**
   * Getter The stations groups Elements.
   *
   * @returns The stations groups Elements.
   */
  get stationGroupElements(): StationGroupMapElement[] {
    return this.mapStationGroupHelper.stationGroupElements;
  }

  /**
   * Setter The stations groups Elements.
   */
  set stationGroupElements(stationsGroups: StationGroupMapElement[]) {
    this.mapStationGroupHelper.stationGroupElements = stationsGroups;
  }

  /**
   * Getter The connection Elements.
   *
   * @returns ConnectionElements.
   */
  get connectionElements(): ConnectionMapElement[] {
    return this.mapConnectionHelper.connectionElements;
  }

  /**
   * Setter The connection Elements.
   */
  set connectionElements(connections: ConnectionMapElement[]) {
    this.mapConnectionHelper.connectionElements = connections;
  }

  /**
   * Getter The station Element.
   *
   * @returns ConnectionElements.
   */
  get stationElements(): StationMapElement[] {
    return this.mapStationHelper.stationElements;
  }

  /**
   * Setter The connection Elements.
   */
  set stationElements(stations: StationMapElement[]) {
    this.mapStationHelper.stationElements = stations;
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
   * Gets all data for the map for a given organization.
   *
   * @returns The map data for the organization.
   */
  getMapData(): Observable<MapData> {
    return this.http
      .get<MapData>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/all`)
      .pipe(
        map((data) => {
          //Add statuses to the stations and flows.
          data.stations.map((e) => {
            e.status = MapItemStatus.Normal;
          });
          data.stationGroups.map((e) => {
            e.status = MapItemStatus.Normal;
          });
          //Set mapData to the data received.
          this.mapData = data;
          //trigger logic for handling the data received.
          this.useStationData();
          //if the code is run in a test or development environment, trigger logic for validating the map data.
          if (
            environment.name === EnvironmentName.Dev ||
            environment.name === EnvironmentName.Test
          ) {
            this.validateMapData();
          }
          //Note that the map data has been received.
          this.mapHelper.mapDataReceived$.next(true);
          return data;
        })
      );
  }

  /**
   * Converts station data so it can be drawn on the canvas.
   */
  private useStationData(): void {
    // new.
    //Turns station data into StationMapElements and sets this.stationElements to that.
    this.mapStationHelper.stationElements = this.mapData.stations.map(
      (e) => new StationMapElement(e)
    );
    //Turns group data into StationMapElements and sets this.flowElements to that.
    this.mapStationGroupHelper.stationGroupElements =
      this.mapData.stationGroups.map((e) => new StationGroupMapElement(e));
    //Trigger logic to set connections based on station data.
    this.mapConnectionHelper.setConnections(this.mapStationHelper);
    //Trigger logic to set map boundary box.
    this.mapHelper.setBoundary(this.mapStationHelper);
    //Trigger logic to use station map points and update stationCanvasPoints accordingly.
    this.mapStationHelper.updateStationCanvasPoints(this.mapConnectionHelper);

    // (remove)
    this.stationElements = this.mapStationHelper.stationElements;
    this.boundaryElement = this.mapHelper.boundaryElement;
  }

  /**
   * Updates the mapPoints of the map boundary.
   */
  updateBoundary(): void {
    this.mapHelper.updateBoundary(this.mapStationHelper);
  }

  /**
   * Updates pendingStationGroup with the current selected stations and groups.
   */
  updatePendingStationGroup(): void {
    this.mapStationGroupHelper.updatePendingStationGroup(this.mapStationHelper);
  }

  /**
   * Set station group status of parent and child station group and respective stations.
   *
   * @param stationGroup The incoming station-group data.
   */
  setStationGroupStatus(stationGroup: StationGroupMapElement): void {
    //Update parent station-group and respective stations status.
    this.mapStationGroupHelper.updateParentStationGroup(stationGroup.rithmId);
    //Update descendent station-group and respective stations status.
    this.mapStationGroupHelper.updateChildStationGroup(
      stationGroup,
      this.mapStationHelper
    );
    //Reset status of each station-group and station if nothing(station group or station) has been selected.
    if (
      !this.stationElements.some((st) => st.selected) &&
      !this.stationGroupElements.some((stGroup) => stGroup.selected)
    ) {
      this.resetSelectedStationGroupStationStatus();
    }
  }

  /**
   * Set disable status to true before updating station-group and station status so that only current stationGroup is enabled to de-select.
   */
  setStationGroupStationStatus(): void {
    this.stationGroupElements.map((stationGroup) => {
      stationGroup.disabled = true;
      stationGroup.stations.map((station) => {
        const stationIndex = this.stationElements.findIndex(
          (st) => st.rithmId === station
        );
        if (!this.stationElements[stationIndex].selected) {
          this.stationElements[stationIndex].disabled = true;
        }
      });
    });
  }

  /**
   * Reset disable and true status to false when a station-group is deselected.
   */
  resetSelectedStationGroupStationStatus(): void {
    this.mapStationGroupHelper.resetSelectedStationGroupStationStatus(
      this.mapStationHelper
    );
  }

  /**
   * Based on incoming station selection, update the status of related stations and station group.
   *
   * @param station The incoming station.
   */
  setSelectedStation(station: StationMapElement): void {
    this.stationGroupElements.map((stationGroup) => {
      if (station.selected) {
        if (stationGroup.stations.includes(station.rithmId)) {
          stationGroup.stations.map((st) => {
            const stationIndex = this.stationElements.findIndex(
              (sta) => sta.rithmId === st
            );
            this.stationElements[stationIndex].disabled = false;
          });
          stationGroup.disabled = false;
          stationGroup.subStationGroups.forEach((subStationGroupId) => {
            const stationGroupIndex = this.stationGroupElements.findIndex(
              (group) => group.rithmId === subStationGroupId
            );
            this.stationGroupElements[stationGroupIndex].disabled = false;
          });
          return;
        }
      } else {
        //If removing a selected station need to find the group that pending group is inside.
        if (stationGroup.status === MapItemStatus.Pending) {
          //const to reference the parent of the pending group.
          const parentGroup = this.stationGroupElements.find(
            (parentStationGroup) => {
              return parentStationGroup.subStationGroups.includes(
                stationGroup.rithmId
              );
            }
          );
          if (parentGroup) {
            parentGroup.stations.map((st) => {
              const stationIndex = this.stationElements.findIndex(
                (sta) => sta.rithmId === st
              );
              this.stationElements[stationIndex].disabled = false;
            });
            parentGroup.disabled = false;
            parentGroup.subStationGroups.forEach((subStationGroupId) => {
              const stationGroupIndex = this.stationGroupElements.findIndex(
                (group) => group.rithmId === subStationGroupId
              );
              this.stationGroupElements[stationGroupIndex].disabled = false;
            });
            return;
          }
        }
      }
    });
    if (
      !this.stationElements.some((st) => st.selected) &&
      !this.stationGroupElements.some((stGroup) => stGroup.selected)
    ) {
      this.resetSelectedStationGroupStationStatus();
    }
  }

  /**
   * Removes the connections from a station, and removes that station from the connections of previous and next stations.
   *
   * @param stationId The station ID for which connections have to be removed.
   */
  removeAllStationConnections(stationId: string): void {
    //Find all stations that have a connection line that has stationId as part of it.
    this.stationElements.map((e) => {
      //Remove the previous and next stations from the station.
      if (e.rithmId === stationId) {
        e.previousStations = [];
        e.nextStations = [];
        e.markAsUpdated();
      }

      //Remove the station from the previousStation arrays of all connecting stations.
      if (e.previousStations.includes(stationId)) {
        e.previousStations.splice(e.previousStations.indexOf(stationId), 1);
        e.markAsUpdated();
      }

      //Remove the station from the nextStation arrays of all connecting stations.
      if (e.nextStations.includes(stationId)) {
        e.nextStations.splice(e.nextStations.indexOf(stationId), 1);
        e.markAsUpdated();
      }
    });
    //Remove the connections from this.connectionElements.
    const filteredConnections = this.connectionElements.filter(
      (e) =>
        e.startStationRithmId !== stationId && e.endStationRithmId !== stationId
    );
    //Set connectionElements to the filtered array.
    this.connectionElements = filteredConnections;
    //Note a change in map data.
    this.mapHelper.mapDataReceived$.next(true);
  }

  /**
   * Enters build mode for the map.
   */
  buildMap(): void {
    //(remove).
    //Set mapMode to build.
    this.mapMode$.next(MapMode.Build);

    //Create copies of all the stations, groups and connections so we can revert to those copies if we cancel our changes.
    this.mapStationHelper.stationsDeepCopy();
    this.mapStationGroupHelper.stationGroupsDeepCopy();
    this.mapConnectionHelper.connectionsDeepCopy();
    //Set mapMode to build.
    this.mapHelper.mapMode$.next(MapMode.Build);
  }

  /**
   * Cancels local map changes and returns to view mode.
   */
  cancelMapChanges(): void {
    this.mapStationHelper.cancelStationsChanges();
    this.mapStationGroupHelper.cancelStationGroupsChanges();
    this.mapConnectionHelper.cancelConnectionsChanges();
    //Set mapMode to view.
    this.mapHelper.mapMode$.next(MapMode.View);
    //Note a change in map data.
    this.mapHelper.mapDataReceived$.next(true);
  }

  /**
   * Publishes local map changes to the server.
   *
   * @returns Observable of publish data.
   */
  publishMap(): Observable<unknown> {
    //Set pending group to new before publishing.
    this.stationGroupElements.map((stationGroup) => {
      if (stationGroup.status === MapItemStatus.Pending) {
        this.updateCreatedStationGroup(stationGroup.rithmId);
      }
    });

    //Get all updated, new and deleted stations and groups.
    const filteredData: MapData = {
      stations: this.stationElements.filter(
        (e) => e.status !== MapItemStatus.Normal
      ),
      stationGroups: this.stationGroupElements.filter(
        (e) => e.status !== MapItemStatus.Normal
      ),
    };

    //Make sure each station's mapPoint is an integer.
    const mappedData: MapData = {
      stations: filteredData.stations.map((e) => {
        e.mapPoint.x = Math.floor(e.mapPoint.x);
        e.mapPoint.y = Math.floor(e.mapPoint.y);
        return e;
      }),
      stationGroups: filteredData.stationGroups,
    };

    //Post an http call.
    return (
      this.http
        //Send the filtered data in the post.
        .post<void>(
          `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION}/map`,
          mappedData
        )
        .pipe(
          tap(() => {
            //After the post, remove deleted stations and groups from their respective arrays.
            this.stationElements = this.stationElements.filter(
              (e) => e.status !== MapItemStatus.Deleted
            );
            this.stationGroupElements = this.stationGroupElements.filter(
              (e) => e.status !== MapItemStatus.Deleted
            );
            //After the post, set all new and updated stations' and groups' statuses back to normal.
            this.stationElements.forEach(
              (station) => (station.status = MapItemStatus.Normal)
            );
            this.stationGroupElements.forEach(
              (stationGroup) => (stationGroup.status = MapItemStatus.Normal)
            );
            this.mapHelper.mapDataReceived$.next(true);
          })
        )
    );
  }

  /**
   * Removes a single connection between stations.
   *
   * @param startStationId The station from which connection starts.
   * @param endStationId The station for which connection end.
   */
  removeConnectionLine(startStationId: string, endStationId: string): void {
    this.mapConnectionHelper.removeConnectionLine(
      startStationId,
      endStationId,
      this.mapStationHelper
    );
  }

  /**
   * Calls the zoom() method a number of times equal to the zoomCount.
   * This method is required for a smooth zoom, since we recursively call it every time the scale changes.
   *
   * @param pinch Remove delay if zoom is a pinch zoom.
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   */
  handleZoom(
    pinch: boolean,
    zoomOrigin = this.mapHelper.getCanvasCenterPoint()
  ): void {
    //We put our logic in a const so we can call it later.
    const zoomLogic = () => {
      //zoomCount can be positive or negative.
      //If zoomCount is positive, we're zooming in.
      if (this.zoomCount$.value > 0) {
        //run this.zoom(), marking it as zooming in.
        this.mapHelper.zoom(true, zoomOrigin);
        //Decrement the zoomCount. Getting it closer to 0.
        this.zoomCount$.next(this.zoomCount$.value - 1);
        //If zoomCount still isn't 0, recursively call this.handleZoom().
        if (this.zoomCount$.value > 0) {
          this.handleZoom(pinch, zoomOrigin);
        }
      }

      //If zoomCount is negative, we're zooming out.
      if (this.zoomCount$.value < 0) {
        //Run this.zoom(), marking it as zooming out.
        this.mapHelper.zoom(false, zoomOrigin);
        //Increment the zoomCount. Getting it closer to 0.
        this.zoomCount$.next(this.zoomCount$.value + 1);
        //If zoomCount still isn't 0, recursively call this.handleZoom().
        if (this.zoomCount$.value < 0) {
          this.handleZoom(pinch, zoomOrigin);
        }
      }
    };

    //When not a pinch to zoom.
    if (!pinch) {
      //delay calling zoomLogic so that we can get an animation effect from the zoom.
      setTimeout(
        () => {
          zoomLogic();
        },
        //We want to speed up the animation when zoomCount is higher, like when the zoom buttons are pressed.
        this.zoomCount$.value > 10 || this.zoomCount$.value < -10 ? 4 : 10
      );
    } else {
      //We don't want any delay in response when a user is doing a pinch to zoom.
      zoomLogic();
    }
  }

  /**
   * Scales the map when center method is called to allow as many stations as possible to be visible.
   *
   * @param onInit Determines if this is called during mapCanvas init.
   */
  private centerScale(onInit = false): void {
    //TODO: This method needs work in general. It especially needs help when used in conjunction with centerPan().
    if (!this.canvasContext) {
      throw new Error(
        'Cannot get center point of canvas when canvas context is not set'
      );
    }

    if (!this.boundaryElement) {
      throw new Error(
        'Cannot get center point of map if map boundaries are not defined.'
      );
    }

    //Get correct size of the canvas.
    const canvasBoundingRect =
      this.canvasContext.canvas.getBoundingClientRect();

    //Get the canvas points of the top-left corner and bottom-right corner of the map.
    const minPoint = this.boundaryElement.minCanvasPoint;
    const maxPoint = this.boundaryElement.maxCanvasPoint;

    //Get the DPI of the screen.
    const pixelRatio = window.devicePixelRatio || 1;
    /* Zooming in and zooming out need to have different sized bounding boxes to work.
    So we have a buffer const that is the difference between the two. */
    const zoomInBox =
      (this.centerBoundingBox() + CENTER_ZOOM_BUFFER) * pixelRatio;
    const zoomOutBox =
      (this.centerBoundingBox() - CENTER_ZOOM_BUFFER) * pixelRatio;

    //Zoom in.
    /* If the topmost, the bottommost, rightmost, and leftmost station are all within the bounding box,
    and mapScale isn't at max scale yet.
    OR mapScale is less than the scale set as the preferred scale.*/
    if (
      (zoomInBox < minPoint.y &&
        canvasBoundingRect.height - zoomInBox > maxPoint.y + STATION_HEIGHT &&
        canvasBoundingRect.width - zoomInBox > maxPoint.x + STATION_WIDTH &&
        zoomInBox < minPoint.x &&
        this.mapHelper.mapScale$.value < MAX_SCALE) ||
      this.mapHelper.mapScale$.value < SCALE_REDUCED_RENDER
    ) {
      //Increment the zoomCount. This lets handleZoom know we need to zoom in.
      this.zoomCount$.next(this.zoomCount$.value + 1);
      //Increment the centerCount. This lets the center method know we aren't done centering.
      this.centerCount$.next(this.centerCount$.value + 1);
      //Call handleZoom with onInit in order to determine whether there should be a delay in zooming.
      this.handleZoom(onInit);
      //Zoom out.
      /* If the topmost, the bottommost, rightmost, or leftmost station are outside the bounding box,
    AND mapScale is bigger than the scale set as the preferred  scale. */
    } else if (
      (zoomOutBox > minPoint.y ||
        canvasBoundingRect.height - zoomOutBox < maxPoint.y + STATION_HEIGHT ||
        canvasBoundingRect.width - zoomOutBox < maxPoint.x + STATION_WIDTH ||
        zoomOutBox > minPoint.x) &&
      this.mapHelper.mapScale$.value > SCALE_REDUCED_RENDER / ZOOM_VELOCITY
    ) {
      //Decrement the zoomCount. This lets handleZoom know we need to zoom out.
      this.zoomCount$.next(this.zoomCount$.value - 1);
      //Increment the centerCount. This lets the center method know we aren't done centering.
      this.centerCount$.next(this.centerCount$.value + 1);
      //Call handleZoom with onInit in order to determine whether there should be a delay in zooming.
      this.handleZoom(onInit);
    }
  }

  /**
   * Pans the map when center method is called to the map center or station or station group.
   *
   * @param panType Determines the area of the map to be pan to center..
   * @param drawerWidth Width of the opened drawer.
   * @param onInit Determines if this is called during mapCanvas init.
   */
  private centerPan(
    panType: CenterPanType,
    drawerWidth = 0,
    onInit = false
  ): void {
    //Get the point that currentCanvasPoint needs to be set to.
    const adjustedCenter = this.getAdjustedCenter(panType, drawerWidth);

    //On Init, immediately set the currentCanvasPoint to the center of the map.
    if (onInit) {
      this.mapHelper.currentCanvasPoint$.next(adjustedCenter);
      return;
    }

    //How far away is the currentCanvasPoint from the map center?
    const totalPanNeeded = {
      x: this.mapHelper.currentCanvasPoint$.value.x - adjustedCenter.x,
      y: this.mapHelper.currentCanvasPoint$.value.y - adjustedCenter.y,
    };

    //initialize variable needed to set panVelocity.
    const panAmount: Point = { x: 0, y: 0 };

    //Set x axis of panAmount as 1% of totalPanNeeded.
    panAmount.x = totalPanNeeded.x * 0.1;

    //Set y axis of panAmount as 1% of totalPanNeeded.
    panAmount.y = totalPanNeeded.y * 0.1;

    /* In order to have a fade out animation effect we exponentially decrement the totalPanNeeded with each recursive call of centerPan().
    This means that panAmount wil never reach 0, so we need to decide on a number thats close enough.
    If we waited for 0 we'd get caught in an infinite loop.
    The number settled on for now is .12. */
    if (Math.abs(panAmount.x) >= 0.12 || Math.abs(panAmount.y) >= 0.12) {
      //nextPanVelocity on map canvas will be set to this.
      this.centerPanVelocity$.next(panAmount);
      //Increment the centerCount. This lets the center method know we aren't done centering.
      this.centerCount$.next(this.centerCount$.value + 1);
    } else {
      //After the animation is finished, jump to the map center.
      this.mapHelper.currentCanvasPoint$.next(adjustedCenter);
      //Cancel panning by setting panVelocity to 0,0.
      this.centerPanVelocity$.next({ x: 0, y: 0 });
    }
  }

  /**
   * Smoothly sets the scale and pans the map or station or station group to center.
   * On init, immediately change the scale and position.
   *
   * @param panType Determines the area of the map to be pan to center.
   * @param drawerWidth Width of the opened drawer.
   * @param onInit Determines if this is called during mapCanvas init.
   */
  center(panType: CenterPanType, drawerWidth = 0, onInit = false): void {
    //If there are no stations to center around, do nothing.
    if (
      panType === CenterPanType.Station &&
      this.stationElements.length === 0
    ) {
      return;
    }

    //If there are no station groups to center around, do nothing.
    if (
      panType === CenterPanType.StationGroup &&
      this.stationGroupElements.length === 0
    ) {
      return;
    }

    //We put our logic in a const so we can call it later.
    const centerLogic = () => {
      //If there is still centering that needs to be done.
      if (this.centerCount$.value > 0) {
        /* Smoothly change the scale of the map.
        TODO: The performance on centerScale isn't up to par,
        so it is disabled when not onInit until we can spend some time improving it. */
        if (onInit) {
          this.centerScale(onInit);
        }
        //Smoothly pan to the center.
        this.centerPan(panType, drawerWidth, onInit);
        //Decrement centerCount to note that we've moved a step further to the center.
        this.centerCount$.next(this.centerCount$.value - 1);
        //Recursively call method so we can animate a smooth pan and scale.
        this.center(panType, drawerWidth, onInit);
        //If centering is finished.
      } else {
        //Reset properties that mark that more centering needs to happen.
        this.centerActive$.next(false);
        this.centerCount$.next(0);
      }
    };

    //End method if centerActive is false.
    if (!this.centerActive$.value) {
      return;
    }

    //If center is being done after map-canvas has already been initialized, animate centering.
    if (!onInit) {
      //Use a setTimeout on centering so that center is animated.
      setTimeout(() => {
        centerLogic();
      }, 4);
    } else {
      //Don't use setTimeout so that centering is instant.
      centerLogic();
    }
  }

  /**
   * Gets center canvas point of either station or station group or map center which should be pan.
   *
   * @param panType Determines the area of the map to be pan to center.
   * @param drawerWidth Width of the opened drawer.
   * @returns Returns true if no stations are updated and false if any station is updated.
   */
  private getAdjustedCenter(
    panType: CenterPanType,
    drawerWidth: number
  ): Point {
    let adjustedCenter = { x: 0, y: 0 };
    //Get the point that currentCanvasPoint needs to be set to.
    const canvasCenter = this.mapHelper.getCanvasCenterPoint();

    //If selected station group needs to be pan to center.
    if (panType === CenterPanType.StationGroup) {
      const openedStationGroups = this.stationGroupElements.find(
        (e) => e.drawerOpened
      );
      if (!openedStationGroups) {
        throw new Error('There is no selected station group for center pan');
      }
      const updatedBoundaryPoints = [...openedStationGroups.boundaryPoints];
      const minX = Math.min(...updatedBoundaryPoints.map((point) => point.x));
      const maxX = Math.max(...updatedBoundaryPoints.map((point) => point.x));
      const minY = Math.min(...updatedBoundaryPoints.map((point) => point.y));
      const maxY = Math.max(...updatedBoundaryPoints.map((point) => point.y));

      //Determine the map center point of station group to pan it to the center.
      const groupCenterMapPoint = this.mapHelper.getMapPoint({
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
      });

      //Determine the canvas point of station group to pan it to the center.
      adjustedCenter = {
        x:
          groupCenterMapPoint.x +
          drawerWidth / 2 / this.mapHelper.mapScale$.value -
          canvasCenter.x / this.mapHelper.mapScale$.value,
        y:
          groupCenterMapPoint.y -
          canvasCenter.y / this.mapHelper.mapScale$.value,
      };
      //If selected station needs to be pan to center.
    } else if (panType === CenterPanType.Station) {
      const openedStation = this.stationElements.find((e) => e.drawerOpened);
      if (!openedStation) {
        throw new Error('There is no selected station for center pan');
      }
      //Determine the canvas point of station to pan it to the center.
      adjustedCenter = {
        x:
          openedStation.mapPoint.x +
          drawerWidth / 2 / this.mapHelper.mapScale$.value +
          STATION_PAN_CENTER_WIDTH / this.mapHelper.mapScale$.value -
          canvasCenter.x / this.mapHelper.mapScale$.value,
        y:
          openedStation.mapPoint.y +
          STATION_PAN_CENTER_HEIGHT / this.mapHelper.mapScale$.value -
          canvasCenter.y / this.mapHelper.mapScale$.value,
      };
      //If selected map center needs to be pan to center.
    } else if (panType === CenterPanType.MapCenter) {
      //Get the center of the map and the center of the canvas.
      adjustedCenter = this.mapHelper.getMapCenterPoint();

      //Get the point that currentCanvasPoint needs to be set to.
      adjustedCenter = {
        x: adjustedCenter.x - canvasCenter.x / this.mapHelper.mapScale$.value,
        y: adjustedCenter.y - canvasCenter.y / this.mapHelper.mapScale$.value,
      };
    }
    return adjustedCenter;
  }

  /**
   * Set a bounding box around the edge of the map to calculate centering the map.
   * Used to put some space between minMapPoints/maxMapPoints and the screen edges.
   *
   * @returns A number representing how for out from the edge of the screen a box should be.
   */
  centerBoundingBox(): number {
    /*TODO: change name of method and related terminology to avoid confusion with the boundary box.
    For now: *bounding box* refers to an invisible box that tracks if any stations are placed outside it, then triggers a function.
    *boundary box* is a visible box surrounding a user's map that prevents stations from being placed too far away.*/

    //Dynamically set the size of the bounding box based on screen size.
    if (((window.innerHeight + window.innerWidth) / 2) * 0.01 < 30) {
      //Set the size of the box based on screen size.
      return Math.floor(((window.innerHeight + window.innerWidth) / 2) * 0.01);
    } else {
      //If a screen is above a certain size just return 30.
      return 30;
    }
  }

  /**
   * Validates that data returned from the API doesn't contain any logical problems.
   */
  private validateMapData(): void {
    // new.
    this.mapConnectionHelper.validateConnections(this.mapStationHelper);
    this.mapStationHelper.validateStationsBelongToExactlyOneStationGroup(
      this.mapStationGroupHelper
    );
    this.mapStationGroupHelper.validateStationGroupsBelongToExactlyOneStationGroup();
  }

  /**
   * Disable publish button until some changes in map/station.
   *
   * @returns Returns true if no stations are updated and false if any station is updated.
   */
  get mapHasChanges(): boolean {
    //All stations that have MapItemStatus set to updated.
    const updatedStations = this.stationElements.filter(
      (station) => station.status === MapItemStatus.Updated
    );
    for (const updatedStation of updatedStations) {
      //Find any stored stations that match the updated station.
      const storedStation = this.mapStationHelper.storedStationElements.find(
        (station) => station.rithmId === updatedStation.rithmId
      );
      if (!storedStation) {
        throw new Error(`The station ${updatedStation.stationName}: ${updatedStation.rithmId} was marked as updated,
          but does not exist in stored stations.`);
      }
      //If all the settings on updated station are identical to its stored counterpart, set that station's status to normal.
      if (storedStation.isIdenticalTo(updatedStation)) {
        updatedStation.status = MapItemStatus.Normal;
      }
    }
    //If there are still stations or station group with status not normal, return true.
    return (
      this.stationElements.some(
        (station) => station.status !== MapItemStatus.Normal
      ) ||
      this.stationGroupElements.some(
        (stationGroup) => stationGroup.status !== MapItemStatus.Normal
      )
    );
  }

  /**
   * Set drawerOpened property of respective map element to false when any drawer is closed.
   */
  handleDrawerClose(): void {
    if (this.stationElements.some((e) => e.drawerOpened)) {
      const openedStations = this.stationElements.filter((e) => e.drawerOpened);
      openedStations.forEach((station) => {
        station.drawerOpened = false;
      });
      this.mapHelper.mapDataReceived$.next(true);
    }
    if (this.stationGroupElements.some((e) => e.drawerOpened)) {
      const openedStationGroups = this.stationGroupElements.filter(
        (e) => e.drawerOpened
      );
      openedStationGroups.forEach((group) => {
        group.drawerOpened = false;
      });
      this.mapHelper.mapDataReceived$.next(true);
    }
    //On station drawer closed, set the connection highlight point false.
    this.connectionElements.map((e) => (e.highlighted = false));
  }

  /**
   * Update the status to create for a new station group.
   *
   * @param rithmId The specific rithm Id of the station group.
   */
  updateCreatedStationGroup(rithmId: string): void {
    const stationGroupIndex = this.stationGroupElements.findIndex(
      (stationGroup) => stationGroup.rithmId === rithmId
    );
    if (stationGroupIndex === -1) {
      throw new Error(`There is not any station group with this rithmId.`);
    }
    if (this.mapMode$.value === MapMode.StationGroupAdd) {
      this.stationGroupElements[stationGroupIndex].title = 'Untitled Group';
      this.stationGroupElements[stationGroupIndex].status =
        MapItemStatus.Created;
    } else if (this.mapMode$.value === MapMode.StationGroupEdit) {
      this.stationGroupElements[stationGroupIndex].markAsUpdated();
    }

    this.resetSelectedStationGroupStationStatus();
  }

  /**
   * Revert the changes made across station group in edit mode.
   *
   */
  revertStationGroup(): void {
    if (this.mapMode$.value === MapMode.StationGroupEdit) {
      if (!(this.tempStationGroup$.value instanceof StationGroupMapElement)) {
        throw new Error(`There is no temporary station group available.`);
      }
      const rithmId = this.tempStationGroup$.value.rithmId;
      const groupIndex = this.stationGroupElements.findIndex(
        (group) => group.rithmId === rithmId
      );
      if (groupIndex === -1) {
        throw new Error(
          `There is no station group available to replace tempGroup.`
        );
      }
      this.stationGroupElements[groupIndex] = this.tempStationGroup$.value;
      this.tempStationGroup$.next({});
      //Remove station rithm id's from other groups to make make sure a station has got only one parent.
      this.stationGroupElements[groupIndex].stations.map((stationRithmId) => {
        this.stationGroupElements.map((group) => {
          if (
            group.stations.includes(stationRithmId) &&
            group.rithmId !== this.stationGroupElements[groupIndex].rithmId
          ) {
            group.stations = group.stations.filter(
              (stationId) => stationId !== stationRithmId
            );
          }
        });
      });
      //Remove station group rithm id's from other groups to make sure a group has got only one parent.
      this.stationGroupElements[groupIndex].subStationGroups.map(
        (subGroupRithmId) => {
          this.stationGroupElements.map((group) => {
            if (
              group.subStationGroups.includes(subGroupRithmId) &&
              group.rithmId !== this.stationGroupElements[groupIndex].rithmId
            ) {
              group.subStationGroups = group.subStationGroups.filter(
                (groupId) => groupId !== subGroupRithmId
              );
            }
          });
        }
      );
      this.resetSelectedStationGroupStationStatus();
      this.mapHelper.mapDataReceived$.next(true);
    }
  }

  /**
   * Whether the last station group to be de-selected.
   *
   * @returns True if the last station group to be de-selected, false otherwise.
   */
  get isLastStationGroup(): boolean {
    return (
      this.stationGroupElements.filter((e) => e.selected && !e.disabled)
        .length === 1 &&
      this.stationElements.filter((e) => e.selected && !e.disabled).length === 0
    );
  }

  /**
   * Create a new Station. Add connection if station is built off "Add Connected Station".
   *
   * @param coords The coordinates where the station will be placed.
   */
  createNewStation(coords: Point): void {
    this.mapStationHelper.createNewStation(
      coords,
      this.mapStationGroupHelper,
      this.mapConnectionHelper
    );
  }

  /**
   * Updates the status of a station to deleted.
   *
   * @param stationId The station for which status has to be set to delete.
   */
  deleteStation(stationId: string): void {
    this.mapStationHelper.deleteStation(stationId, this.mapStationGroupHelper);
  }

  /**
   * Update the canvas points for each station.
   */
  updateStationCanvasPoints(): void {
    this.mapStationHelper.updateStationCanvasPoints(this.mapConnectionHelper);
  }
}
