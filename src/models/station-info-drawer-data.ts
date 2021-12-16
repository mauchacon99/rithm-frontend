import { MapItemStatus, MapMode } from '.';
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

  /** Map Mode. */
  mapMode?: MapMode;

  /** The status of the station (used for the map). */
  stationStatus?: MapItemStatus;

  /** Whether the station drawer is opened from map or not (used for the map). */
  openedFromMap: boolean;

  /** Optional notes to station. */
  notes?: string;
}
