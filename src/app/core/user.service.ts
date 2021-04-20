import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccessToken } from 'src/helpers';

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

  /**
   * Signs the user in to the system.
   *
   * @param email The email address for the user.
   * @param password The entered password for the user.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signIn(email: string, password: string): void {
    // RIT-144
  }

  /**
   * Signs the user out of the system and clears stored data.
   */
  signOut(): void {
    this.cookieService.deleteAll();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  /**
   * Checks if the user is currently signed in.
   *
   * @returns True if currently authenticated, false otherwise.
   */
  isSignedIn(): boolean {
    return this.accessToken ? true : false;
  }

  /**
   * Gets a new access token from the API.
   *
   * @returns The new access token.
   */
  refreshToken(): Observable<AccessToken> {
    return this.http.post<AccessToken>(`${environment.baseApiUrl}/api/user/refreshtoken`, {});
  }

}
