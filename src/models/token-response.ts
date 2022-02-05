/**
 * Represents all info returned from a successful token refresh request.
 */
export interface TokenResponse {
  /** The access token for future requests. */
  readonly accessToken: string;
}
