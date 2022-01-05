import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AccessToken } from 'src/helpers';
import {
  SignInResponse,
  TokenResponse,
  User,
  UserAccountInfo,
} from 'src/models';

import { UserService } from './user.service';

const MICROSERVICE_PATH = '/userservice/api/user';

const testUser: User = {
  firstName: 'Samus',
  lastName: 'Aran',
  email: 'ycantmetroidcrawl@metroid.com',
  isEmailVerified: true,
  createdDate: new Date().toISOString(),
  rithmId: 'kj34k3jkj',
  notificationSettings: null,
  role: null,
  organization: '',
};

describe('UserService', () => {
  let service: UserService;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
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
      refreshTokenGuid: 'ab5d4-ae56g',
      user: testUser,
    };

    service
      .signIn('johndoe@email.com', 'password1234')
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(service.accessToken).toBeTruthy();
        expect(service.accessToken?.token).toEqual(
          expectedResponse.accessToken
        );
        expect(service.user).toEqual(expectedResponse.user);
      });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/login`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ email, password });

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should clear memory on sign out', () => {
    service.accessToken = new AccessToken('jdkfjslkdjflks');
    localStorage.setItem('user', JSON.stringify(testUser));
    service.signOut();
    expect(service.accessToken).toBeUndefined();
    expect(service.user).toBeNull();
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

  it('should report user as signed in', async () => {
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
      accessToken: 'kj343kh2o3ih23ih423',
    };

    localStorage.setItem('refreshTokenGuid', 'thisisaguid');

    service.refreshToken().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
      expect(service.accessToken).toBeTruthy();
      expect(service.accessToken?.token).toEqual(expectedResponse.accessToken);
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/refresh-token?refreshTokenGuid=thisisaguid`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();
    expect(req.request.params).toBeTruthy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should sign the user out if refresh token GUID is missing', () => {
    const signOutSpy = spyOn(service, 'signOut');
    localStorage.clear();
    service.refreshToken();
    expect(signOutSpy).toHaveBeenCalledOnceWith();
  });

  it('should register a user successfully', () => {
    const firstName = 'Luigi';
    const lastName = 'Mario';
    const email = 'lilbro@mariobros.com';
    const password = 'mamamia';

    service
      .register(firstName, lastName, email, password)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/register`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ firstName, lastName, email, password });

    req.flush(null);
    httpTestingController.verify();
  });

  it('should validate an email successfully', () => {
    const guid = 'kdjfkd-kjdkfjd-jkjdfkdjk';
    const email = 'test@email.com';

    service.validateEmail(guid, email).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/validate-email`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ guid, email });

    req.flush(null);
    httpTestingController.verify();
  });

  it('should make request to send password reset email successfully', () => {
    const email = 'test@email.com';

    service.sendPasswordResetEmail(email).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/forgot-password`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ email });

    req.flush(null);
    httpTestingController.verify();
  });

  it('should reset password successfully', () => {
    const guid = 'kdjfkd-kjdkfjd-jkjdfkdjk';
    const email = 'test@email.com';
    const password = 'mamamia';

    service.resetPassword(guid, email, password).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/reset-password`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ guid, email, password });

    req.flush(null);
    httpTestingController.verify();
  });

  it('should return terms and conditions', () => {
    service.getTermsConditions().subscribe((response) => {
      expect(response).toBeDefined();
    });
  });

  it('should update user account settings', () => {
    localStorage.setItem('user', JSON.stringify(testUser));
    const changedAccountInfo: UserAccountInfo = {
      firstName: 'James',
      lastName: 'Anderson',
      password: 'mamamia',
    };

    service.updateUserAccount(changedAccountInfo).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/update`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(changedAccountInfo);

    req.flush(null);
    httpTestingController.verify();
  });

  // TODO: re-enable when addressing notification settings
  xit('should update notification settings', () => {
    // const notificationSettings: NotificationSettings = {
    //   comments: true,
    //   commentMentions: false
    // };
    // service.updateNotificationSettings(notificationSettings)
    //   .subscribe((response) => {
    //     expect(response).toBeFalsy();
    //   });
    // // outgoing request
    // const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/notifications`);
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body).toEqual(notificationSettings);
    // req.flush(null);
    // httpTestingController.verify();
  });

  it('should return terms and conditions text', () => {
    const termsAndConditions = 'This isTerms and conditions text';

    service.getTermsConditions().subscribe((response) => {
      expect(response).toBeDefined();
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/terms-and-conditions`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(termsAndConditions);
    httpTestingController.verify();
  });
});
