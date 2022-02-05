import { environment } from 'src/environments/environment';

/**
 * Represents all information and behavior with an access token.
 */
export class AccessToken {
  /** The Base64-encoded access token. */
  token: string;

  /** The time of expiration represented in milliseconds; `Date.now()`. */
  private expiration: number;

  /**
   * Creates a new `AccessToken` object.
   *
   * @param accessToken The Base64-encoded access token.
   */
  constructor(accessToken: string) {
    this.token = accessToken;
    this.expiration = Date.now() + environment.accessTokenLifetime;
  }

  /**
   * Whether the access token has expired.
   *
   * @returns True if the token is expired, false otherwise.
   */
  isExpired(): boolean {
    return Date.now() >= this.expiration;
  }
}
