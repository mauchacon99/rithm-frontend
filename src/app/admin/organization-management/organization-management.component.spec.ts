import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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
        MatCardModule
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

  it('', () => {
    expect(component.removeUser('1234')).toBeFalsy();
  });

  it('should make a organizationService call to remove a user', () => {
    removeUserSpy = spyOn(TestBed.inject(OrganizationService), 'removeUserFromOrganization').and.callThrough();
    component.removeUser('1234');
    expect(removeUserSpy).toHaveBeenCalled();
  });

  it('should not make a organizationService call when id is same as current user', () => {
    removeUserSpy = spyOn(TestBed.inject(OrganizationService), 'removeUserFromOrganization').and.callThrough();
    component.removeUser('123');
    expect(removeUserSpy).toHaveBeenCalledTimes(0);
  });

  it('should get users of current page', () => {
    expect(component.users).toBeGreaterThanOrEqual(0);
  });

  it('should get total number of users of an organization', () => {
    expect(component.totalNumUsers).toBeGreaterThanOrEqual(0);
  });

});
