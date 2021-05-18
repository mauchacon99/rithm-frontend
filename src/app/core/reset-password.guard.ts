import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { EmailLinkParams } from 'src/helpers';

/**
 * Guard for preventing a user from accessing password reset if query params are not valid.
 */
@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {

  /**
   * Determines if the path has valid query params and can perform the attempted routing action.
   *
   * @param route The attempted route to navigate.
   * @returns True if the user has valid params and is allowed to route, false otherwise.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
  ): boolean {
    const linkParams = new EmailLinkParams(route.queryParamMap);
    return linkParams.valid;
  }

}
