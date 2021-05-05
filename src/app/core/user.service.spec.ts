/* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { SignInResponse } from 'src/models';

import { UserService } from './user.service';

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
      user: {
        firstName: 'Samus',
        lastName: 'Aran',
        email: 'ycantmetroidcrawl@metroid.com',
        createdDate: new Date().toISOString(),
        groups: [],
        rithmId: 'kj34k3jkj',
        objectPermissions: []
      }
    };

    service.signIn('johndoe@email.com', 'password1234')
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(service.accessToken?.token).toEqual(expectedResponse.accessToken);
        expect(service.user).toEqual(expectedResponse.user);
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}/userservice/api/user/login`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ email, password });

    req.flush({ data: expectedResponse });
    httpTestingController.verify();
  });

  it('should clear local storage on sign out', () => {
    localStorage.setItem('test', 'test');
    service.signOut();
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('should clear local storage on sign out', () => {
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

  xit('should report sign in status', () => {
    // TODO: write test for sign in status
    expect(service).toBeTruthy();
  });

  xit('should refresh expired access tokens', () => {
    // TODO: write test for refresh expired token
    expect(service).toBeTruthy();
  });
});
