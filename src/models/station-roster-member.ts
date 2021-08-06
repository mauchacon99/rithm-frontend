/**
 * Represents all information about a member on a roster for a station (both supervisor roster and worker roster).
 *
 * @see `StationRosterViewModel` model in the back end.
 */
export interface StationRosterMember {

  /** The unique Rithm ID for the member on the roster. */
  readonly userRithmId: string;

  /** The user's first name. */
  readonly firstName: string;

  /** The user's last name. */
  readonly lastName: string;

  /** The email address for the user. */
  readonly email: string;

  /** The user assigned any document or not. */
  isAssigned?: boolean;
}
