import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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
