import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

/**
 * Service for communication between account settings and top navigation component.
 */
@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  /** The updated user details. */
  private updatedUser$ = new ReplaySubject<UserFirstLast>(1);

  /** The updated user details as observable. */
  currentUser$ = this.updatedUser$.asObservable();

  /**
   * Set's the value of updated user first name and last name.
   *
   * @param user The user first name and last name.
   */
  setUser(user: UserFirstLast): void {
    this.updatedUser$.next(user);
  }
}

interface UserFirstLast {
  /** The first name of the user. */
  firstName: string;

  /** The last name of the user. */
  lastName: string;
}
