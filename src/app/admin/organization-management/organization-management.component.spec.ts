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

import { OrganizationManagementComponent } from './organization-management.component';

const TEST_USERS = [{
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
  role: null,
  organization: 'kdjfkd-kjdkfjd-jkjdfkdjk'
},
];

describe('OrganizationManagementComponent', () => {
  let component: OrganizationManagementComponent;
  let fixture: ComponentFixture<OrganizationManagementComponent>;
  let removeUserSpy: jasmine.Spy;

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
    removeUserSpy = spyOn(TestBed.inject(OrganizationService), 'removeUserFromOrganization').and.callThrough();
    await component.removeUser(TEST_USERS[0]);
    expect(removeUserSpy).toHaveBeenCalled();
  });

  it('should not make a userService call when id is same as current user', async () => {
    removeUserSpy = spyOn(TestBed.inject(OrganizationService), 'removeUserFromOrganization').and.callThrough();
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

});
