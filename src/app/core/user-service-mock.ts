/* eslint-disable */
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SignInResponse } from 'src/models';

/**
 * Mocks methods of the `UserService`.
 */
export class MockUserService {

  signIn(email: string, password: string): Observable<SignInResponse> {
    let response;

    if (email.includes('unverified')) {
      response = new HttpErrorResponse({
        error: {
          error: 'Unable to login before email has been verified.'
        }
      });
    } else if (email.includes('incorrect')) {
      response = new HttpErrorResponse({
        error: {
          error: 'Invalid username or password.'
        }
      });
    } else if (email.includes('error')) {
      response = new HttpErrorResponse({
        status: 500,
        error: ''
      });
    } else {
      return of({
        accessToken: 'wowowowo',
        user: undefined
      }).pipe(delay(1000));
    }

    return throwError(response).pipe(delay(1000));
  }

  /**
   * Registers a new user in the system.
   *
   * @param firstName The new user's first name.
   * @param lastName The new user's last name.
   * @param email The new user's email address.
   * @param password The password set for the new user.
   * @returns An empty observable.
   */
  register(firstName: string, lastName: string, email: string, password: string): Observable<void> {
    if (email.includes('error')) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Unable to login before email has been verified.'
        }
      })).pipe(delay(1000));
    }
    return of();
  }
}
