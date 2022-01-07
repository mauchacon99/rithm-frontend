import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { EmailLinkParams } from 'src/helpers';
import { EmailLinkType } from 'src/models';

/**
 * Guard for preventing a user from accessing password reset if query params are not valid.
 */
@Injectable({
  providedIn: 'root',
})
export class ResetPasswordGuard implements CanActivate {
  constructor(private router: Router) {}

  /**
   * Determines if the path has valid query params and can perform the attempted routing action.
   *
   * @param route The attempted route to navigate.
   * @returns True if the user has valid params and is allowed to route, false otherwise.
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const linkParams = new EmailLinkParams(route.queryParamMap);
    const allowNavigation =
      linkParams.valid && linkParams.type === EmailLinkType.ForgotPassword;

    if (!allowNavigation) {
      this.router.navigateByUrl('');
    }

    return allowNavigation;
  }
}
