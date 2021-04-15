import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { UserService } from './user.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccessToken } from 'src/helpers';

/** API routes that don't require an access token. */
const NO_AUTH_ROUTES = [
  '/Register',
  '/Login',
  '/ForgotPassword', // TODO: Update with actual path
  '/ResetPassword' // TODO: Update with actual path
];

/**
 * Service for intercepting HTTP requests to provide the access token.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  /** Whether an access token refresh is currently in progress. */
  private refreshInProgress = false;

  /** Subject for the updated access token. */
  private authToken$ = new BehaviorSubject(null);

  constructor(private userService: UserService) { }

  /**
   * Intercepts HTTP requests and provides the access token in the header.
   *
   * @param request The intercepted HTTP request.
   * @param next The HTTP request to hand to the next interceptor.
   * @returns An HTTP event.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // If an auth-required route
    if (NO_AUTH_ROUTES.every((route) => !request.url.includes(route))) {

      // Get token
      let accessToken = this.userService.accessToken;

      // If token missing or expired, refresh token
      if (accessToken.isExpired()) {
        accessToken = this.userService.refreshToken();
      }

      // Add token to request
    }
    return next.handle(this.addToken(accessToken, request)).pipe(
      catchError((error) => {

        // If unauthorized, sign the user out
        if (error.status === 401) {
          this.userService.signOut();
        }
        const errorDetail = error.error.message || error.statusText;
        return throwError(errorDetail);
      })
    );
  }

  /**
   * Adds the access token to the provided request.
   *
   * @param accessToken The access token to add.
   * @param request The request to add the access token.
   * @returns A new request with the access token.
   */
  private addToken(accessToken: AccessToken, request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
}
