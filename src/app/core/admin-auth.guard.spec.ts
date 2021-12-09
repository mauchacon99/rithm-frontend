import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { MockPopupService, MockUserService } from 'src/mocks';
import { User } from 'src/models';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';

import { AdminAuthGuard } from './admin-auth.guard';
import { PopupService } from './popup.service';
import { UserService } from './user.service';

const user: User = {
  rithmId: '69B5A6C1-D380-40DD-BA6D-AABF86E98C4A',
  firstName: 'Admin',
  lastName: 'User',
  email: 'rithmadmin@inpivota.com',
  role: 'admin',
  createdDate: '2021-08-23T15:35:42.2234693',
  isEmailVerified: true,
  notificationSettings: null,
  organization: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989'
};


describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes(
          [{ path: 'dashboard', component: MockComponent(DashboardComponent) }]
        )
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
    const userSignedInSpy = spyOn(TestBed.inject(UserService), 'isSignedIn');
    guard.canActivate();
    expect(userSignedInSpy).toHaveBeenCalledTimes(1);
  });

  it('should allow navigation to admin pages if the user is admin', () => {
    localStorage.setItem('user', JSON.stringify(user));
    guard.canActivate().then((result) => {
      expect(result).toBeTrue();
    });
  });

  it('should prevent navigation to admin pages if the user is not admin', () => {
    localStorage.setItem('user', JSON.stringify(user));
    guard.canActivate().then((result) => {
      expect(result).toBeFalse();
    });
  });

});
