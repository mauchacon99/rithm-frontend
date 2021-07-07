import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccessToken } from 'src/helpers';
import { NotificationSettings, SignInResponse, TokenResponse, User, UserAccountInfo } from 'src/models';

const MICROSERVICE_PATH = '/userservice/api/user';

/**
 * Service for all interactions involving a user.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router) {
    this.user = JSON.parse(localStorage.getItem('user') as string) as User;
  }

  /** The access token to be used to authenticate for every request. */
  accessToken: AccessToken | undefined;

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
    return this.http.post<SignInResponse>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/login`, {
      email,
      password
    }, { withCredentials: true }).pipe(
      map((response) => {
        this.accessToken = new AccessToken(response.accessToken);
        console.log(this.accessToken);
        this.user = response.user;
        localStorage.setItem('refreshTokenGuid', response.refreshTokenGuid);
        localStorage.setItem('user', JSON.stringify(this.user));
        return response;
      })
    );
  }

  /**
   * Signs the user out of the system and clears stored data.
   */
  signOut(): void {
    this.accessToken = undefined;
    this.user = undefined;
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
      body:{email}
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
   * @param changedAccountInfo The user account settings object.
   * @returns An empty observable.
   */
  updateUserAccount(changedAccountInfo: UserAccountInfo): Observable<unknown> {
    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/update`,
      changedAccountInfo);
  }

  /**
   * Gets terms and conditions.
   *
   * @returns A terms and conditions observable.
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
    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/notifications`,
      notificationSettings);
  }

}
