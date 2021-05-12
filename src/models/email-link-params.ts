/**
 * All information present on a URL link to the sign in page from a user's email.
 */
export interface EmailLinkParams {
  /** The context of the action to be performed on the sign in page. */
  type: 'register' | 'forgot password';

  /** The unique identifier used to validate this request (through the user's email.). */
  guid: string;

  /** The email address of the user. */
  email: string;
}
