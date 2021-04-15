import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Service for intercepting HTTP requests to provide the auth token.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private userService: UserService) { }

  /**
   * Intercepts HTTP requests and provides the auth token in the header.
   *
   * @param request The intercepted HTTP request.
   * @param next The HTTP request to hand to the next interceptor.
   * @returns An HTTP event.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.userService.authToken;

    // Add the auth token, if it exists
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
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
}
