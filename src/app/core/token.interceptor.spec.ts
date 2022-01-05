import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TokenInterceptor } from './token.interceptor';
import { MockPopupService } from 'src/mocks';
import { PopupService } from './popup.service';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AccessToken } from 'src/helpers';

const USER_SERVICE_PATH = '/userservice/api/user';

describe('TokenInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        TokenInterceptor,
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: PopupService, useClass: MockPopupService },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    const interceptor: TokenInterceptor = TestBed.inject(TokenInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add a token on auth-required routes', fakeAsync(() => {
    const token = 'j3434k-j3k4j3k-jk34jk3';
    userService.accessToken = new AccessToken(token); // Ensure user is signed in
    userService.updateUserAccount({}).subscribe();

    tick(1000);

    const httpRequest = httpTestingController.expectOne(
      `${environment.baseApiUrl}${USER_SERVICE_PATH}/update`
    );
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual(
      `Bearer ${token}`
    );
    httpTestingController.verify();
  }));

  it('should pass the request on regular routes', () => {
    userService.getTermsConditions().subscribe();

    const httpRequest = httpTestingController.expectOne(
      `${environment.baseApiUrl}${USER_SERVICE_PATH}/terms-and-conditions`
    );
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });

  it('should sign the user out if an auth-required request is made when the user is not signed in', () => {
    userService.signOut(); // Ensure that the user is actually signed out before test
    const signOutSpy = spyOn(userService, 'signOut');

    userService.updateUserAccount({}).subscribe();

    httpTestingController.expectNone(
      `${environment.baseApiUrl}${USER_SERVICE_PATH}/update`
    );
    httpTestingController.verify();
    expect(signOutSpy).toHaveBeenCalledTimes(1);
  });
});
