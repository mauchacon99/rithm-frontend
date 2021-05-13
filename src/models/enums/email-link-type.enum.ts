/**
 * Represents all the contexts for email link actions.
 */
export enum EmailLinkType {
  /** The email link is used for verifying an email address after registration. */
  register = 'register',

  /** The email link is used for initiating password reset. */
  forgotPassword = 'forgotPassword' // TODO: change this to actual string once confirmed
}
