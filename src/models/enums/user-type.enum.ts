/**
 * Represents all the user types to access station documents.
 */
export enum UserType {
  /** The user with role worker. */
  Worker = 'worker',

  /** The user with role station owner. */
  StationOwner = 'stationOwner',

  /** The user with role admin. */
  Admin = 'admin',

  /** The user with no role assigned. */
  None = 'none',
}
