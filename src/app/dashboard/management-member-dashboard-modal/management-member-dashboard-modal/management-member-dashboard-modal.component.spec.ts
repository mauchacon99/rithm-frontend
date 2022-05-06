import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { MemberDashboard, RoleDashboardMenu } from 'src/models';
import { MemberDashboardListModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/member-dashboard-list-modal/member-dashboard-list-modal.component';

import { ManagementMemberDashboardModalComponent } from './management-member-dashboard-modal.component';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockDashboardService } from 'src/mocks';
import { throwError } from 'rxjs';

describe('ManagementMemberDashboardModalComponent', () => {
  let component: ManagementMemberDashboardModalComponent;
  let fixture: ComponentFixture<ManagementMemberDashboardModalComponent>;

  const DIALOG_TEST_DATA: {
    /** Selected dashboardRithmId. */
    dashboardRithmId: string;
    /** Selected dashboardType. */
    dashboardType: RoleDashboardMenu;
  } = {
    dashboardRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
    dashboardType: RoleDashboardMenu.Personal,
  };

  const testUsers: MemberDashboard[] = [
    {
      rithmId: '123-456-789',
      profileImageRithmId: '123-456-789',
      firstName: 'Test 1',
      lastName: 'Eagle 1',
      email: 'test1@email.com',
      canView: true,
      isEditable: true,
    },
    {
      rithmId: '987-654-321',
      profileImageRithmId: '987-654-321',
      firstName: 'Test 2',
      lastName: 'Eagle 2',
      email: 'test2@email.com',
      canView: false,
      isEditable: true,
    },
    {
      rithmId: '654-987-321',
      profileImageRithmId: '654-987-321',
      firstName: 'Test 3',
      lastName: 'Eagle 3',
      email: 'test3@email.com',
      canView: true,
      isEditable: false,
    },
    {
      rithmId: '654-321-987',
      profileImageRithmId: '654-321-987',
      firstName: 'Test 4',
      lastName: 'Eagle 4',
      email: 'test4@email.com',
      canView: false,
      isEditable: false,
    },
  ];
  let dashboardService: DashboardService;
  let errorService: ErrorService;

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
    component.usersAdd = testUsers;
    dashboardService = TestBed.inject(DashboardService);
    errorService = TestBed.inject(ErrorService);
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
    const spyError = spyOn(errorService, 'displayError').and.callThrough();
    component.addDashboardMembers();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call method addDashboardMembers', () => {
    const spyService = spyOn(
      dashboardService,
      'addDashboardMembers'
    ).and.callThrough();
    component.addDashboardMembers();
    expect(spyService).toHaveBeenCalledOnceWith(component.usersAdd);
  });

  it('should call getUsersDashboardPersonal', () => {
    const spyService = spyOn(
      dashboardService,
      'getUsersDashboardPersonal'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should catch error if petition to return getUsersDashboardPersonal', () => {
    spyOn(dashboardService, 'getUsersDashboardPersonal').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(errorService, 'displayError').and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });
});
