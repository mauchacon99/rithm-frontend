/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AccessToken } from 'src/helpers';
import { SignInResponse, TokenResponse } from 'src/models';

/**
 * Mocks methods of the `UserService`.
 */
export class MockUserService {

  /** The access token to be used to authenticate for every request. */
  accessToken = new AccessToken('tokentokentokentokentoken');

  /**
   * Signs the user in to the system.
   *
   * @param email The email address for the user.
   * @param password The entered password for the user.
   * @returns The user and access/refresh tokens.
   */
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
   * Gets a new access token from the API.
   *
   * @returns The new access token.
   */
  refreshToken(): Observable<TokenResponse> {
    return of({ accessToken: 'asdfasdfasdfasdf' }).pipe(delay(1000));
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

  /**
   * Attempts to validate an email address with the API.
   *
   * @param guid The identifier used to validate the email address.
   * @param email The email address to verify.
   * @returns An empty observable.
   */
  validateEmail(guid: string, email: string): Observable<void> {
    if (email.includes('error')) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      }));
    }
    return of();
  }

  /**
   * Attempts to send an email to the user to allow them to reset their password.
   *
   * @param email The email address associated with the user account.
   * @returns An empty observable.
   */
  sendPasswordResetEmail(email: string): Observable<void> {
    if (email.includes('error')) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      }));
    }
    return of();
  }
}
