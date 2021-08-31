import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { MockErrorService, MockPopupService, MockUserService } from 'src/mocks';

import { OrganizationManagementComponent } from './organization-management.component';

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
        MatCardModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService }
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

  it('should return undefined when making a request to remove a user', () => {
    expect(component.removeUser('1234')).toBeFalsy();
  });
});
