import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { PopupService } from './popup.service';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

/**
 * Guard for preventing a user from accessing admin page if not authenticated/Authorized.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private popupService: PopupService,
    private router: Router,
    private authGuard: AuthGuard
  ) {}

  /**
   * Determines if the user is signed in and can access admin routing action.
   *
   * @returns True if the user is signed in and allowed to admin route, false otherwise.
   */
  async canActivate(): Promise<boolean> {
    return this.authGuard.canActivate().then((auth: boolean) => {
      if (!auth) {
        return false;
      } else {
        const user = JSON.parse(<string>localStorage.getItem('user'));
        if (user?.role === 'admin') {
          return true;
        } else {
          this.router.navigateByUrl('dashboard');
          this.popupService.alert({
            title: 'Access denied!!',
            message: 'You do not have permission to view that page.',
          });
          return false;
        }
      }
    });
  }
}
