import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { PopupService } from './popup.service';
import { UserService } from './user.service';

/**
 * Guard for preventing a user from accessing pages if not authenticated.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private popupService: PopupService
  ) { }

  /**
   * Determines if the user is signed in and can perform the attempted routing action.
   *
   * @returns True if the user is signed in and allowed to route, false otherwise.
   */
  async canActivate(): Promise<boolean> {
    // If logged in, return true
    if (await this.userService.isSignedIn()) {
      return true;
    } else {
      this.userService.signOut();
      this.popupService.alert({
        title: 'Session Expired',
        message: 'You\'ll need to sign in again before you can view that page.'
      });
      return false;
    }
  }
}
