import { StationRosterMember } from '.';

/**
 * Represents list of stations of group station.
 */
export interface StationListGroup {
  /** The rithm id of station. */
  rithmId: string;

  /** Name station. */
  name: string;

  /** Number of Total documents. */
  totalDocuments: number;

  /** List users workers. */
  workers: StationRosterMember[];

  /** List users station owners. */
  stationOwners: StationRosterMember[];
}
