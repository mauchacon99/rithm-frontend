import { User } from './user';

/**
 * Represents all info about a station.
 */
export interface Station {

  /** The name of the station. */
  name: string;

  /** Instructions for working in the station. */
  instructions: string;

  /** The number of documents at this station. */
  documents: number; // TODO: temp placeholder that will be changed

  /** The list of supervisors at this station. */
  supervisors: User[];

  /** The list of users on the worker roster at this station. */
  rosterUsers: User[];

}
