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
  ABOVE_MAX,
  BELOW_MIN,
  DEFAULT_CANVAS_POINT,
  DEFAULT_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_RENDER_STATION_ELEMENTS,
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
import { v4 as uuidv4 } from 'uuid';
import {
  BoundaryMapElement,
  ConnectionMapElement,
  StationGroupMapElement,
  StationMapElement,
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

  /** The station elements displayed on the map. */
  stationElements: StationMapElement[] = [];

  /** An array that stores a backup of stationElements when buildMap is called. */
  storedStationElements: StationMapElement[] = [];

  /** The station group elements displayed on the map. */
  stationGroupElements: StationGroupMapElement[] = [];

  /** An array that stores a backup of stationGroupElements when buildMap is called. */
  storedStationGroupElements: StationGroupMapElement[] = [];

  /** Data for connection line paths between stations. */
  connectionElements: ConnectionMapElement[] = [];

  /** An array that stores a backup of connectionElements when buildMap is called. */
  storedConnectionElements: ConnectionMapElement[] = [];

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

  /** Informs the center station button element whether to show on station selected. */
  stationCenter$ = new BehaviorSubject(false);

  /** The copy of station group which is being edited. */
  tempStationGroup$ = new BehaviorSubject({});

  constructor(private http: HttpClient) {}

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
          this.mapDataReceived$.next(true);
          return data;
        })
      );
  }

  /**
   * Converts station data so it can be drawn on the canvas.
   */
  private useStationData(): void {
    //Turns station data into StationMapElements and sets this.stationElements to that.
    this.stationElements = this.mapData.stations.map(
      (e) => new StationMapElement(e)
    );
    //Turns group data into StationMapElements and sets this.flowElements to that.
    this.stationGroupElements = this.mapData.stationGroups.map(
      (e) => new StationGroupMapElement(e)
    );
    //Trigger logic to set connections based on station data.
    this.setConnections();
    //Trigger logic to set map boundary box.
    this.setBoundary();
    //Trigger logic to use station map points and update stationCanvasPoints accordingly.
    this.updateStationCanvasPoints();
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

    //Also update the boundary canvas points.
    if (this.boundaryElement) {
      //Update the canvas points of the boundary.
      this.boundaryElement.minCanvasPoint = this.getCanvasPoint(
        this.boundaryElement.minMapPoint
      );
      this.boundaryElement.maxCanvasPoint = this.getCanvasPoint(
        this.boundaryElement.maxMapPoint
      );
    }
  }

  /**
   * Sets the boundary element based on info from this.stationElements.
   */
  setBoundary(): void {
    this.boundaryElement = new BoundaryMapElement(this.stationElements);
  }

  /**
   * Updates the mapPoints of the map boundary.
   */
  updateBoundary(): void {
    if (this.boundaryElement) {
      this.boundaryElement.updatePoints(this.stationElements);
    }
  }

  /**
   * Fills in connections array with info from this.stationElements.
   */
  setConnections(): void {
    //To avoid duplicating any connections, make sure this.connectionElements starts as an empty array.
    this.connectionElements = [];
    //Loop through stationElements.
    for (const station of this.stationElements) {
      //Loop through the nextStations array of each station.
      for (const connection of station.nextStations) {
        //Find the station with the same rithmId as connection.
        const outgoingStation = this.stationElements.find(
          (foundStation) => foundStation.rithmId === connection
        );

        if (!outgoingStation) {
          throw new Error(`An outgoing station was not found for the stationId: ${connection} which appears in the
            nextStations of the station${station.stationName}: ${station.rithmId}.`);
        }

        //Create a new connectionMapElement using the station and outgoingStation data.
        const lineInfo = new ConnectionMapElement(
          station,
          outgoingStation,
          this.mapScale$.value
        );

        /* Make sure we aren't duplicating and connections already inside connectionElements.
        The connection elements array will get filled in as the station elements for loop progresses. */
        if (!this.connectionElements.includes(lineInfo)) {
          this.connectionElements.push(lineInfo);
        }
      }
    }
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
        //If station is selected then connection highlight set to true.
        if (station.drawerOpened) connection.highlighted = true;
      }
      //If connection end is consistent with the station parameter, update the connections end point.
      if (connection.endStationRithmId === station.rithmId) {
        connection.setEndPoint(station.canvasPoint, this.mapScale$.value);
        //If station is selected then connection highlight set to true.
        if (station.drawerOpened) connection.highlighted = true;
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
   * Create a new Station. Add connection if station is built off "Add Connected Station".
   *
   * @param coords The coordinates where the station will be placed.
   */
  createNewStation(coords: Point): void {
    //Set the coordinates used for mapPoint.
    const mapCoords = this.getMapPoint(coords);
    //Create new stationMapElement with default data.
    const newStation = new StationMapElement({
      rithmId: uuidv4(),
      stationName: 'Untitled Station',
      mapPoint: mapCoords,
      noOfDocuments: 0,
      previousStations: [],
      nextStations: [],
      status: MapItemStatus.Created,
      notes: '',
    });

    // Find the station that has isAddingConnected set to true.
    const connectedStations = this.stationElements.filter(
      (station) => station.isAddingConnected
    );
    //Make sure there isn't more than one station with isAddingConnected = true.
    if (connectedStations.length === 1) {
      //find the index of the station whose rithmId matches the connectedStation const.
      const stationIndex = this.stationElements.findIndex(
        (station) => station.rithmId === connectedStations[0].rithmId
      );
      //Find the index of the station group that incudes the station matching connectedStation.
      const stationGroupIndex = this.stationGroupElements.findIndex(
        (stationGroup) =>
          stationGroup.stations.includes(connectedStations[0].rithmId)
      );
      //If a station matching connectedStation was found.
      if (stationIndex >= 0) {
        //Reset connecting station's isAddingConnected.
        this.stationElements[stationIndex].isAddingConnected = false;
        //Add the new station to the nextStations array of the connecting station.
        this.stationElements[stationIndex].nextStations.push(
          newStation.rithmId
        );
        //Add the connecting station to the previousStations array of the new station.
        newStation.previousStations.push(
          this.stationElements[stationIndex].rithmId
        );

        //Use the connecting station and the next station to create a new connectedMapElement.
        const lineInfo = new ConnectionMapElement(
          this.stationElements[stationIndex],
          newStation,
          this.mapScale$.value
        );

        /* Make sure we aren't duplicating and connections already inside connectionElements.
        The connection elements array will get filled in as the station elements for loop progresses. */
        if (!this.connectionElements.includes(lineInfo)) {
          this.connectionElements.push(lineInfo);
        }
        //Set mapMode back to build from addStation.
        this.mapMode$.next(MapMode.Build);
        //Unless station is new, it should be marked as updated.
        this.stationElements[stationIndex].markAsUpdated();

        //The connecting station is found in a group, and the newStation is not found in that group.
        if (
          stationGroupIndex >= 0 &&
          !this.stationGroupElements[stationGroupIndex].stations.includes(
            newStation.rithmId
          )
        ) {
          //push newStation to the stations array of the same group as the connecting station.
          this.stationGroupElements[stationGroupIndex].stations.push(
            newStation.rithmId
          );
          //Unless group is new, mark it as updated.
          this.stationGroupElements[stationGroupIndex].markAsUpdated();
        }
        //if isAddingConnected property is true, set it to false.
        this.disableConnectedStationMode();
      }
    }

    //Update the stationElements array.
    this.stationElements.push(newStation);

    // Find the Root Station Group index.
    const isReadOnlyRootStationGroupIndex = this.stationGroupElements.findIndex(
      (stationGroup) => stationGroup.isReadOnlyRootStationGroup
    );

    if (isReadOnlyRootStationGroupIndex !== -1) {
      // Updating the stations in the Root station group.
      this.stationGroupElements[isReadOnlyRootStationGroupIndex].stations.push(
        newStation.rithmId
      );
    }

    //Update the map boundary.
    if (this.boundaryElement) {
      this.boundaryElement.updatePoints(this.stationElements);
    }
    //Note a change in map data.
    this.mapDataReceived$.next(true);
  }

  /**
   * Updates the status of a station to deleted.
   *
   * @param stationId The station for which status has to be set to delete.
   */
  deleteStation(stationId: string): void {
    //Get the index of the stationElement that matches the stationId.
    const index = this.stationElements.findIndex(
      (e) => e.rithmId === stationId
    );
    //If there is a station that matches stationId.
    if (index >= 0) {
      /* If the station is newly created, remove it from the stationElements array,
      otherwise mark that station as deleted. */
      if (this.stationElements[index].status === MapItemStatus.Created) {
        this.stationElements.splice(index, 1);
      } else {
        this.stationElements[index].markAsDeleted();
      }
    }
    //Loop through and change the stationGroupElements array.
    this.stationGroupElements.map((stationGroup) => {
      //Find the station group that includes the station.
      if (stationGroup.stations.includes(stationId)) {
        //Remove the station from the group.
        stationGroup.stations = stationGroup.stations.filter(
          (stn) => stn !== stationId
        );
        //Unless group is new, mark it as updated.
        stationGroup.markAsUpdated();
      }
    });
    //Note a change in map data.
    this.mapDataReceived$.next(true);
  }

  /**
   * Updates pendingStationGroup with the current selected stations and groups.
   */
  updatePendingStationGroup(): void {
    //Set up blank pending group.
    let newGroup = new StationGroupMapElement({
      rithmId: uuidv4(),
      title: 'Pending',
      stations: [],
      subStationGroups: [],
      status: MapItemStatus.Pending,
      isChained: false,
      isReadOnlyRootStationGroup: false,
    });

    //Update the name of station group to newly edited one, if it's changed by user
    const createStationGroup = this.stationGroupElements.find(
      (group) =>
        group.status === MapItemStatus.Pending && group.title !== 'Pending'
    );
    if (createStationGroup) {
      newGroup.title = createStationGroup.title;
    }

    if (this.mapMode$.value === MapMode.StationGroupEdit) {
      const editStationGroup = this.stationGroupElements.find(
        (group) => group.status === MapItemStatus.Pending
      );
      if (!editStationGroup) {
        throw new Error(`There is no station group with status pending.`);
      }
      //Set up pending group for edit.
      newGroup = new StationGroupMapElement({
        rithmId: editStationGroup.rithmId,
        title: editStationGroup.title,
        stations: editStationGroup.stations,
        subStationGroups: editStationGroup.subStationGroups,
        status: MapItemStatus.Pending,
        isChained: editStationGroup.isChained,
        isReadOnlyRootStationGroup: false,
      });
    }

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
   * Delete the station group and find it's parent to move all it's stations and sub groups to parent station group.
   *
   * @param stationGroupId The incoming station group Id to be deleted.
   */
  removeStationGroup(stationGroupId: string): void {
    // Find the station group from this.stationGroupElements array.
    const removedGroup = this.stationGroupElements.find(
      (group) => group.rithmId === stationGroupId
    );
    if (!removedGroup) {
      throw new Error('Station group was not found.');
    }
    //set up a boolean to check if an error needs to be thrown because there is no parent group.
    let parentGroupFound = false;
    this.stationGroupElements.forEach((group) => {
      if (
        //Find parent station group of incoming station group.
        group.subStationGroups.includes(removedGroup.rithmId)
      ) {
        parentGroupFound = true;
        //Remove deleting station group Id from it's parent group
        group.subStationGroups = group.subStationGroups.filter(
          (groupId) => groupId !== removedGroup.rithmId
        );
        //Move all sub station groups of deleted station group to it's parent.
        group.subStationGroups = group.subStationGroups.concat(
          removedGroup.subStationGroups
        );
        //Move all stations of deleted station group to it's parent.
        group.stations = group.stations.concat(removedGroup.stations);
        //Mark parent station group of deleted station group as updated.
        group.markAsUpdated();
        //Remove all stations of deleting station group.
        removedGroup.stations = [];
        //Remove all sub station groups of deleting station group.
        removedGroup.subStationGroups = [];
        //Unless removedGroup has status of created or pending, mark removedGroup as deleted.
        if (
          removedGroup.status !== MapItemStatus.Created &&
          removedGroup.status !== MapItemStatus.Pending
        ) {
          removedGroup.markAsDeleted();
          //Splice created or pending groups out of the stationGroupElements array and remove it from it's parent's subStationGroup array.
        } else {
          const subGroupWithoutDeleted = group.subStationGroups.filter(
            (subGroup) => subGroup !== stationGroupId
          );
          group.subStationGroups = subGroupWithoutDeleted;
          const pendingIndex = this.stationGroupElements.findIndex(
            (pendingGroup) => {
              return pendingGroup.rithmId === removedGroup.rithmId;
            }
          );
          this.stationGroupElements.splice(pendingIndex, 1);
        }
        //Note a change in map data.
        this.mapDataReceived$.next(true);
      }
    });
    if (!parentGroupFound) {
      throw new Error(
        `No parent station group could be found for ${stationGroupId}.`
      );
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
        this.stationElements[stationIndex].selected = isSelected ? true : false;
      });
      this.updateChildStationGroup(subStationGroup);
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
    this.mapDataReceived$.next(true);
  }

  /**
   * Sets isAddingConnected property of station to false if it's true.
   */
  disableConnectedStationMode(): void {
    //looks through the stationElements array and sets isAddingConnected to false on all stations.
    this.stationElements
      .filter((station) => station.isAddingConnected)
      .map((connectedStation) => {
        connectedStation.isAddingConnected = false;
      });
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
   * Enters build mode for the map.
   */
  buildMap(): void {
    //Create copies of all the stations, groups and connections so we can revert to those copies if we cancel our changes.
    this.storedStationElements = this.deepCopy(this.stationElements);
    this.storedStationGroupElements = this.deepCopy(this.stationGroupElements);
    this.storedConnectionElements = this.deepCopy(this.connectionElements);
    //Set mapMode to build.
    this.mapMode$.next(MapMode.Build);
  }

  /**
   * Cancels local map changes and returns to view mode.
   */
  cancelMapChanges(): void {
    //Make sure that there are copies stored.
    if (this.storedStationElements.length > 0) {
      //Revert stationElements to a copy of storedStationElements and reset storedStationElements.
      this.stationElements = this.deepCopy(this.storedStationElements);
      this.storedStationElements = [];
    }
    //Make sure that there are copies stored.
    if (this.storedStationGroupElements.length > 0) {
      //Revert stationGroupElements to a copy of storedStationGroupElements and reset storedStationGroupElements.
      this.stationGroupElements = this.deepCopy(
        this.storedStationGroupElements
      );
      this.storedStationGroupElements = [];
    }
    //Make sure that there are copies stored.
    if (this.storedConnectionElements.length > 0) {
      //Revert connectionElements to a copy of storedConnectionElements and reset storedConnectionElements.
      this.connectionElements = this.deepCopy(this.storedConnectionElements);
      this.storedConnectionElements = [];
    }
    //Set mapMode to view.
    this.mapMode$.next(MapMode.View);
    //Note a change in map data.
    this.mapDataReceived$.next(true);
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
            this.mapDataReceived$.next(true);
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
    //Get starting station of the connection line.
    const startStation = this.stationElements.find(
      (e) =>
        e.nextStations.includes(endStationId) && e.rithmId === startStationId
    );
    //Get the end station of the connection line.
    const endStation = this.stationElements.find(
      (e) =>
        e.previousStations.includes(startStationId) &&
        e.rithmId === endStationId
    );

    if (!startStation) {
      throw new Error(`A start station was not found for ${startStationId}`);
    }
    if (!endStation) {
      throw new Error(`An end station was not found for ${endStationId}`);
    }

    // Find the index for the end station in the nextStations array of startStation.
    const nextStationIndex = startStation.nextStations.findIndex(
      (e) => e === endStationId
    );
    // Find the index for the starting station in the previousStations array of endStation.
    const prevStationIndex = endStation.previousStations.findIndex(
      (e) => e === startStationId
    );

    // Remove station rithm ids from nextStations and previousStations properties.
    startStation.nextStations.splice(nextStationIndex, 1);
    endStation.previousStations.splice(prevStationIndex, 1);
    //Mark the two stations as updated if they aren't new.
    startStation.markAsUpdated();
    endStation.markAsUpdated();

    //Find the index of the connection in this.connectionElements.
    const filteredConnectionIndex = this.connectionElements.findIndex(
      (e) =>
        e.startStationRithmId === startStationId &&
        e.endStationRithmId === endStationId
    );
    //Remove the connection from this.connectionElements.
    if (filteredConnectionIndex !== -1) {
      this.connectionElements.splice(filteredConnectionIndex, 1);
    }
    //Note a change in map data.
    this.mapDataReceived$.next(true);
  }

  /**
   * Calls the zoom() method a number of times equal to the zoomCount.
   * This method is required for a smooth zoom, since we recursively call it every time the scale changes.
   *
   * @param pinch Remove delay if zoom is a pinch zoom.
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   */
  handleZoom(pinch: boolean, zoomOrigin = this.getCanvasCenterPoint()): void {
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
        this.mapScale$.value < MAX_SCALE) ||
      this.mapScale$.value < SCALE_REDUCED_RENDER
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
      this.mapScale$.value > SCALE_REDUCED_RENDER / ZOOM_VELOCITY
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
      this.currentCanvasPoint$.next(adjustedCenter);
      return;
    }

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
        if (
          panType === CenterPanType.Station ||
          panType === CenterPanType.StationGroup
        ) {
          this.stationCenter$.next(true);
        }
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
    const canvasCenter = this.getCanvasCenterPoint();

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
      const groupCenterMapPoint = this.getMapPoint({
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
      });

      //Determine the canvas point of station group to pan it to the center.
      adjustedCenter = {
        x:
          groupCenterMapPoint.x +
          drawerWidth / 2 / this.mapScale$.value -
          canvasCenter.x / this.mapScale$.value,
        y: groupCenterMapPoint.y - canvasCenter.y / this.mapScale$.value,
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
          drawerWidth / 2 / this.mapScale$.value +
          STATION_PAN_CENTER_WIDTH / this.mapScale$.value -
          canvasCenter.x / this.mapScale$.value,
        y:
          openedStation.mapPoint.y +
          STATION_PAN_CENTER_HEIGHT / this.mapScale$.value -
          canvasCenter.y / this.mapScale$.value,
      };
      //If selected map center needs to be pan to center.
    } else if (panType === CenterPanType.MapCenter) {
      //Get the center of the map and the center of the canvas.
      adjustedCenter = this.getMapCenterPoint();

      //Get the point that currentCanvasPoint needs to be set to.
      adjustedCenter = {
        x: adjustedCenter.x - canvasCenter.x / this.mapScale$.value,
        y: adjustedCenter.y - canvasCenter.y / this.mapScale$.value,
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
      y: this.getCanvasY(mapPoint.y),
    };
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
   * Validates that data returned from the API doesn't contain any logical problems.
   */
  private validateMapData(): void {
    this.validateConnections();
    this.validateStationsBelongToExactlyOneStationGroup();
    this.validateStationGroupsBelongToExactlyOneStationGroup();
  }

  /**
   * Validates that all connections exist and are made in both origin station and destination station.
   */
  private validateConnections(): void {
    for (const station of this.stationElements) {
      for (const outgoingStationId of station.nextStations) {
        const outgoingConnectedStation = this.stationElements.find(
          (stationElement) => stationElement.rithmId === outgoingStationId
        );
        if (!outgoingConnectedStation) {
          // eslint-disable-next-line no-console
          console.error(`Station ${station.stationName} is connected to a next station ${outgoingStationId},
           but no station element was found with that id.`);
        } else {
          if (
            !outgoingConnectedStation.previousStations.includes(station.rithmId)
          ) {
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
   * Validates that stations belong to exactly one immediate parent station group.
   */
  private validateStationsBelongToExactlyOneStationGroup(): void {
    // Each station should belong to exactly one station group.
    for (const station of this.stationElements) {
      const stationGroupsThatContainThisStation =
        this.stationGroupElements.filter((stationGroup) =>
          stationGroup.stations.includes(station.rithmId)
        );
      if (stationGroupsThatContainThisStation.length > 1) {
        const stationGroupDetails: string = stationGroupsThatContainThisStation
          .map(
            (stationGroupInfo) =>
              `${stationGroupInfo.rithmId}: ${stationGroupInfo.title}`
          )
          .toString();
        // eslint-disable-next-line no-console,max-len
        console.error(`The station ${station.rithmId}: ${station.stationName} is contained in ${stationGroupsThatContainThisStation.length} station groups:
          ${stationGroupDetails}`);
      } else if (!stationGroupsThatContainThisStation.length) {
        // eslint-disable-next-line no-console
        console.error(
          `No station groups contain the station: ${station.stationName}: ${station.rithmId}`
        );
      }
    }
  }

  /**
   * Validates that station groups belong to exactly one immediate parent station group.
   */
  private validateStationGroupsBelongToExactlyOneStationGroup(): void {
    // Each station group should belong to exactly one station group.
    for (const stationGroup of this.stationGroupElements) {
      const stationGroupsThatContainThisStationGroup =
        this.stationGroupElements.filter((stationGroupElement) =>
          stationGroupElement.subStationGroups.includes(stationGroup.rithmId)
        );
      if (stationGroupsThatContainThisStationGroup.length > 1) {
        // eslint-disable-next-line no-console
        console.error(
          // eslint-disable-next-line max-len
          `The station group ${stationGroup.rithmId}: ${stationGroup.title} is contained in ${stationGroupsThatContainThisStationGroup.length} station groups!`
        );
      } else if (
        !stationGroupsThatContainThisStationGroup.length &&
        !stationGroup.isReadOnlyRootStationGroup
      ) {
        // eslint-disable-next-line no-console
        console.error(
          `No station groups contain the station group: ${stationGroup.title} ${stationGroup.rithmId}`
        );
      }
    }
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
      const storedStation = this.storedStationElements.find(
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
    //If there are still stations or station group with status not normal and not Pending, return true.
    return (
      this.stationElements.some(
        (station) => station.status !== MapItemStatus.Normal
      ) ||
      this.stationGroupElements.some(
        (stationGroup) =>
          stationGroup.status !== MapItemStatus.Normal &&
          stationGroup.status !== MapItemStatus.Pending
      )
    );
  }

  /**
   * Set drawerOpened property of respective map element to false when any drawer is closed.
   *
   */
  handleDrawerClose(): void {
    if (this.stationElements.some((e) => e.drawerOpened)) {
      const openedStations = this.stationElements.filter((e) => e.drawerOpened);
      openedStations.forEach((station) => {
        station.drawerOpened = false;
      });
      this.mapDataReceived$.next(true);
    }
    if (this.stationGroupElements.some((e) => e.drawerOpened)) {
      const openedStationGroups = this.stationGroupElements.filter(
        (e) => e.drawerOpened
      );
      openedStationGroups.forEach((group) => {
        group.drawerOpened = false;
      });
      this.mapDataReceived$.next(true);
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
      //If group name is already changed from "Pending" assign updated one else set "Untitled Group"
      this.stationGroupElements[stationGroupIndex].title =
        this.stationGroupElements[stationGroupIndex].title === 'Pending' ||
        this.stationGroupElements[stationGroupIndex].title === '' ||
        !this.stationGroupElements[stationGroupIndex].title
          ? 'Untitled Group'
          : this.stationGroupElements[stationGroupIndex].title;
      this.stationGroupElements[stationGroupIndex].status =
        MapItemStatus.Created;
      //If edited group already present in storedStationGroupElements, then it's the one which is already created
      //so set it's status to Updated, else Created
    } else if (this.mapMode$.value === MapMode.StationGroupEdit) {
      if (
        this.storedStationGroupElements.some(
          (group) =>
            group.rithmId ===
            this.stationGroupElements[stationGroupIndex].rithmId
        )
      ) {
        this.stationGroupElements[stationGroupIndex].status =
          MapItemStatus.Updated;
      } else {
        this.stationGroupElements[stationGroupIndex].status =
          MapItemStatus.Created;
      }
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
      this.mapDataReceived$.next(true);
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
   * Checks the map when station is selected and its in the center of the map.
   *
   * @param panType Determines the area of the map to be pan to center.
   * @param drawerWidth Width of the opened drawer.
   * @returns True if the option is a selected station is center of the map.
   */
  checkCenter(panType: CenterPanType, drawerWidth = 0): boolean {
    const adjustCenter = this.getAdjustedCenter(panType, drawerWidth);
    const canvasPoint = this.currentCanvasPoint$.value;
    if (panType === CenterPanType.StationGroup) {
      return (
        Math.abs(adjustCenter.x - canvasPoint.x) <= 1 &&
        Math.abs(adjustCenter.y - canvasPoint.y) <= 1
      );
    }
    return adjustCenter.x === canvasPoint.x && adjustCenter.y === canvasPoint.y;
  }
}
