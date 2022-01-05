import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPopupService, MockUserService } from 'src/mocks';

import { AuthGuard } from './auth.guard';
import { PopupService } from './popup.service';
import { UserService } from './user.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let userSignedInSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        { provide: PopupService, useClass: MockPopupService },
        { provide: UserService, useClass: MockUserService },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should determine if the user is signed in and can perform the attempted routing action', () => {
    userSignedInSpy = spyOn(TestBed.inject(UserService), 'isSignedIn');
    guard.canActivate();
    expect(userSignedInSpy).toHaveBeenCalled();
  });

  xit('should navigate back to login if not signed in', () => {
    // TODO: Test navigation
  });

  xit('should display an alert if not signed in', () => {
    // TODO: Test display of alert
  });

  xit('should not allow navigation if not signed in', () => {
    // TODO: Test allowance of navigation
    //   expect(service.canActivate()).toBeFalse();
  });

  xit('should allow navigation if signed in', () => {
    // TODO: Test allowance of navigation
    //   expect(service.canActivate()).toBeFalse();
  });
});
