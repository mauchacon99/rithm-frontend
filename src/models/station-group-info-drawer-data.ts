import { MapItemStatus } from '.';

/**
 * Represents the matDrawer model in component info drawer for station group.
 */
export interface StationGroupInfoDrawerData {
  /** The id of the specific station group. */
  stationGroupRithmId: string;

  /** Name of the Station group. */
  stationGroupName: string;

  /** Number of stations included in station group. */
  numberOfStations: number;

  /** Number of sub groups included in station group. */
  numberOfSubgroups: number;

  /** Mode Edit. */
  editMode: boolean;

  /** Station group is chained or not. */
  isChained: boolean;

  /** The status of the station group (used for the map). */
  stationGroupStatus: MapItemStatus;
}
