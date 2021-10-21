
/**
 * List the roster in organization.
 */

export interface OrganizationRosterList {
  /** The user's first name. */
  firstName: string;

  /** The user's last name. */
  lastName: string;

  /** The email address for the user. */
  email: string;

  /** Is worker or not. */
  isWorker: boolean;

  /** Is owner or not. */
  isOwner: boolean;

}
