import { StationRosterMember } from './station-roster-member';

/**
 * Station lists users for possible rosters.
 */
export interface StationPotentialRostersUsers {

  /** The list of possible users of the station. */
  potentialRosterUsers: StationRosterMember[];

  /** The total number of users in the list. */
  totalUsers: number;
}
