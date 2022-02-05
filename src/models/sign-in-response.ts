import { TokenResponse } from './token-response';
import { User } from './user';

/**
 * Represents all info returned from a successful login request.
 */
export interface SignInResponse extends TokenResponse {
  /** The GUID refresh token used for getting future access tokens (in addition to the cookie refresh token). */
  readonly refreshTokenGuid: string;

  /** The object for the newly-signed in user. */
  user: User;
}
