/**
 * Represents all information about worker roster.
 */
export interface WorkerRosterResponse {

  /** The user's first name. */
  firstName: string;

  /** The user's last name. */
  lastName: string;

  /** The email address to the user. */
  email: string;

  /** The user assigned any document or not. */
  isAssigned?: boolean;
}
