import { StationInformation } from './station-info';

/**
 * Represents the matDrawer model in component info drawer.
 */
export interface StationInfoDrawerData {

  /** StationInformation the type StationInformation model. */
  stationInformation: StationInformation;

  /** Name Station. */
  stationName: string;

  /** Mode Edit. */
  editMode: boolean;

  /** Whether the station has been created locally and doesn't yet exist (used for the map). */
  locallyCreated: boolean;

  /** Whether the station drawer is opened from map or not (used for the map). */
  openedFromMap: boolean;
}
