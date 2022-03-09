import { Injectable } from '@angular/core';
import { MapItemStatus, MapMode, Point } from 'src/models';
import { MapService } from '../map.service';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionMapElement, StationMapElement } from 'src/helpers';

/**
 * Service for the map station behavior.
 */
@Injectable({
  providedIn: 'root'
})
export class MapStationService {

  constructor(
    private mapService: MapService
  ) {}

  /**
   * Update the canvas points for each station.
   */
  updateStationCanvasPoints(): void {
    this.mapService.stationElements.forEach((station) => {
      station.canvasPoint = this.mapService.getCanvasPoint(station.mapPoint);
      //Update the connection lines as the stations are updated.
      this.mapService.updateConnection(station);
    });

    //Also update the boundary canvas points.
    if (this.mapService.boundaryElement) {
      //Update the canvas points of the boundary.
      this.mapService.boundaryElement.minCanvasPoint = this.mapService.getCanvasPoint(
        this.mapService.boundaryElement.minMapPoint
      );
      this.mapService.boundaryElement.maxCanvasPoint = this.mapService.getCanvasPoint(
        this.mapService.boundaryElement.maxMapPoint
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
    const mapCoords = this.mapService.getMapPoint(coords);
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
    const connectedStations = this.mapService.stationElements.filter(
      (station) => station.isAddingConnected
    );
    //Make sure there isn't more than one station with isAddingConnected = true.
    if (connectedStations.length === 1) {
      //find the index of the station whose rithmId matches the connectedStation const.
      const stationIndex = this.mapService.stationElements.findIndex(
        (station) => station.rithmId === connectedStations[0].rithmId
      );
      //Find the index of the station group that incudes the station matching connectedStation.
      const stationGroupIndex = this.mapService.stationGroupElements.findIndex(
        (stationGroup) =>
          stationGroup.stations.includes(connectedStations[0].rithmId)
      );
      //If a station matching connectedStation was found.
      if (stationIndex >= 0) {
        //Reset connecting station's isAddingConnected.
        this.mapService.stationElements[stationIndex].isAddingConnected = false;
        //Add the new station to the nextStations array of the connecting station.
        this.mapService.stationElements[stationIndex].nextStations.push(
          newStation.rithmId
        );
        //Add the connecting station to the previousStations array of the new station.
        newStation.previousStations.push(
          this.mapService.stationElements[stationIndex].rithmId
        );

        //Use the connecting station and the next station to create a new connectedMapElement.
        const lineInfo = new ConnectionMapElement(
          this.mapService.stationElements[stationIndex],
          newStation,
          this.mapService.mapScale$.value
        );

        /* Make sure we aren't duplicating and connections already inside connectionElements.
        The connection elements array will get filled in as the station elements for loop progresses. */
        if (!this.mapService.connectionElements.includes(lineInfo)) {
          this.mapService.connectionElements.push(lineInfo);
        }
        //Set mapMode back to build from addStation.
        this.mapService.mapMode$.next(MapMode.Build);
        //Unless station is new, it should be marked as updated.
        this.mapService.stationElements[stationIndex].markAsUpdated();

        //The connecting station is found in a group, and the newStation is not found in that group.
        if (
          stationGroupIndex >= 0 &&
          !this.mapService.stationGroupElements[stationGroupIndex].stations.includes(
            newStation.rithmId
          )
        ) {
          //push newStation to the stations array of the same group as the connecting station.
          this.mapService.stationGroupElements[stationGroupIndex].stations.push(
            newStation.rithmId
          );
          //Unless group is new, mark it as updated.
          this.mapService.stationGroupElements[stationGroupIndex].markAsUpdated();
        }
        //if isAddingConnected property is true, set it to false.
        this.mapService.disableConnectedStationMode();
      }
    }

    //Update the stationElements array.
    this.mapService.stationElements.push(newStation);

    // Find the Root Station Group index.
    const isReadOnlyRootStationGroupIndex = this.mapService.stationGroupElements.findIndex(
      (stationGroup) => stationGroup.isReadOnlyRootStationGroup
    );

    if (isReadOnlyRootStationGroupIndex !== -1) {
      // Updating the stations in the Root station group.
      this.mapService.stationGroupElements[isReadOnlyRootStationGroupIndex].stations.push(
        newStation.rithmId
      );
    }

    //Update the map boundary.
    if (this.mapService.boundaryElement) {
      this.mapService.boundaryElement.updatePoints(this.mapService.stationElements);
    }
    //Note a change in map data.
    this.mapService.mapDataReceived$.next(true);
  }

  /**
   * Updates the status of a station to deleted.
   *
   * @param stationId The station for which status has to be set to delete.
   */
  deleteStation(stationId: string): void {
    //Get the index of the stationElement that matches the stationId.
    const index = this.mapService.stationElements.findIndex(
      (e) => e.rithmId === stationId
    );
    //If there is a station that matches stationId.
    if (index >= 0) {
      /* If the station is newly created, remove it from the stationElements array,
      otherwise mark that station as deleted. */
      if (this.mapService.stationElements[index].status === MapItemStatus.Created) {
        this.mapService.stationElements.splice(index, 1);
      } else {
        this.mapService.stationElements[index].markAsDeleted();
      }
    }
    //Loop through and change the.mapService stationGroupElements array.
    this.mapService.stationGroupElements.map((stationGroup) => {
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
    this.mapService.mapDataReceived$.next(true);
  }
}
