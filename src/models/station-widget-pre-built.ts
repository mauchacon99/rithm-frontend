import { StationRosterMember } from './station-roster-member';

/**
 * Represents all information about station widget prebuilt.
 *
 */
export interface StationWidgetPreBuilt {
  /** The id of the specific station. */
  stationRithmId: string;
  /** Name Station. */
  stationName: string;
  /** Number total container. */
  totalContainers: number;
  /** Station group. */
  stationGroup: string;
  /** List station owners. */
  stationOwners: StationRosterMember[];
}
