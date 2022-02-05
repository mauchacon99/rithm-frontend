import { User } from './user';
/**
 * Represents all Users for an organization.
 */
export interface OrganizationUsers {
  /** The total users of an organization. */
  totalOrgUsers: number;

  /** The current page number. */
  currentPageNum: number;

  /** The number of users per page. */
  userPerPage: number;

  /** Users list of the current page. */
  users: User[];
}
