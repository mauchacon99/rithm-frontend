import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  CENTER_ZOOM_BUFFER,
  MAX_SCALE,
  SCALE_REDUCED_RENDER,
  STATION_HEIGHT,
  STATION_PAN_CENTER_HEIGHT,
  STATION_PAN_CENTER_WIDTH,
  STATION_WIDTH,
  ZOOM_VELOCITY,
} from 'src/app/map/map-constants';
import {
  BoundaryMapElement,
  ConnectionMapElement,
  MapConnectionHelper,
  MapHelper,
  MapStationGroupHelper,
  MapStationHelper,
  StationGroupMapElement,
  StationMapElement,
} from 'src/helpers';
import {
  CenterPanType,
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

  /** Data for connection line paths between stations. */
  connectionElements: ConnectionMapElement[] = [];

  /** The station group elements displayed on the map. */
  stationGroupMapData: StationGroupMapData[] = [
    {
      rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
      title: 'Rithm Group',
      organizationRithmId: '',
      stations: [],
      subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
      status: MapItemStatus.Normal,
      isReadOnlyRootStationGroup: false,
      isChained: false,
    },
    {
      rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
      title: ' Sub RithmGroup',
      organizationRithmId: '',
      stations: [],
      subStationGroups: [],
      status: MapItemStatus.Normal,
      isReadOnlyRootStationGroup: false,
      isChained: false,
    },
  ];

  /** Informs the map when station group elements have changed. */
  stationGroupElementsChanged$ = new BehaviorSubject(false);

  /** The station group elements displayed on the map. */
  stationGroupElements: StationGroupMapElement[] = [];

  /** Informs the map that which drawer is opened. */
  openedDrawerType$ = new BehaviorSubject('');

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

  /** Checks if there should be panning towards the center of any station. */
  centerActive$ = new BehaviorSubject(false);

  /** The Station rithm Id centered on the map. */
  centerStationRithmId$ = new BehaviorSubject('');

  /** Informs the map that which drawer is opened. */
  isDrawerOpened$ = new BehaviorSubject(false);

  /** The View Station Button Click, informs to make the init Load on the map. */
  viewStationButtonClick$ = new BehaviorSubject(true);

  /** An object containing the data needed to properly display and interact with the map boundary box. */
  boundaryElement?: BoundaryMapElement;

  /** The number of times this.center() should be called. It will continually be incremented until centering is done.*/
  centerCount$ = new BehaviorSubject(0);

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
          isChained: false,
        },
        {
          rithmId: '',
          title: '',
          stations: [],
          subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
          status: MapItemStatus.Normal,
          isReadOnlyRootStationGroup: true,
          isChained: false,
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
  createNewStation(coords: Point): void {}

  /**
   * Updates station status to delete.
   *
   * @param station The station for which status has to be set to delete.
   */
  // eslint-disable-next-line
  deleteStation(station: StationMapElement): void {}

  /**
   * Enters build mode for the map.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  buildMap(): void {}

  /**
   * Cancels local map changes and returns to view mode.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cancelMapChanges(): void {}

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
    zoomOrigin = this.mapHelper.getCanvasCenterPoint(),
    zoomAmount = ZOOM_VELOCITY
  ): void {}
  /* eslint-enable */

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

  /**
   * Delete the station group and find it's parent to move all it's stations and sub groups to parent station group.
   *
   * @param stationGroupId The incoming station group Id to be deleted.
   */
  removeStationGroup(stationGroupId: string): void {
    //Find the station group from this.stationGroupElements array.
    const stationGroup = this.stationGroupElements.find(
      (group) => group.rithmId === stationGroupId
    );
    if (!stationGroup) {
      throw new Error('Station group was not found.');
    }
    this.stationGroupElements.forEach((group) => {
      if (
        //Find parent station group of incoming station group.
        group.subStationGroups.includes(stationGroup.rithmId)
      ) {
        //Move all sub station groups of incoming station group to it's parent.
        group.subStationGroups = group.subStationGroups.concat(
          stationGroup.subStationGroups
        );
        //Move all stations of incoming station group to it's parent.
        group.stations = group.stations.concat(stationGroup.stations);
        //Mark parent station group of incoming station group as updated.
        group.markAsUpdated();
        //Remove all stations of deleting station group.
        stationGroup.stations = [];
        //Remove all sub station groups of deleting station group.
        stationGroup.subStationGroups = [];
        //Mark incoming station group as deleted.
        stationGroup.markAsDeleted();
        //Note a change in map data.
        this.mapHelper.mapDataReceived$.next(true);
      }
    });
  }

  /**
   * Set drawerOpened property of respective map element to false when any drawer is closed.
   *
   * @param drawerItem The opened drawer type.
   */
  handleDrawerClose(drawerItem: string): void {
    if (drawerItem === 'stationInfo') {
      if (this.stationElements.some((e) => e.drawerOpened)) {
        const openedStations = this.stationElements.filter(
          (e) => e.drawerOpened
        );
        openedStations.forEach((station) => {
          station.drawerOpened = false;
        });
        this.openedDrawerType$.next('');
        this.mapHelper.mapDataReceived$.next(true);
      }
    }
  }

  /**
   * Set station group status of parent and child station group and respective stations.
   *
   * @param stationGroup The incoming station-group data.
   */
  setStationGroupStatus(stationGroup: StationGroupMapElement): void {
    //Update parent station-group and respective stations status.
    this.updateParentStationGroup(stationGroup.rithmId);
    //Update descendent station-group and respective stations status.
    this.updateChildStationGroup(stationGroup);
    //Reset status of each station-group and station if nothing(station group or station) has been selected.
    if (
      !this.stationElements.some((st) => st.selected) &&
      !this.stationGroupElements.some((stGroup) => stGroup.selected)
    ) {
      this.resetSelectedStationGroupStationStatus();
    }
  }

  /**
   * Update the selected status of all descendent station-group and stations of incoming station-group.
   *
   * @param stationGroup The incoming station-group data.
   */
  private updateChildStationGroup(stationGroup: StationGroupMapElement): void {
    const isSelected = stationGroup.selected;
    stationGroup.subStationGroups.forEach((subStationGroupId) => {
      const subStationGroup = this.stationGroupElements.find(
        (group) => group.rithmId === subStationGroupId
      );
      if (!subStationGroup) {
        throw new Error(
          `Couldn't find a sub-flow for which an id exists: ${subStationGroupId}`
        );
      }
      subStationGroup.selected = isSelected ? true : false;
      subStationGroup.stations.map((st) => {
        const stationIndex = this.stationElements.findIndex(
          (station) => station.rithmId === st
        );
        if (stationIndex >= 0) {
          this.stationElements[stationIndex].selected = isSelected
            ? true
            : false;
        }
      });
      this.updateChildStationGroup(subStationGroup);
    });
  }

  /**
   * Update the selected status of all parent station-group and stations of incoming station-group id.
   *
   * @param stationGroupId The incoming station-group id.
   */
  private updateParentStationGroup(stationGroupId: string): void {
    const rootStationGroup = this.stationGroupElements.find(
      (f) => f.rithmId === stationGroupId
    );
    if (rootStationGroup?.isReadOnlyRootStationGroup) {
      return;
    }
    this.stationGroupElements.forEach((stationGroup) => {
      if (
        stationGroup.subStationGroups.includes(stationGroupId) &&
        !stationGroup.isReadOnlyRootStationGroup
      ) {
        stationGroup.disabled = false;
        this.updateParentStationGroup(stationGroup.rithmId);
      }
    });
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
   * Updates pendingStationGroup with the current selected stations and groups.
   */
  updatePendingStationGroup(): void {
    //Set up blank pending group.
    const newGroup = new StationGroupMapElement({
      rithmId: uuidv4(),
      title: 'Pending',
      stations: [],
      subStationGroups: [],
      status: MapItemStatus.Pending,
      isReadOnlyRootStationGroup: false,
      isChained: false,
    });

    /* There should only ever be one pending group in the stationGroupElements array,
    recursively delete every pending group that already exists so we can add a new one. */
    const deletePending = () => {
      const pendingIndex = this.stationGroupElements.findIndex(
        (pendingGroup) => {
          return pendingGroup.status === MapItemStatus.Pending;
        }
      );
      if (pendingIndex !== -1) {
        this.removeStationGroup(
          this.stationGroupElements[pendingIndex].rithmId
        );
        deletePending();
      }
      return;
    };
    deletePending();

    //All stations currently selected.
    const selectedStations = this.stationElements.filter(
      (station) => station.selected
    );

    //All groups currently selected.
    const selectedGroups = this.stationGroupElements.filter(
      (group) => group.selected
    );

    //Filter the selected stations to only contain stations outside the selected groups.
    const outsideStations = selectedStations.filter((station) => {
      //Find index of group that contains station.
      const groupIndex = selectedGroups.findIndex((group) => {
        return group.stations.includes(station.rithmId);
      });
      //if index is -1 return true.
      return groupIndex === -1;
    });

    //Filter the selected groups so that only parent groups are in the array.
    const parentGroups = selectedGroups.filter((group) => {
      const groupIndex = selectedGroups.findIndex((otherGroup) => {
        return otherGroup.subStationGroups.includes(group.rithmId);
      });
      //if index is -1 return true.
      return groupIndex === -1;
    });

    //Set inner stations as disabled.
    this.stationElements.map((station) => {
      if (
        selectedStations.some((selected) => selected === station) &&
        !outsideStations.some((outside) => outside === station)
      ) {
        return (station.disabled = true);
      } else if (outsideStations.some((outside) => outside === station)) {
        return (station.disabled = false);
      } else {
        return;
      }
    });

    //Set child groups as disabled.
    this.stationGroupElements.map((stationGroup) => {
      if (
        selectedGroups.some((selected) => selected === stationGroup) &&
        !parentGroups.some((parent) => parent === stationGroup)
      ) {
        return (stationGroup.disabled = true);
      } else if (parentGroups.some((parent) => parent === stationGroup)) {
        return (stationGroup.disabled = false);
      } else {
        return;
      }
    });

    //Get the rithmIds of the outsideStations.
    const outsideStationIds = outsideStations.map((station) => station.rithmId);

    //Get the rithmIds of the parentGroups.
    const parentGroupIds = parentGroups.map((group) => group.rithmId);

    //Add the station and group ids to the newGroup.
    newGroup.stations = [...outsideStationIds];
    newGroup.subStationGroups = [...parentGroupIds];

    //If there are any selected stations or groups in newGroup, add it to the stationGroupElements array.
    if (newGroup.stations.length > 0 || newGroup.subStationGroups.length > 0) {
      //set up a boolean to check if an error needs to be thrown because there is no parent group.
      let parentGroupFound = false;
      /* Edit the group that will house newGroup to include it in it's list of subgroups,
      and remove the stations and subgroups contained in newGroup from parent. */
      this.stationGroupElements.forEach((group) => {
        if (
          //Find parent station group that houses stations or subgroups that will be added to newGroup.
          group.stations.some((station) =>
            newGroup.stations.includes(station)
          ) ||
          group.subStationGroups.some((subGroup) =>
            newGroup.subStationGroups.includes(subGroup)
          )
        ) {
          parentGroupFound = true;
          //Remove every station from parent group that newGroup contains.
          const remainingStations = group.stations.filter((stationId) => {
            return !newGroup.stations.some(
              (newGroupStation) => newGroupStation === stationId
            );
          });
          group.stations = remainingStations;
          //Remove every subGroup from parent group that newGroup contains.
          const remainingSubGroups = group.subStationGroups.filter(
            (groupId) => {
              return !newGroup.subStationGroups.some(
                (newGroupSubGroup) => newGroupSubGroup === groupId
              );
            }
          );
          group.subStationGroups = remainingSubGroups;
          //Add newGroup to list of subgroups.
          group.subStationGroups.push(newGroup.rithmId);
          //Mark parent group as updated.
          group.markAsUpdated();
        }
      });
      if (!parentGroupFound) {
        throw new Error(`No parent station group could be found.`);
      }
      this.stationGroupElements.push(newGroup);
      //Note a change in map data.
      this.mapHelper.mapDataReceived$.next(true);
    }
  }

  /**
   * Update the canvas points for each station.
   */
  updateStationCanvasPoints(): void {
    this.mapStationHelper.updateStationCanvasPoints(this.mapConnectionHelper);
  }

  /**
   * Update information used to draw a connection when a connection has changed.
   *
   * @param station The station that is being updated.
   */
  updateConnection(station: StationMapElement): void {
    //Loop through the connectionElements array.
    for (const connection of this.connectionElements) {
      //If connection start is consistent with the station parameter, update the connections start point.
      if (connection.startStationRithmId === station.rithmId) {
        connection.setStartPoint(
          station.canvasPoint,
          this.mapHelper.mapScale$.value
        );
      }
      //If connection end is consistent with the station parameter, update the connections end point.
      if (connection.endStationRithmId === station.rithmId) {
        connection.setEndPoint(
          station.canvasPoint,
          this.mapHelper.mapScale$.value
        );
      }
      //Draw the connection using its startPoint and EndPoint.
      connection.path = connection.getConnectionLine(
        connection.startPoint,
        connection.endPoint,
        this.mapHelper.mapScale$.value
      );
    }
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
        this.zoom(true, zoomOrigin);
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
        this.zoom(false, zoomOrigin);
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
      this.currentCanvasPoint$.next(adjustedCenter);
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
    if (this.stationElements.length === 0) {
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
   * Gets center point of either station or station group or map center.
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
}
