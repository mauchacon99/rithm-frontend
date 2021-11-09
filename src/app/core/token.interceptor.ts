import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { PopupService } from './popup.service';

/** API routes that don't require an access token. */
const NO_AUTH_ROUTES = [
  '/register',
  '/login',
  '/refresh-token',
  '/validate-email',
  '/forgot-password',
  '/reset-password',
  '/terms-and-conditions'
];

/**
 * Intercepts HTTP requests to provide the access token.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService,
    private popupService: PopupService
  ) { }

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

      // Check if the user is signed in
      return this.checkSignIn().pipe(
        mergeMap((signedIn) => {

          if (!signedIn) {
            this.userService.signOut();
            this.popupService.alert({
              title: 'Session Expired',
              message: 'Your session has expired. Please sign in again to complete that action.'
            });
            return EMPTY;
          } else {
            const newRequest = this.addToken(request.clone());
            return this.passRequest(newRequest, next);
          }
        })
      );

    }

    return this.passRequest(request, next);
  }

  /**
   * Adds the access token to the provided request.
   *
   * @param request The request to add the access token.
   * @returns A new request with the access token.
   */
  private addToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const accessToken = this.userService.accessToken;
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken?.token}`
      }
    });
  }

  /**
   * Checks that the user is signed in.
   *
   * @returns Whether the user is signed in (returned as observable).
   */
  private checkSignIn(): Observable<boolean> {
    return from(this.userService.isSignedIn());
  }

  /**
   * Passes the request on to the next potential interceptor.
   *
   * @param request The new request to be passed on or processed.
   * @param next The HTTP request to hand to the next interceptor.
   * @returns An HTTP event.
   */
  private passRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: unknown) => {

        // If unauthorized, sign the user out
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.userService.signOut();
        }
        return throwError(() => error);
      })
    );
  }
}
