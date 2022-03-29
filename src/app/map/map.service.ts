import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  MapMode,
  Point,
  MapData,
  MapItemStatus,
  EnvironmentName,
} from 'src/models';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import {
  ConnectionMapElement,
  StationGroupMapElement,
  StationMapElement,
  MapHelper,
  MapConnectionHelper,
  MapStationGroupHelper,
  MapStationHelper,
  ZoomHelper,
  CenterHelper,
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

  /** The Map Helper. */
  mapHelper = new MapHelper();

  /** The Map Connection Helper. */
  mapConnectionHelper = new MapConnectionHelper(this.mapHelper);

  /** The Map Station Helper. */
  mapStationHelper = new MapStationHelper(this.mapHelper);

  /** The Station Group Helper. */
  mapStationGroupHelper = new MapStationGroupHelper(this.mapHelper);

  /** The Zoom Helper. */
  zoomHelper = new ZoomHelper(this.mapHelper);

  /** The Map Center Helper. */
  centerHelper = new CenterHelper(
    this.mapHelper,
    this.mapStationHelper,
    this.mapStationGroupHelper,
    this.zoomHelper
  );

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
   * Getter The canvas context.
   *
   * @returns CanvasRenderingContext2D | undefined.
   */
  get canvasContext(): CanvasRenderingContext2D | undefined {
    return this.mapHelper.canvasContext;
  }

  /**
   * Registers the canvas rendering context from the component for use elsewhere.
   *
   * @param canvasContext The rendering context for the canvas element.
   */
  registerCanvasContext(canvasContext: CanvasRenderingContext2D): void {
    this.mapHelper.registerCanvasContext(canvasContext);
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
    this.mapStationGroupHelper.setStationGroupStatus(
      stationGroup,
      this.mapStationHelper
    );
  }

  /**
   * Set disable status to true before updating station-group and station status so that only current stationGroup is enabled to de-select.
   */
  setStationGroupStationStatus(): void {
    this.mapStationGroupHelper.setStationGroupStationStatus(
      this.mapStationHelper
    );
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
    this.mapStationGroupHelper.setSelectedStation(
      station,
      this.mapStationHelper
    );
  }

  /**
   * Removes the connections from a station, and removes that station from the connections of previous and next stations.
   *
   * @param stationId The station ID for which connections have to be removed.
   */
  removeAllStationConnections(stationId: string): void {
    this.mapStationHelper.removeAllStationConnections(
      stationId,
      this.mapConnectionHelper
    );
  }

  /**
   * Enters build mode for the map.
   */
  buildMap(): void {
    //Set mapMode to build.
    this.mapHelper.mapMode$.next(MapMode.Build);
    //Create copies of all the stations, groups and connections so we can revert to those copies if we cancel our changes.
    this.mapStationHelper.stationsDeepCopy();
    this.mapStationGroupHelper.stationGroupsDeepCopy();
    this.mapConnectionHelper.connectionsDeepCopy();
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
    this.mapStationGroupHelper.stationGroupElements.map((stationGroup) => {
      if (stationGroup.status === MapItemStatus.Pending) {
        this.updateCreatedStationGroup(stationGroup.rithmId);
      }
    });

    //Get all updated, new and deleted stations and groups.
    const filteredData: MapData = {
      stations: this.mapStationHelper.stationElements.filter(
        (e) => e.status !== MapItemStatus.Normal
      ),
      stationGroups: this.mapStationGroupHelper.stationGroupElements.filter(
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
            //After the post, set all new and updated stations' and groups' statuses back to normal.
            this.mapStationHelper.removeDeletedAndSetNormalStations();
            this.mapStationGroupHelper.removeDeletedAndSerNormalStationGroup();
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
    this.mapStationHelper.stationsHaveChanges();
    //If there are still stations or station group with status not normal and not Pending, return true.
    return (
      this.mapStationHelper.stationElements.some(
        (station) => station.status !== MapItemStatus.Normal
      ) ||
      this.mapStationGroupHelper.stationGroupElements.some(
        (stationGroup) =>
          stationGroup.status !== MapItemStatus.Normal &&
          stationGroup.status !== MapItemStatus.Pending
      )
    );
  }

  /**
   * Set drawerOpened property of respective map element to false when any drawer is closed.
   */
  handleDrawerClose(): void {
    if (this.stationElements.some((e) => e.drawerOpened)) {
      const openedStations = this.mapStationHelper.stationElements.filter(
        (e) => e.drawerOpened
      );
      openedStations.forEach((station) => {
        station.drawerOpened = false;
      });
      this.mapHelper.mapDataReceived$.next(true);
    }
    if (
      this.mapStationGroupHelper.stationGroupElements.some(
        (e) => e.drawerOpened
      )
    ) {
      const openedStationGroups = this.stationGroupElements.filter(
        (e) => e.drawerOpened
      );
      openedStationGroups.forEach((group) => {
        group.drawerOpened = false;
      });
      this.mapHelper.mapDataReceived$.next(true);
    }
    //On station drawer closed, set the connection highlight point false.
    this.mapConnectionHelper.connectionElements.map(
      (e) => (e.highlighted = false)
    );
  }

  /**
   * Update the status to create for a new station group.
   *
   * @param rithmId The specific rithm Id of the station group.
   */
  updateCreatedStationGroup(rithmId: string): void {
    this.mapStationGroupHelper.updateCreatedStationGroup(
      rithmId,
      this.mapStationHelper
    );
  }

  /**
   * Revert the changes made across station group in edit mode.
   *
   */
  revertStationGroup(): void {
    this.mapStationGroupHelper.revertStationGroup(this.mapStationHelper);
  }

  /**
   * Whether the last station group to be de-selected.
   *
   * @returns True if the last station group to be de-selected, false otherwise.
   */
  get isLastStationGroup(): boolean {
    return (
      this.mapStationGroupHelper.stationGroupElements.filter(
        (e) => e.selected && !e.disabled
      ).length === 1 &&
      this.mapStationHelper.stationElements.filter(
        (e) => e.selected && !e.disabled
      ).length === 0
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
