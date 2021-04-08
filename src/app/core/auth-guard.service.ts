import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DialogService } from './dialog.service';
import { UserService } from './user.service';

/**
 * Service for preventing a user from accessing pages if not authenticated.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
              private userService: UserService,
              private dialogService: DialogService) {}

  /**
   * Determines if the user is signed in and can perform the attempted routing action.
   *
   * @returns True if the user is signed in and allowed to route, false otherwise.
   */
  canActivate(): boolean {
    // If logged in, return true
    if (this.userService.isSignedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('');
      this.dialogService.alert({
        title: 'Action Not Permitted',
        message: 'You need to sign in before you can view that page.'
      });
      return false;
    }
  }
}
