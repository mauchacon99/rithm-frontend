import {
  ConnectionMapElement,
  MapHelper,
  StationMapElement,
} from 'src/helpers';
import { MapStationHelper } from './map-station-helper';

/**
 * Represents methods that handle connection data for the Map.
 */
export class MapConnectionHelper {
  /** Data for connection line paths between stations. */
  connectionElements: ConnectionMapElement[] = [];

  /** An array that stores a backup of connectionElements when buildMap is called. */
  storedConnectionElements: ConnectionMapElement[] = [];

  constructor(private mapHelper: MapHelper) {}

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
   * Fills in connections array with info from this.stationElements.
   *
   * @param stationHelper The map station helper reference.
   */
  setConnections(stationHelper: MapStationHelper): void {
    //To avoid duplicating any connections, make sure this.connectionElements starts as an empty array.
    this.connectionElements = [];
    //Loop through stationElements.
    for (const station of stationHelper.stationElements) {
      //Loop through the nextStations array of each station.
      for (const connection of station.nextStations) {
        //Find the station with the same rithmId as connection.
        const outgoingStation = stationHelper.stationElements.find(
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
          this.mapHelper.mapScale$.value
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
   * Validates that all connections exist and are made in both origin station and destination station.
   *
   * @param stationHelper The map station helper reference.
   */
  validateConnections(stationHelper: MapStationHelper): void {
    for (const station of stationHelper.stationElements) {
      for (const outgoingStationId of station.nextStations) {
        const outgoingConnectedStation = stationHelper.stationElements.find(
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
   * Cancels local connections changes.
   */
  cancelConnectionsChanges(): void {
    //Make sure that there are copies stored.
    if (this.storedConnectionElements.length > 0) {
      //Revert connectionElements to a copy of storedConnectionElements and reset storedConnectionElements.
      this.connectionElements = this.mapHelper.deepCopy(
        this.storedConnectionElements
      );
      this.storedConnectionElements = [];
    }
  }

  /**
   * Copy the connection Elements in storedConnectionElements.
   */
  connectionsDeepCopy(): void {
    this.storedConnectionElements = this.mapHelper.deepCopy(
      this.connectionElements
    );
  }
}
