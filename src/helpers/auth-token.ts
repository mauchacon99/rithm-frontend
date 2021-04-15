import { environment } from 'src/environments/environment';

/**
 * Represents all information and behavior with an auth token.
 */
export class AuthToken {

  /** The Base64-encoded auth token. */
  token: string;

  /** The time of expiration represented in milliseconds; `Date.now()`. */
  private expiration: number;

  /**
   * Creates a new `AuthToken` object.
   *
   * @param authToken The Base64-encoded auth token.
   */
  constructor(authToken: string) {
    this.token = authToken;
    this.expiration = Date.now() + environment.authTokenLifetime;
  }

  /**
   * Whether the auth token has expired.
   *
   * @returns True if the token is expired, false otherwise.
   */
  isExpired(): boolean {
    return Date.now() > this.expiration;
  }
}
