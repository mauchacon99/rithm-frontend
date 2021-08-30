import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MockErrorService, MockPopupService, MockUserService } from 'src/mocks';

import { OrganizationManagementComponent } from './organization-management.component';

describe('OrganizationManagementComponent', () => {
  let component: OrganizationManagementComponent;
  let fixture: ComponentFixture<OrganizationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrganizationManagementComponent,
        MockComponent(LoadingIndicatorComponent)
      ],
      imports: [
        MatCardModule,
        SharedModule
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

  it('should get an array of users', () => {
    component.getUsers(1);
    console.log(component.getUsers(1));
    expect(component.users.length).toEqual(3);
  });
});
