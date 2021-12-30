import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AccessToken } from 'src/helpers';
import { NotificationSettings, SignInResponse, TokenResponse, User, UserAccountInfo, StationInformation } from 'src/models';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocks methods of the `UserService`.
 */
export class MockUserService {

  /** The access token to be used to authenticate for every request. */
  accessToken = new AccessToken('tokentokentokentokentoken');

  /** The currently signed in user. */
  user: User = {
    rithmId: '123',
    firstName: 'Testy',
    lastName: 'Test',
    email: 'test@test.com',
    isEmailVerified: true,
    notificationSettings: null,
    createdDate: '1/2/34',
    role: null,
    organization: 'kdjfkd-kjdkfjd-jkjdfkdjk'
  };

  /**
   * Signs the user in to the system.
   *
   * @param email The email address for the user.
   * @param password The entered password for the user.
   * @returns The user and access/refresh tokens.
   */
  signIn(email: string, password: string): Observable<SignInResponse> {
    let response: HttpErrorResponse;

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
        user: this.user
      }).pipe(delay(1000));
    }

    return throwError(() => response).pipe(delay(1000));
  }

  /**
   * Signs the user out of the system and clears stored data.
   */
  signOut(): void {
    return;
  }

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
      return throwError(() => new HttpErrorResponse({
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
      return throwError(() => new HttpErrorResponse({
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
      return throwError(() => new HttpErrorResponse({
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
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    }
    return of().pipe(delay(1000));
  }

  /**
   * Attempts to update user account settings.
   *
   * @param accountInfo The user account settings object.
   * @returns An empty observable.
   */
  updateUserAccount(accountInfo: UserAccountInfo): Observable<unknown> {
    if (!accountInfo) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    }
    return of().pipe(delay(1000));
  }

  /**
   * Gets terms and conditions.
   *
   * @returns An terms and conditions observable.
   */
  getTermsConditions(): Observable<string> {
    const data = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur non ipsum a porta.
    Aenean condimentum sem id lobortis ornare.Fusce venenatis efficitur pulvinar. Vivamus dignissim erat odio,
    ac interdum mi viverra nec. Nunc rutrum dolor a augue convallis, ac iaculis mauris dapibus.\n\nFusce non est libero. Fusce porttitor
    ex id convallis facilisis. Pellentesque sit amet eleifend quam, eget pharetra ipsum. Proin id mattis sem. In vitae sem massa.\n\n
    In hac habitasse platea dictumst. Nunc ut dui leo. Phasellus semper est vel ultricies tempus.  Proin ac lectus risus. Duis vestibulum
    libero velit, ac consequat urna feugiat sit amet. Vestibulum et purus elit. Donec eu nunc lobortis, consectetur ipsum et, mollis
    dui. Mauris tempus, est at posuere mollis, nunc turpis vestibulum velit, sit amet rutrum tortor velit a augue.\n\nSed dignissim,
    turpis ac maximus facilisis, purus risus posuere metus, ut eleifend tellus nisi pretium est. Fusce ut diam hendrerit, pretium
    eros a, lacinia orci. Nunc justo velit, consequat dapibus justo in, elementum mattis massa.\n\nNunc id malesuada leo.
    Praesent in faucibus ante, eget dignissim ipsum. Etiam egestas ex tortor, nec consectetur nibh pharetra et. Aenean
    gravida magna libero, nec tincidunt libero malesuada eu. Vivamus faucibus lobortis faucibus. Sed in tellus eget dui tincidunt
    lobortis. Sed magna turpis, vestibulum nec malesuada dapibus, aliquam ut magna. Cras sagittis mi quis vulputate efficitur.
    Nunc tempus nibh sed sollicitudin aliquet. Vestibulum nec diam lorem.  Pellentesque habitant morbi tristique senectus et netus
    et malesuada fames ac turpis egestas. Sed dignissim magna in nibh consequat iaculis. Sed interdum pharetra consequat. Sed
    dolor leo, tincidunt eu sollicitudin at, commodo ac odio. Aliquam aliquam imperdiet metus a hendrerit. Integer ornare ut
    ipsum nec dictum. Vivamus id fringilla leo. Ut nisl augue, eleifend nec condimentum tempus, faucibus quis augue.\n\n
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla ornare sapien quam,
    ut pulvinar purus tempus ut. Curabitur vehicula lacus in lacinia cursus. Quisque dictum est sed risus malesuada pellentesque.
    Vestibulum vehicula gravida erat eu elementum. Cras egestas sed nisl ut vulputate. Nulla in suscipit justo.  Pellentesque a magna
    tincidunt, ultricies felis vel, venenatis sem. Vestibulum et sodales tortor. Donec suscipit nec diam in sagittis. Proin hendrerit,
    libero et semper aliquet, mi velit varius dolor, a venenatis lacus leo eget risus. Vestibulum congue volutpat auctor.
    Maecenas faucibus ipsum ac velit porta, vitae condimentum est venenatis. Proin dapibus suscipit elit in tincidunt. Morbi
    lorem augue, dignissim eget malesuada vitae, dictum sollicitudin augue. Curabitur cursus scelerisque pellentesque.
    Aenean sit amet enim magna. Suspendisse ut tristique nunc, a luctus nisi. Nullam id mauris id quam faucibus facilisis.`;
    return of(data).pipe(delay(1000));
  }

  /**
   * Attempts to reset notification settings.
   *
   * @param notificationSettings The user notification settings object.
   * @returns An empty observable.
   */
  updateNotificationSettings(notificationSettings: NotificationSettings): Observable<unknown> {
    if (!notificationSettings) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    }
    return of().pipe(delay(1000));
  }

  /**
   * Checks to see if signed in user is an owner of the station.
   *
   * @param stationInformation The station used to check if user is an admin.
   * @returns A boolean determining if the current user is an owner of the station.
   */
  isStationOwner(stationInformation: StationInformation): boolean {
    return !!stationInformation.stationOwners.find((owner)=> owner.rithmId === this.user.rithmId);
  }

  /**
   * Checked to see if signed in user is a worker.
   *
   * @param stationInformation The station used to check if user is a worker.
   * @returns A boolean determining if the current user is a worker on the station.
   */
  isWorker(stationInformation: StationInformation):boolean {
    return !!stationInformation.workers.find((worker)=> worker.rithmId === this.user.rithmId);
  }

  /**
   * Checking if the current user is an admin.
   *
   * @returns The true or false if user is admin or not.
   */
  get isAdmin(): boolean {
    return this.user.role === 'admin';
  }

}
