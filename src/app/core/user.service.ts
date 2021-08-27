import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccessToken } from 'src/helpers';
import { SignInResponse, TokenResponse, User, UserAccountInfo } from 'src/models';

const MICROSERVICE_PATH = '/userservice/api/user';

/**
 * Service for all interactions involving a user.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /** The access token to be used to authenticate for every request. */
  accessToken: AccessToken | undefined;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }

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
   * Signs the user in to the system.
   *
   * @param email The email address for the user.
   * @param password The entered password for the user.
   * @returns The user and access/refresh tokens.
   */
  signIn(email: string, password: string): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/login`, {
      email,
      password
    }, { withCredentials: true }).pipe(
      map((response) => {
        this.accessToken = new AccessToken(response.accessToken);
        localStorage.setItem('refreshTokenGuid', response.refreshTokenGuid);
        localStorage.setItem('user', JSON.stringify(response.user));
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
    await this.refreshToken().toPromise()
      .catch(() => false);

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
      return throwError('Unable to refresh token without GUID');
    }

    const params = new HttpParams().set('refreshTokenGuid', refreshTokenGuid);

    return this.http.get<TokenResponse>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/refreshtoken`,
      { withCredentials: true, params }).pipe(
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
  register(firstName: string, lastName: string, email: string, password: string): Observable<unknown> {
    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/register`, {
      firstName,
      lastName,
      email,
      password
    });
  }

  /**
   * Deletes a given user in the system.
   *
   * @param email The user's email address.
   * @returns An empty observable.
   */
  delete(email: string): Observable<unknown> {
    return this.http.delete<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/delete`, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/quotes
        "Content-Type": "application/json"
      },
      body: { email }
    });
  }

  /**
   * Attempts to validate an email address with the API.
   *
   * @param guid The identifier used to validate the email address.
   * @param email The email address to verify.
   * @returns An empty observable.
   */
  validateEmail(guid: string, email: string): Observable<unknown> {
    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/validateemail`,
      {
        guid,
        email
      });
  }

  /**
   * Attempts to send an email to the user to allow them to reset their password.
   *
   * @param email The email address associated with the user account.
   * @returns An empty observable.
   */
  sendPasswordResetEmail(email: string): Observable<unknown> {
    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/forgotpassword`,
      { email });
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
    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/resetpassword`,
      {
        guid,
        email,
        password
      });
  }

  /**
   * Attempts to update user account settings.
   *
   * @param accountInfo The new account settings to be updated.
   * @returns An empty observable.
   */
  updateUserAccount(accountInfo: UserAccountInfo): Observable<unknown> {
    const changedAccountInfo = this.getChangedAccountInfo(accountInfo);
    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/update`, changedAccountInfo)
      .pipe(map(() => {
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
      }));
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
    return this.http.request('GET', `${environment.baseApiUrl}${MICROSERVICE_PATH}/gettermsandconditions`, { responseType: 'text' });
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
   * Gets a List of users belongs to an organization.
   *
   * @param organizationId The id of the organization.
   * @param pageNum The desired page number of result.
   * @returns An Users list observable.
   */
   getUsersForOrganization(organizationId: string, pageNum: number): Observable<User[]> {
    const params = new HttpParams()
      .set('rithmid', organizationId)
      .set('pageNum', pageNum)
      .set('usersPerPage', 10);
    return this.http.get<User[]>(`${environment.baseApiUrl}/userservice/api/Organization/GetUsersForOrganization`, { params });
  }

  /**
   * Removes a user from the roster of an organization.
   *
   * @param userRithmId The Rithm Id of the user being removed.
   * @returns An empty observable.
   */
  removeUserFromOrganization(userRithmId: string): Observable<unknown> {
    return this.http.delete<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/removeusersfromorganizations`, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/quotes
        "Content-Type": "application/json"
      },
      body: { userRithmId }
    });
  }

}
