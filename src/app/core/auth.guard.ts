import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { PopupService } from './popup.service';
import { UserService } from './user.service';

/**
 * Guard for preventing a user from accessing pages if not authenticated.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private popupService: PopupService
  ) {}

  /**
   * Determines if the user is signed in and can perform the attempted routing action.
   *
   * @returns True if the user is signed in and allowed to route, false otherwise.
   */
  async canActivate(): Promise<boolean> {
    // If logged in, return true
    if (await this.userService.isSignedIn()) {
      if (!this.userService.user) {
        this.signOut('User object destroyed');
        return false;
      }
      return true;
    } else {
      this.signOut('Session Expired');
      return false;
    }
  }

  /**
   * User should sign out and display error message in popup alert.
   *
   * @param title Title for popup alert.
   */
  signOut(title: string): void {
    this.userService.signOut();
    this.popupService.alert({
      title,
      message: "You'll need to sign in again before you can view that page.",
    });
  }
}
