/* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AccessToken } from 'src/helpers';
import { SignInResponse, TokenResponse } from 'src/models';

import { UserService } from './user.service';

const testUser = {
  firstName: 'Samus',
  lastName: 'Aran',
  email: 'ycantmetroidcrawl@metroid.com',
  createdDate: new Date().toISOString(),
  groups: [],
  rithmId: 'kj34k3jkj',
  objectPermissions: []
};

describe('UserService', () => {
  let service: UserService;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });
    service = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully sign in', () => {
    const email = 'johndoe@email.com';
    const password = 'password1234';
    const expectedResponse: SignInResponse = {
      accessToken: 'kj343kh2o3ih23ih423',
      user: testUser
    };

    service.signIn('johndoe@email.com', 'password1234')
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(service.accessToken).toBeTruthy();
        expect(service.accessToken?.token).toEqual(expectedResponse.accessToken);
        expect(service.user).toEqual(expectedResponse.user);
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}/userservice/api/user/login`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ email, password });

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should clear memory on sign out', () => {
    service.accessToken = new AccessToken('jdkfjslkdjflks');
    service.user = testUser;
    service.signOut();
    expect(service.accessToken).toBeUndefined();
    expect(service.user).toBeUndefined();
  });

  it('should clear local storage on sign out', () => {
    localStorage.setItem('test', 'test');
    service.signOut();
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('should clear session storage on sign out', () => {
    sessionStorage.setItem('test', 'test');
    service.signOut();
    expect(sessionStorage.getItem('test')).toBeNull();
  });

  it('should clear cookies on sign out', () => {
    document.cookie = 'test=test';
    service.signOut();
    const cookies = document.cookie;
    expect(cookies).toBeFalsy();
  });

  it('should return to sign in page on sign out', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');
    service.signOut();
    expect(routerSpy).toHaveBeenCalledOnceWith('');
  });

  it('should user as signed in', async () => {
    service.accessToken = new AccessToken('token');
    expect(await service.isSignedIn()).toBeTrue();
  });

  xit('should report user as signed out if refresh token fails', () => {
    expect(service).toBeTruthy();
  });

  xit('should report user as signed out if token is expired after refresh', () => {
    expect(service).toBeTruthy();
  });

  it('should refresh expired access tokens', () => {
    const expectedResponse: TokenResponse = {
      accessToken: 'kj343kh2o3ih23ih423'
    };

    service.refreshToken()
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(service.accessToken).toBeTruthy();
        expect(service.accessToken?.token).toEqual(expectedResponse.accessToken);
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}/userservice/api/user/refreshtoken`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should register a user successfully', () => {
    const firstName = 'Luigi';
    const lastName = 'Mario';
    const email = 'lilbro@mariobros.com';
    const password = 'mamamia';

    service.register(firstName, lastName, email, password)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}/userservice/api/user/register`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ firstName, lastName, email, password });

    req.flush(null);
    httpTestingController.verify();
  });
});
