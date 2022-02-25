import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  ZOOM_VELOCITY,
  STATION_PAN_CENTER_HEIGHT,
  STATION_PAN_CENTER_WIDTH,
} from 'src/app/map/map-constants';
import {
  ConnectionMapElement,
  StationGroupMapElement,
  StationMapElement,
} from 'src/helpers';
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
    },
    {
      rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
      title: ' Sub RithmGroup',
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

  /** Checks if there should be panning towards the center of the map. */
  /** The number of times this.centerStation() should be called. It will continually be incremented until centering of station is done.*/
  centerStationCount$ = new BehaviorSubject(0);

  /** Checks if there should be panning towards the center of any station. */
  centerActive$ = new BehaviorSubject(false);

  /** The station Rithm Center. */
  stationRithmIdCenter$ = new BehaviorSubject('');

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
        this.mapDataReceived$.next(true);
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
        this.mapDataReceived$.next(true);
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
      this.mapDataReceived$.next(true);
    }
  }

  /**
   * Update the canvas points for each station.
   */
  updateStationCanvasPoints(): void {
    this.stationElements.forEach((station) => {
      station.canvasPoint = this.getCanvasPoint(station.mapPoint);
      //Update the connection lines as the stations are updated.
      this.updateConnection(station);
    });
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
        connection.setStartPoint(station.canvasPoint, this.mapScale$.value);
      }
      //If connection end is consistent with the station parameter, update the connections end point.
      if (connection.endStationRithmId === station.rithmId) {
        connection.setEndPoint(station.canvasPoint, this.mapScale$.value);
      }
      //Draw the connection using its startPoint and EndPoint.
      connection.path = connection.getConnectionLine(
        connection.startPoint,
        connection.endPoint,
        this.mapScale$.value
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
   * Smoothly sets the scale and pans the station to center.
   *
   * @param station Station which should be pan to center.
   * @param drawerWidth Width of the opened drawer.
   */
  centerStation(station: StationMapElement, drawerWidth: number): void {
    //If there are no stations to center around, do nothing.
    if (this.stationElements.length === 0) {
      return;
    }

    //We put our logic in a const so we can call it later.
    const centerStationLogic = () => {
      //If there is still centering that needs to be done for the station.
      if (this.centerStationCount$.value > 0) {
        //Smoothly pan station to the center.
        this.stationCenterPan(station, drawerWidth);
        //Decrement centerStationCount to note that we've moved the station a step further to the center.
        this.centerStationCount$.next(this.centerStationCount$.value - 1);
        //Recursively call method so we can animate a smooth pan and scale.
        this.centerStation(station, drawerWidth);
        //If centering is finished.
      } else {
        //Reset properties that mark that more centering needs to happen.
        this.centerActive$.next(false);
        this.centerStationCount$.next(0);
      }
    };

    //End method if centerActive is false.
    if (!this.centerActive$.value) {
      return;
    }

    setTimeout(() => {
      centerStationLogic();
    }, 4);
  }

  /**
   * Pans the station when centerStation method is called.
   *
   * @param station Station which should be pan to center.
   * @param drawerWidth Width of the opened drawer.
   */
  private stationCenterPan(
    station: StationMapElement,
    drawerWidth: number
  ): void {
    //Get the point that currentCanvasPoint needs to be set to.
    const canvasCenter = this.getCanvasCenterPoint();
    // Determine the canvas point of station to pan it to the center.
    const adjustedCenter = {
      x:
        station.mapPoint.x +
        drawerWidth / 2 +
        STATION_PAN_CENTER_WIDTH / this.mapScale$.value -
        canvasCenter.x / this.mapScale$.value,
      y:
        station.mapPoint.y +
        STATION_PAN_CENTER_HEIGHT / this.mapScale$.value -
        canvasCenter.y / this.mapScale$.value,
    };

    //How far away is the currentCanvasPoint from the map center?
    const totalPanNeeded = {
      x: this.currentCanvasPoint$.value.x - adjustedCenter.x,
      y: this.currentCanvasPoint$.value.y - adjustedCenter.y,
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
      //Increment the centerStationCount. This lets the center method know we aren't done centering.
      this.centerStationCount$.next(this.centerStationCount$.value + 1);
    } else {
      //After the animation is finished, jump to the station center.
      this.currentCanvasPoint$.next(adjustedCenter);
      //Cancel panning by setting panVelocity to 0,0.
      this.centerPanVelocity$.next({ x: 0, y: 0 });
    }
  }
}
