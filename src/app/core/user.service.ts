import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  firstValueFrom,
  Observable,
  of,
  ReplaySubject,
  throwError,
} from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccessToken } from 'src/helpers';
import {
  SignInResponse,
  TokenResponse,
  User,
  UserAccountInfo,
  StationInformation,
  ImageData,
} from 'src/models';

const MICROSERVICE_PATH = '/userservice/api/user';

/**
 * Service for all interactions involving a user.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** The access token to be used to authenticate for every request. */
  accessToken: AccessToken | undefined;

  /** Data of signed-in user. */
  userData$: ReplaySubject<User> = new ReplaySubject(1);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  /**
   * The currently signed in user.
   *
   * @returns The currently signed in user.
   */
  get user(): User {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  /**
   * Checking if the current user is an admin.
   *
   * @returns The true or false if user is admin or not.
   */
  get isAdmin(): boolean {
    return this.user.role === 'admin';
  }

  /**
   * Signs the user in to the system.
   *
   * @param email The email address for the user.
   * @param password The entered password for the user.
   * @returns The user and access/refresh tokens.
   */
  signIn(email: string, password: string): Observable<SignInResponse> {
    return this.http
      .post<SignInResponse>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        map((response) => {
          this.accessToken = new AccessToken(response.accessToken);
          localStorage.setItem('refreshTokenGuid', response.refreshTokenGuid);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userData$.next(response.user);
          return response;
        })
      );
  }

  /**
   * Signs the user out of the system and clears stored data.
   */
  signOut(): void {
    this.accessToken = undefined;
    this.cookieService.deleteAll();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  /**
   * Checks if the user is signed in and attempts to get a new refresh token.
   *
   * @returns True if authenticated, false otherwise.
   */
  async isSignedIn(): Promise<boolean> {
    if (this.accessToken && !this.accessToken.isExpired()) {
      return true;
    }

    // Attempt to refresh the token
    await firstValueFrom(this.refreshToken()).catch(() => false);

    // Check if token is good
    if (this.accessToken && !this.accessToken.isExpired()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets a new access token from the API.
   *
   * @returns The new access token.
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshTokenGuid = localStorage.getItem('refreshTokenGuid');

    if (!refreshTokenGuid) {
      this.signOut();
      return throwError(() => 'Unable to refresh token without GUID');
    }

    const params = new HttpParams().set('refreshTokenGuid', refreshTokenGuid);

    return this.http
      .get<TokenResponse>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/refresh-token`,
        { withCredentials: true, params }
      )
      .pipe(
        map((tokenResponse) => {
          this.accessToken = new AccessToken(tokenResponse.accessToken);
          return tokenResponse;
        })
      );
  }

  /**
   * Registers a new user in the system (pending email verification).
   *
   * @param firstName The new user's first name.
   * @param lastName The new user's last name.
   * @param email The new user's email address.
   * @param password The password set for the new user.
   * @returns An empty observable.
   */
  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<unknown> {
    return this.http.post<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/register`,
      {
        firstName,
        lastName,
        email,
        password,
      }
    );
  }

  /**
   * Deletes a given user in the system.
   *
   * @param email The user's email address.
   * @returns An empty observable.
   */
  delete(email: string): Observable<unknown> {
    return this.http.delete<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/delete`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: { email },
      }
    );
  }

  /**
   * Attempts to validate an email address with the API.
   *
   * @param guid The identifier used to validate the email address.
   * @param email The email address to verify.
   * @returns An empty observable.
   */
  validateEmail(guid: string, email: string): Observable<unknown> {
    return this.http.post<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/validate-email`,
      {
        guid,
        email,
      }
    );
  }

  /**
   * Attempts to send an email to the user to allow them to reset their password.
   *
   * @param email The email address associated with the user account.
   * @returns An empty observable.
   */
  sendPasswordResetEmail(email: string): Observable<unknown> {
    return this.http.post<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/forgot-password`,
      { email }
    );
  }

  /**
   * Attempts to reset the user's password.
   *
   * @param guid The identifier used to validate the password reset.
   * @param email The email address associated with the user.
   * @param password The new password to be set.
   * @returns An empty observable.
   */
  resetPassword(
    guid: string,
    email: string,
    password: string
  ): Observable<unknown> {
    return this.http.post<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/reset-password`,
      {
        guid,
        email,
        password,
      }
    );
  }

  /**
   * Attempts to update user account settings.
   *
   * @param accountInfo The new account settings to be updated.
   * @returns An empty observable.
   */
  updateUserAccount(accountInfo: UserAccountInfo): Observable<unknown> {
    const changedAccountInfo = this.getChangedAccountInfo(accountInfo);
    return this.http
      .post<void>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/update`,
        changedAccountInfo
      )
      .pipe(
        map(() => {
          const user = this.user;
          if (!this.user) {
            throw new Error('There is no existing user to update');
          }
          if (changedAccountInfo.firstName) {
            user.firstName = changedAccountInfo.firstName;
          }
          if (changedAccountInfo.lastName) {
            user.lastName = changedAccountInfo.lastName;
          }
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  /**
   * Returns user account info with only the changed fields.
   *
   * @param accountInfo The original account info with all fields present.
   * @returns The filtered account info with only changed fields.
   */
  private getChangedAccountInfo(accountInfo: UserAccountInfo): UserAccountInfo {
    const changedAccountInfo: UserAccountInfo = {};

    if (accountInfo.firstName !== this.user?.firstName) {
      changedAccountInfo.firstName = accountInfo.firstName;
    }

    if (accountInfo.lastName !== this.user?.lastName) {
      changedAccountInfo.lastName = accountInfo.lastName;
    }

    if (accountInfo.password) {
      changedAccountInfo.password = accountInfo.password;
    }

    return changedAccountInfo;
  }

  /**
   * Gets terms and conditions.
   *
   * @returns A terms and conditions observable.
   */
  getTermsConditions(): Observable<string> {
    return this.http.request(
      'GET',
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/terms-and-conditions`,
      { responseType: 'text' }
    );
  }

  /**
   * Sets user data to an observable.
   */
  setUserData(): void {
    const user = localStorage.getItem('user');
    this.userData$.next(JSON.parse(<string>user));
  }

  /**
   * Checks to see if signed in user is an owner of the station.
   *
   * @param stationInformation The station used to check if user is an admin.
   * @returns A boolean determining if the current user is an owner of the station.
   */
  isStationOwner(stationInformation: StationInformation): boolean {
    return !!stationInformation.stationOwners.find(
      (owner) => owner.rithmId === this.user.rithmId
    );
  }

  /**
   * Checked to see if signed in user is a worker.
   *
   * @param stationInformation The station used to check if user is a worker.
   * @returns A boolean determining if the current user is a worker on the station.
   */
  isWorker(stationInformation: StationInformation): boolean {
    return !!stationInformation.workers.find(
      (worker) => worker.rithmId === this.user.rithmId
    );
  }

  /**
   * Upload image to user.
   *
   * @param file File to upload.
   * @returns Id of image uploaded.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadImageUser(file: File): Observable<string> {
    const expectedResponse = 'ewf34tf-3ge343-g34g3e';
    return of(expectedResponse).pipe(delay(1000));
  }

  // TODO: Re-enable when addressing notification settings
  /**
   * Attempts to reset notification settings.
   *
   * @param notificationSettings The user notification settings object.
   * @returns An empty observable.
   */
  // updateNotificationSettings(notificationSettings: NotificationSettings): Observable<unknown> {
  //   return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/notifications`,
  //     notificationSettings);
  // }

  /**
   * Get Image user.
   *
   * @param imageRithmId Image Rithm Id.
   * @returns Image Data.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getImageUser(imageRithmId: string): Observable<ImageData> {
    const image: ImageData = {
      imageData:
        // eslint-disable-next-line max-len
        'data:image/png;base64,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',
      imageName: 'Image Name',
    };
    return of(image).pipe(delay(1000));
  }
}
