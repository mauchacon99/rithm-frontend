import { UserType } from './enums';

/**
 * Represents all information get from members.
 */
export interface RosterMember {

  /** First name member. */
  firstName: string;

  /** Last name member. */
  lastName: string;

  /** Email member. */
  email: string;

  /** Enum station owner.*/
  rosterMember: UserType;
}
