import { Injectable } from '@angular/core';

/**
 * Service for all interactions involving a user.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

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
   * Checks if the user is currently signed in.
   *
   * @returns True if currently authenticated, false otherwise.
   */
  isSignedIn(): boolean {
    return false;
    // TODO: Check if there is an auth token present
  }

}
