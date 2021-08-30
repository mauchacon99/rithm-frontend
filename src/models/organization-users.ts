import { User } from './user';

/**
 * Station documents data.
 */
 export interface OrganizationUsers {

  /** The list of the documents for the station. */
  users: User[];

  /** The total number of documents in the station. */
  totalOrgUsers: number;

}
