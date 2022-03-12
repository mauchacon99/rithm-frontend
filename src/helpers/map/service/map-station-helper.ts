import { StationMapElement } from '../station-map-element';
import { MapHelper } from './map-helper';
import { MapConnectionHelper } from './map-connection-helper';
import { MapStationGroupHelper } from 'src/helpers';

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
}
