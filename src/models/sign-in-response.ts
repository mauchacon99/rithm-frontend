import { User } from './user';

/**
 * Represents all info returned from a successful login request.
 */
export interface SignInResponse {

  /** The access token for future requests. */
  accessToken: string;

  /** The refresh token used for getting future access tokens. */
  // refreshToken: string;

  /** The object for the newly-signed in user. */
  user?: User;
}
