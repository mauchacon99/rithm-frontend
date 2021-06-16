/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AccessToken } from 'src/helpers';
import { SignInResponse, TokenResponse, User } from 'src/models';

/**
 * Mocks methods of the `UserService`.
 */
export class MockUserService {

  /** The access token to be used to authenticate for every request. */
  accessToken = new AccessToken('tokentokentokentokentoken');

  /** The currently signed in user. */
  user: User | undefined;

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
        refreshTokenGuid: 'ab5d4-ae56g',
        user: undefined
      }).pipe(delay(1000));
    }

    return throwError(response).pipe(delay(1000));
  }

  /**
   * Signs the user out of the system and clears stored data.
   */
   signOut(): void {}

  /**
   * Checks if the user is signed in and attempts to get a new refresh token.
   *
   * @returns True if authenticated, false otherwise.
   */
  async isSignedIn(): Promise<boolean> {
    return true;
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
  register(firstName: string, lastName: string, email: string, password: string): Observable<unknown> {
    if (email.includes('error')) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Unable to login before email has been verified.'
        }
      })).pipe(delay(1000));
    }
    return of().pipe(delay(1000));
  }

  /**
   * Attempts to validate an email address with the API.
   *
   * @param guid The identifier used to validate the email address.
   * @param email The email address to verify.
   * @returns An empty observable.
   */
  validateEmail(guid: string, email: string): Observable<unknown> {
    if (email.includes('error')) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    }
    return of().pipe(delay(1000));
  }

  /**
   * Attempts to send an email to the user to allow them to reset their password.
   *
   * @param email The email address associated with the user account.
   * @returns An empty observable.
   */
  sendPasswordResetEmail(email: string): Observable<unknown> {
    if (email.includes('error')) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    }
    return of().pipe(delay(1000));
  }

  /**
   * Attempts to reset the user's password.
   *
   * @param guid The identifier used to validate the password reset.
   * @param email The email address associated with the user.
   * @param password The new password to be set.
   * @returns An empty observable.
   */
  resetPassword(guid: string, email: string, password: string): Observable<unknown> {
    if (email.includes('error')) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    }
    return of().pipe(delay(1000));
  }
}