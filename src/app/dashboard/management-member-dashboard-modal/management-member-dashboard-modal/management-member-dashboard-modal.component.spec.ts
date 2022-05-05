import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { RoleDashboardMenu, User } from 'src/models';
import { MemberDashboardListModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/member-dashboard-list-modal/member-dashboard-list-modal.component';

import { ManagementMemberDashboardModalComponent } from './management-member-dashboard-modal.component';
import { MockDashboardService, MockErrorService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ErrorService } from 'src/app/core/error.service';
import { throwError } from 'rxjs';

describe('ManagementMemberDashboardModalComponent', () => {
  let component: ManagementMemberDashboardModalComponent;
  let fixture: ComponentFixture<ManagementMemberDashboardModalComponent>;
  let dashboardService: DashboardService;

  const DIALOG_TEST_DATA: {
    /** Selected dashboardRithmId. */
    dashboardRithmId: string;
    /** Selected dashboardType. */
    dashboardType: string;
  } = {
    dashboardRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
    dashboardType: RoleDashboardMenu.Company,
  };

  const TEST_USERS: User[] = [
    {
      rithmId: '1234',
      firstName: 'Testy',
      lastName: 'Test',
      email: 'test@test.com',
      isEmailVerified: true,
      notificationSettings: null,
      createdDate: '1/2/34',
      role: null,
      organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
      defaultDashboardType: RoleDashboardMenu.Company,
      defaultDashboardId: '147cf568-27a4-4968-5628-046ccfee24fd',
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
      organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
      defaultDashboardType: RoleDashboardMenu.Personal,
      defaultDashboardId: '547cf568-27a4-4968-5628-046ccfee24fd',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ManagementMemberDashboardModalComponent,
        MockComponent(MemberDashboardListModalComponent),
      ],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMemberDashboardModalComponent);
    component = fixture.componentInstance;
    component.dashboardRithmId = '123-123-132';
    component.usersAdd = TEST_USERS;
    dashboardService = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should catch error when unable to add users ', () => {
    spyOn(dashboardService, 'addDashboardMembers').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.addDashboardMembers();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call method addDashboardMembers', () => {
    const spyService = spyOn(
      dashboardService,
      'addDashboardMembers'
    ).and.callThrough();
    component.addDashboardMembers();
    expect(spyService).toHaveBeenCalledOnceWith(
      component.dashboardRithmId,
      component.usersAdd
    );
  });
});
