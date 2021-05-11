import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccessToken } from 'src/helpers';
import { SignInResponse, TokenResponse, User } from 'src/models';

const MICROSERVICE_PATH = '/userservice';

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
    private router: Router) {}

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
    // TODO: Update typing once API response is changed (227)
    // eslint-disable-next-line
    return this.http.post<{data: SignInResponse}>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/api/user/login`, {
      email,
      password
    }).pipe(
      map((response) => {
        this.accessToken = new AccessToken(response.data.accessToken);
        this.user = response.data.user;
        return response.data;
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
    // TODO: Update typing once API response is changed (227)
    // eslint-disable-next-line
    return this.http.get<{data: TokenResponse}>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/api/user/refreshtoken`)
    .pipe(
      map((tokenResponse) => {
        this.accessToken = new AccessToken(tokenResponse.data.accessToken);
        return tokenResponse.data;
      })
    );
  }

  validateEmail(guid: string, email: string): Observable<void> {
    // TODO: Update typing once API response is changed (227)
    // eslint-disable-next-line
    return this.http.post<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/api/user/validateemail`,
    {
      guid,
      email
    });
  }

}
