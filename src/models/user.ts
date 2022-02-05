/**
 * Represents all information about a Rithm user.
 */
export interface User {
  /** The global Rithm ID for this user. */
  readonly rithmId: string;

  /** The user's first name. */
  firstName: string;

  /** The user's last name. */
  lastName: string;

  /** The email address registered to the user. */
  readonly email: string;

  /** Whether the user has verified their email address. */
  readonly isEmailVerified: boolean;

  /** The settings for the user's notification preferences. */
  notificationSettings: unknown; // TODO: update to match back end when story is completed

  /** The is Assigned property to match worker roster model. */
  isAssigned?: boolean;

  /** The date at which this user was created. */
  readonly createdDate: string;

  /** The user's role. */
  role: 'admin' | null;

  /** The IDs of the organizations user belongs to. */
  readonly organization: string;
}
