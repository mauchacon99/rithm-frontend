import { StationGroupMapElement } from 'src/helpers';
import { MapHelper } from './map-helper';
/**
 * Represents methods that handle station data for the Map.
 */
export class MapStationGroupHelper {
  /** The station group elements displayed on the map. */
  stationGroupElements: StationGroupMapElement[] = [];

  /** An array that stores a backup of stationGroupElements when buildMap is called. */
  storedStationGroupElements: StationGroupMapElement[] = [];

  constructor(private mapHelper: MapHelper) {}

  /**
   * Validates that station groups belong to exactly one immediate parent station group.
   */
  validateStationGroupsBelongToExactlyOneStationGroup(): void {
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
   * Cancels local station groups changes.
   */
  cancelStationGroupsChanges(): void {
    //Make sure that there are copies stored.
    if (this.storedStationGroupElements.length > 0) {
      //Revert stationGroupElements to a copy of storedStationGroupElements and reset storedStationGroupElements.
      this.stationGroupElements = this.mapHelper.deepCopy(
        this.storedStationGroupElements
      );
      this.storedStationGroupElements = [];
    }
  }

  /**
   * Copy the station group Elements in stationGroupElements.
   */
  stationGroupsDeepCopy(): void {
    this.stationGroupElements = this.mapHelper.deepCopy(
      this.stationGroupElements
    );
  }
}
