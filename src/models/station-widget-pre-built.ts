import { StationRosterMember } from './station-roster-member';

/**
 * Represents all information about station widget prebuilt.
 *
 */
export interface StationWidgetPreBuilt {
  /** The id of the specific station. */
  rithmId: string;
  /** Name Station. */
  name: string;
  /** Number total container. */
  totalContainers: number;
  /** Station group. */
  groupName: string;
  /** List station owners. */
  stationOwners: StationRosterMember[];
}
