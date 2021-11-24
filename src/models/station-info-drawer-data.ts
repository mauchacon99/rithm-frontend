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

  /** Station Status. */
  stationStatus?: MapItemStatus;
}
