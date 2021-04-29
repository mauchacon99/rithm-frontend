import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let router: Router;
  // let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule
      ]
    });
    service = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    // httpMock = TestBed.inject(HttpTestingController);
  });

  // afterEach(() => {
  //   httpMock.verify();
  // });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should successfully sign in', () => {
  //   const mockSignInResponse: SignInResponse = {
  //     user: {
  //       rithmId: '5f5ef6ag6er5gs',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'johndoe@email.com',
  //       objectPermissions: [],
  //       groups: [],
  //       createdDate: '2021-04-28T19:52:13.530Z'

  //     },
  //     accessToken: 'wowthisisareallylongtokenthattotallyworks'
  //   };

  //   service.signIn('johndoe@email.com', 'password1234')
  //     .pipe(first())
  //     .subscribe((response) => {
  //       expect(response).toEqual(mockSignInResponse);
  //     });

  //   const req = httpMock.expectOne(`${environment.baseApiUrl}/userservice/api/user/login`);
  //   expect(req.request.method).toEqual('POST');

  //   req.flush(mockSignInResponse);
  // });

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

  // it('should report sign in status', () => {
  //   expect(service).toBeTruthy();
  // });

  // it('should refresh expired access tokens', () => {
  //   expect(service).toBeTruthy();
  // });
});
