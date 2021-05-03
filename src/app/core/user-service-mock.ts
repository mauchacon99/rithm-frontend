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
    } else {
      return of({
        accessToken: 'wowowowo',
        user: undefined
      }).pipe(delay(1000));
    }

    return throwError(response).pipe(delay(1000));
  }
}
