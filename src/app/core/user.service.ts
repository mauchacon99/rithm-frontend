import { Injectable } from '@angular/core';

/**
 * Service for all interactions involving a user.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /** The auth token to be used to authenticate for every request. */
  authToken = '';

  /**
   * Signs the user in to the system.
   *
   * @param email The email address for the user.
   * @param password The entered password for the user.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signIn(email: string, password: string): void {
    // RIT-144
  }

  /**
   * Signs the user out of the system and clears stored data.
   */
  signOut(): void {
    // TODO: clear storage
  }

  /**
   * Checks if the user is currently signed in.
   *
   * @returns True if currently authenticated, false otherwise.
   */
  isSignedIn(): boolean {
    return false;
    // TODO: Check if there is an auth token present
  }

  /**
   * Gets a new auth token from the API.
   *
   * @returns The new auth token.
   */
  refreshToken(): string {
    return '';
    // TODO: Set up HTTP request
  }

}
