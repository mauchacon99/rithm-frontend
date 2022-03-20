import { StationMapElement } from '../station-map-element';
import { MapHelper } from './map-helper';
import { MapConnectionHelper } from './map-connection-helper';
import { ConnectionMapElement, MapStationGroupHelper } from 'src/helpers';
import { MapItemStatus, MapMode, Point } from 'src/models';
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents methods that handle station data for the Map.
 */
export class MapStationHelper {
  /** The station elements displayed on the map. */
  stationElements: StationMapElement[] = [];

  /** An array that stores a backup of stationElements when buildMap is called. */
  storedStationElements: StationMapElement[] = [];

  constructor(private mapHelper: MapHelper) {}

  /**
   * Validates that stations belong to exactly one immediate parent station group.
   *
   * @param stationGroupHelper The map station group helper reference.
   */
  validateStationsBelongToExactlyOneStationGroup(
    stationGroupHelper: MapStationGroupHelper
  ): void {
    // Each station should belong to exactly one station group.
    for (const station of this.stationElements) {
      const stationGroupsThatContainThisStation =
        stationGroupHelper.stationGroupElements.filter((stationGroup) =>
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
   * Update the canvas points for each station.
   *
   * @param mapConnectionHelper The map connection helper reference.
   */
  updateStationCanvasPoints(mapConnectionHelper: MapConnectionHelper): void {
    this.stationElements.forEach((station) => {
      station.canvasPoint = this.mapHelper.getCanvasPoint(station.mapPoint);
      //Update the connection lines as the stations are updated.
      mapConnectionHelper.updateConnection(station);
    });

    //Also update the boundary canvas points.
    if (this.mapHelper.boundaryElement) {
      //Update the canvas points of the boundary.
      this.mapHelper.boundaryElement.minCanvasPoint =
        this.mapHelper.getCanvasPoint(
          this.mapHelper.boundaryElement.minMapPoint
        );
      this.mapHelper.boundaryElement.maxCanvasPoint =
        this.mapHelper.getCanvasPoint(
          this.mapHelper.boundaryElement.maxMapPoint
        );
    }
  }

  /**
   * Cancels local stations changes.
   */
  cancelStationsChanges(): void {
    //Make sure that there are copies stored.
    if (this.storedStationElements.length > 0) {
      //Revert stationElements to a copy of storedStationElements and reset storedStationElements.
      this.stationElements = this.mapHelper.deepCopy(
        this.storedStationElements
      );
      this.storedStationElements = [];
    }
  }

  /**
   * Copy the stations Elements in storedStationElements.
   */
  stationsDeepCopy(): void {
    this.storedStationElements = this.mapHelper.deepCopy(this.stationElements);
  }

  /**
   * Updates the status of a station to deleted.
   *
   * @param stationId The station for which status has to be set to delete.
   * @param mapStationGroup The map station group helper reference.
   */
  deleteStation(
    stationId: string,
    mapStationGroup: MapStationGroupHelper
  ): void {
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
    mapStationGroup.stationGroupElements.map((stationGroup) => {
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
    this.mapHelper.mapDataReceived$.next(true);
  }

  /**
   * Create a new Station. Add connection if station is built off "Add Connected Station".
   *
   * @param coords The coordinates where the station will be placed.
   * @param mapStationGroup The map station group helper reference.
   * @param mapConnectionHelper The map connection helper reference.
   */
  createNewStation(
    coords: Point,
    mapStationGroup: MapStationGroupHelper,
    mapConnectionHelper: MapConnectionHelper
  ): void {
    //Set the coordinates used for mapPoint.
    const mapCoords = this.mapHelper.getMapPoint(coords);
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
      const stationGroupIndex = mapStationGroup.stationGroupElements.findIndex(
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
          this.mapHelper.mapScale$.value
        );

        /* Make sure we aren't duplicating and connections already inside connectionElements.
        The connection elements array will get filled in as the station elements for loop progresses. */
        if (!mapConnectionHelper.connectionElements.includes(lineInfo)) {
          mapConnectionHelper.connectionElements.push(lineInfo);
        }
        //Set mapMode back to build from addStation.
        this.mapHelper.mapMode$.next(MapMode.Build);
        //Unless station is new, it should be marked as updated.
        this.stationElements[stationIndex].markAsUpdated();

        //The connecting station is found in a group, and the newStation is not found in that group.
        if (
          stationGroupIndex >= 0 &&
          !mapStationGroup.stationGroupElements[
            stationGroupIndex
          ].stations.includes(newStation.rithmId)
        ) {
          //push newStation to the stations array of the same group as the connecting station.
          mapStationGroup.stationGroupElements[stationGroupIndex].stations.push(
            newStation.rithmId
          );
          //Unless group is new, mark it as updated.
          mapStationGroup.stationGroupElements[
            stationGroupIndex
          ].markAsUpdated();
        }
        //if isAddingConnected property is true, set it to false.
        this.disableConnectedStationMode();
      }
    }

    //Update the stationElements array.
    this.stationElements.push(newStation);

    // Find the Root Station Group index.
    const isReadOnlyRootStationGroupIndex =
      mapStationGroup.stationGroupElements.findIndex(
        (stationGroup) => stationGroup.isReadOnlyRootStationGroup
      );

    if (isReadOnlyRootStationGroupIndex !== -1) {
      // Updating the stations in the Root station group.
      mapStationGroup.stationGroupElements[
        isReadOnlyRootStationGroupIndex
      ].stations.push(newStation.rithmId);
    }

    //Update the map boundary.
    if (this.mapHelper.boundaryElement) {
      this.mapHelper.boundaryElement.updatePoints(this.stationElements);
    }
    //Note a change in map data.
    this.mapHelper.mapDataReceived$.next(true);
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
}
