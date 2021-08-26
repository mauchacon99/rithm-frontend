import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPopupService, MockUserService } from 'src/mocks';

import { AdminAuthGuard } from './admin-auth.guard';
import { PopupService } from './popup.service';
import { UserService } from './user.service';

describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;
  let userSignedInSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: PopupService, useClass: MockPopupService },
        { provide: UserService, useClass: MockUserService }
      ]
    });
    guard = TestBed.inject(AdminAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should determine if the user is signed in and can perform the attempted routing action', () => {
    userSignedInSpy = spyOn(TestBed.inject(UserService), 'isSignedIn');
    guard.canActivate();
    expect(userSignedInSpy).toHaveBeenCalled();
  });

});
