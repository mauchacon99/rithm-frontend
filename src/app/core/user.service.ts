import { Injectable } from '@angular/core';

/**
 * Service for all interactions involving a user.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

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
