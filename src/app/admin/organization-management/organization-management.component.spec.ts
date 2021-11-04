import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { MockErrorService, MockPopupService, MockUserService } from 'src/mocks';
import { MockOrganizationService } from 'src/mocks/mock-organization-service';
import { User } from 'src/models';

import { OrganizationManagementComponent } from './organization-management.component';

const TEST_USERS: User[] = [{
  rithmId: '1234',
  firstName: 'Testy',
  lastName: 'Test',
  email: 'test@test.com',
  isEmailVerified: true,
  notificationSettings: null,
  createdDate: '1/2/34',
  role: null,
  organization: 'kdjfkd-kjdkfjd-jkjdfkdjk'
},
{
  rithmId: '123',
  firstName: 'Testy',
  lastName: 'Test',
  email: 'test@test.com',
  isEmailVerified: true,
  notificationSettings: null,
  createdDate: '1/2/34',
  role: 'admin',
  organization: 'kdjfkd-kjdkfjd-jkjdfkdjk'
},
];

describe('OrganizationManagementComponent', () => {
  let component: OrganizationManagementComponent;
  let fixture: ComponentFixture<OrganizationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrganizationManagementComponent,
        MockComponent(LoadingIndicatorComponent),
        MockComponent(PaginationComponent)
      ],
      imports: [
        MatCardModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: OrganizationService, useClass: MockOrganizationService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get an array of users', fakeAsync(() => {
    component.getUsers(1);
    tick(1000);
    expect(component.users.length).toEqual(3);
  }));

  it('should make a userService call to remove a user', async () => {
    const removeUserSpy = spyOn(TestBed.inject(OrganizationService), 'removeUserFromOrganization').and.callThrough();
    await component.removeUser(TEST_USERS[0]);
    expect(removeUserSpy).toHaveBeenCalledOnceWith(TEST_USERS[0].organization, TEST_USERS[0].rithmId);
  });

  it('should not make a userService call when id is same as current user', async () => {
    const removeUserSpy = spyOn(TestBed.inject(OrganizationService), 'removeUserFromOrganization').and.callThrough();
    await component.removeUser(TEST_USERS[1]);
    expect(removeUserSpy).toHaveBeenCalledTimes(0);
  });

  it('should get users of current page', () => {
    expect(component.users).toBeGreaterThanOrEqual(0);
  });

  it('should get total number of users of an organization', () => {
    expect(component.totalNumUsers).toBeGreaterThanOrEqual(0);
  });

  it('should show organization name input when edit button is clicked', () => {
    component.editName = false;
    component.editOrgName();
    expect(component.editName).toBe(true);
  });

  it('should show organization name label when changes are cancelled', () => {
    component.editName = true;
    component.editOrgName();
    expect(component.editName).toBe(false);
  });

  it('should get organization information', () => {
    const organizationSpy = spyOn(TestBed.inject(OrganizationService), 'getOrganizationInfo').and.callThrough();
    component.getOrganizationInfo();
    const organizationId = 'kdjfkd-kjdkfjd-jkjdfkdjk';
    expect(organizationSpy).toHaveBeenCalledOnceWith(organizationId);
  });

  it('should promote user to admin role.', async () => {
    const adminSpy = spyOn(TestBed.inject(OrganizationService), 'updateUserRole').and.callThrough();
    await component.updateUserRole(TEST_USERS[0], TEST_USERS[0].rithmId, 1);
    expect(adminSpy).toHaveBeenCalledOnceWith('admin', TEST_USERS[0].organization, TEST_USERS[0].rithmId);
  });

  it('should demote user from admin role.', async () => {
    const adminSpy = spyOn(TestBed.inject(OrganizationService), 'updateUserRole').and.callThrough();
    await component.updateUserRole(TEST_USERS[1], TEST_USERS[1].rithmId, 1);
    expect(adminSpy).toHaveBeenCalledOnceWith(null, TEST_USERS[1].organization, TEST_USERS[1].rithmId);
  });

});
