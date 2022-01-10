import { MapItemStatus, MapMode } from '.';

/**
 * Represents the matDrawer model in component info drawer.
 */
export interface StationInfoDrawerData {
  /** The id of the specific station. */
  stationRithmId: string;

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
