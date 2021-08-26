import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { PopupService } from './popup.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';

/**
 * Guard for preventing a user from accessing admin page if not authenticated/Authorized.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private popupService: PopupService,
    private router: Router
  ) { }

  /**
   * Determines if the user is signed in and can access admin routing action.
   *
   * @returns True if the user is signed in and allowed to admin route, false otherwise.
   */
  async canActivate(): Promise<boolean> {
    // If logged in, return true
    if (await this.userService.isSignedIn()) {
      const user = JSON.parse(<string>localStorage.getItem('user'));
      if (user?.role === 'admin') {
        return true;
      } else {
        this.router.navigateByUrl('dashboard');
        this.popupService.alert({
          title: 'Access denied!!',
          message: 'You do not have permission to view that page.'
        });
        return false;
      }
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
