import { StationRosterMember } from './station-roster-member';
/** Represents the data for containers in widget prebuilt. */
export interface ContainerWidgetPreBuilt {
  /** Time flowed. */
  flowedTimeUTC: string;
  /** Container name. */
  nameContainer: string;
  /** Container rithmId. */
  containerRithmId: string;
  /** Station name. */
  stationName: string;
  /** Station rithmId. */
  stationRithmId: string;
  /** Station with owners.  */
  stationOwners: StationRosterMember[];
}
