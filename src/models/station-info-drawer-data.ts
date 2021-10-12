import { StationInformation } from './station-info';

/**
 * Represents the matDrawer model in component info drawer.
 */
export interface StationInfoDrawerData {

  /** StationInformation the type StationInformation model. */
  stationInformation: StationInformation;

  /** Name Station. */
  stationName: string;

  /** Is Worker. */
  isWorker: boolean;

  /** Mode Edit. */
  editMode: boolean;
}
