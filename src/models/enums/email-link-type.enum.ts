/**
 * Represents all the contexts for email link actions.
 */
export enum EmailLinkType {
  /** The email link is used for verifying an email address after registration. */
  Register = 'register',

  /** The email link is used for initiating password reset. */
  ForgotPassword = 'reset',
}
