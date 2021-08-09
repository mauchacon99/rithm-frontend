
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for communication between account settings and top navigation component.
 */
@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {

  /** The updated user details. */
  private updatedUser$ = new BehaviorSubject<any>({});

  /** The updated user details as observable. */
  currentUser$ = this.updatedUser$.asObservable();

  /**
   * Set's the value of updated user first name and last name.
   *
   * @param user The user first name and last name.
   */
  setUser(user: unknown): void {
    this.updatedUser$.next(user);
  }

}
