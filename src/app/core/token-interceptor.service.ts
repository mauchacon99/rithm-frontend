import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { UserService } from './user.service';
import { BehaviorSubject, EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AccessToken } from 'src/helpers';

/** API routes that don't require an access token. */
const NO_AUTH_ROUTES = [
  '/register',
  '/login',
  '/refreshtoken',
  '/forgotPassword', // TODO: Update with actual path
  '/resetPassword' // TODO: Update with actual path
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

      // Check if the user is signed in
      return this.checkSignIn().pipe(
        mergeMap((signedIn) => {

          if (!signedIn) {
            this.userService.signOut();
            return EMPTY;
          } else {

            // Add token to request
            const accessToken = this.userService.accessToken as AccessToken;
            const newRequest = this.addToken(accessToken, request.clone());

            return next.handle(newRequest).pipe(
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
        })
      );

    }

    return next.handle(request).pipe(
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

  private checkSignIn(): Observable<boolean> {
    return from(this.userService.isSignedIn());
  }
}
