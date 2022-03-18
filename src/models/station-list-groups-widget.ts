import { User } from '.';

/**
 * Represents list of stations of group station.
 */
export interface StationListGroupWidget {
  /** The rithm id of station. */
  rithmId: string;

  /** Name station. */
  name: string;

  /** List users workers. */
  workers: User[];

  /** List users station owners. */
  StationOwners: User[];
}
