/**
 * Represents all the user types to access station documents.
 */
export enum UserType {
  /** The user with role worker. */
  worker = 'worker',

  /** The user with role supervisor. */
  supervisor = 'supervisor',

  /** The user with role admin. */
  admin = 'admin',

  /** The user with no role assigned. */
  none = 'none'
}
