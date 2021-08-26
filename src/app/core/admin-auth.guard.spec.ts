/* eslint-disable max-len */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { MockPopupService, MockUserService } from 'src/mocks';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';

import { AdminAuthGuard } from './admin-auth.guard';
import { PopupService } from './popup.service';
import { UserService } from './user.service';

describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;
  let userSignedInSpy: jasmine.Spy;

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
    userSignedInSpy = spyOn(TestBed.inject(UserService), 'isSignedIn');
    guard.canActivate();
    expect(userSignedInSpy).toHaveBeenCalled();
  });

  it('should allow navigation to admin pages if the user is admin', () => {
    const user = { id: 3021, rithmId: '69B5A6C1-D380-40DD-BA6D-AABF86E98C4A', firstName: 'Admin', lastName: 'User', email: 'rithmadmin@inpivota.com', role: 'admin', createdDate: '2021-08-23T15:35:42.2234693', objectPermissions: [], globalPermission: null, isEmailVerified: true, notificationSettings: null, organizations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'] };
    localStorage.setItem('user', JSON.stringify(user));
    guard.canActivate().then((result) => {
      expect(result).toBeTrue();
    });
  });

  it('should prevent navigation to admin pages if the user is not admin', () => {
    const user = { id: 3021, rithmId: '69B5A6C1-D380-40DD-BA6D-CCBF86E98C4A', firstName: 'Worker', lastName: 'User', email: 'rithmadmin@inpivota.com', role: null, createdDate: '2021-08-23T15:35:42.2234693', objectPermissions: [], globalPermission: null, isEmailVerified: true, notificationSettings: null, organizations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'] };
    localStorage.setItem('user', JSON.stringify(user));
    guard.canActivate().then((result) => {
      expect(result).toBeFalse();
    });
  });

});