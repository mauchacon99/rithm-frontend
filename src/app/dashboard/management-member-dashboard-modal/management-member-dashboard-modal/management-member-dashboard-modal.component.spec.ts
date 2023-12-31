import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import {
  FilterOptionTypeMemberDashboard,
  MemberDashboard,
  RoleDashboardMenu,
  MemberAddDashboard,
} from 'src/models';
import { MemberDashboardListModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/member-dashboard-list-modal/member-dashboard-list-modal.component';

import { ManagementMemberDashboardModalComponent } from './management-member-dashboard-modal.component';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockDashboardService } from 'src/mocks';
import { throwError } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { LoadingWidgetComponent } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/shared/widget-dashboard/error-widget/error-widget.component';

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

  const testUsersAdd: MemberAddDashboard[] = [
    {
      userRithmId: '7fff6288-cb06-4626-8b58-9c157bc15646',
      canView: true,
      isEditable: true,
    },
    {
      userRithmId: '92c53ccd-dab1-44ad-976d-86a48d2104b5',
      canView: true,
      isEditable: true,
    },
  ];

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
      rithmId: '123-856-789',
      profileImageRithmId: '325-456-789',
      firstName: 'Test 2',
      lastName: 'Eagle 3',
      email: 'test2@email.com',
      canView: true,
      isEditable: false,
    },
  ];
  let dashboardService: DashboardService;
  let errorService: ErrorService;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ManagementMemberDashboardModalComponent,
        MockComponent(MemberDashboardListModalComponent),
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      imports: [
        BrowserAnimationsModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: FormBuilder, useValue: formBuilder },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMemberDashboardModalComponent);
    component = fixture.componentInstance;
    component.dashboardRithmId = '123-123-132';
    component.membersAddDashboard = testUsersAdd;
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
    expect(spyService).toHaveBeenCalledOnceWith(
      component.dashboardRithmId,
      component.membersAddDashboard
    );
  });

  it('should call getUsersDashboardPersonal', () => {
    const spyService = spyOn(
      dashboardService,
      'getUsersDashboardPersonal'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith(component.dashboardRithmId);
  });

  it('should catch error if petition to return getUsersDashboardPersonal', () => {
    spyOn(dashboardService, 'getUsersDashboardPersonal').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(errorService, 'displayError').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    const errorLoadingDashboard =
      fixture.debugElement.nativeElement.querySelector(
        '#error-load-user-member'
      );
    expect(errorLoadingDashboard).toBeTruthy();
    expect(spyError).toHaveBeenCalled();
  });

  it('should render the app-loading-indicator component', () => {
    component.isLoadingGetUserMembers = true;
    fixture.detectChanges();
    const loader = fixture.debugElement.nativeElement.querySelector(
      '#app-loading-indicator-user-member'
    );
    expect(loader).toBeTruthy();
  });

  it('should add forms in form', () => {
    component.membersDashboard = testUsers;
    fixture.detectChanges();
    component['addForms']();
    //subtract here the extra fields
    expect(Object.keys(component.form.value).length - 1).toBe(testUsers.length);
  });

  it('should show message error if not have members for show', () => {
    component.isLoadingGetUserMembers = false;
    component.errorGetUsersMember = false;
    component.membersDashboard = [];
    fixture.detectChanges();
    const loader = fixture.debugElement.nativeElement.querySelector(
      '#message-error-members'
    );
    expect(loader).toBeTruthy();
  });

  describe('getter members dashboard', () => {
    const membersDashboard: MemberDashboard[] = [
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
        lastName: 'Lion 4',
        email: 'test4@email.com',
        canView: false,
        isEditable: false,
      },
    ];
    beforeEach(() => {
      component.membersDashboard = membersDashboard;
      membersDashboard.map((member) => {
        component.form.addControl(
          member.rithmId,
          TestBed.inject(FormBuilder).control({
            check: member.canView,
            isEditable: member.isEditable,
          })
        );
      });
    });

    it('should get all members', () => {
      component.search = '';
      component.selectedFilterValue = FilterOptionTypeMemberDashboard.All;
      expect(component.membersDashboardFiltered.length).toEqual(4);
      expect(component.membersDashboardFiltered).toEqual(membersDashboard);
    });

    it('should get members when use filter ViewOnly and search', () => {
      component.search = 'test1@email.com';
      component.selectedFilterValue = FilterOptionTypeMemberDashboard.ViewOnly;
      const expectData = [membersDashboard[0]];
      expect(component.membersDashboardFiltered.length).toEqual(1);
      expect(component.membersDashboardFiltered).toEqual(expectData);
    });

    it('should get members when use filter CanEdit and search', () => {
      component.search = 'test1@email.com';
      component.selectedFilterValue = FilterOptionTypeMemberDashboard.CanEdit;
      const expectData = [membersDashboard[0]];
      expect(component.membersDashboardFiltered.length).toEqual(1);
      expect(component.membersDashboardFiltered).toEqual(expectData);
    });

    it('should get members when use search', () => {
      component.search = 'eagle';
      component.selectedFilterValue = FilterOptionTypeMemberDashboard.All;
      const [member1, member2, member3] = membersDashboard;
      const expectData = [member1, member2, member3];
      expect(component.membersDashboardFiltered.length).toEqual(3);
      expect(component.membersDashboardFiltered).toEqual(expectData);
    });

    it('should return true getSearch if find a member', () => {
      component.search = 'Test 1';
      expect(component['getSearch'](membersDashboard[0])).toBeTrue();
    });

    it('should return false getSearch if find a member', () => {
      component.search = 'Test 2';
      expect(component['getSearch'](membersDashboard[0])).toBeFalse();
    });

    it('should search apply trim', () => {
      component.search = '    ';
      component.membersDashboardFiltered;
      expect(component.search).toEqual('');
    });

    it('should call reset checkAll', () => {
      const spyReset = spyOn(
        component.form.controls['checkAll'],
        'reset'
      ).and.callThrough();
      component['deselectCheckAll']();
      expect(spyReset).toHaveBeenCalled();
    });

    it('should patch values when select all change', () => {
      const spyForm = spyOn(component.form, 'patchValue').and.callThrough();
      component.form.controls['checkAll'].setValue(false);

      component.onChangeSelectAll();
      const expectData = {
        check: false,
        isEditable: false,
      };

      expect(spyForm).toHaveBeenCalled();
      membersDashboard.map(({ rithmId }) => {
        expect(component.form.controls[rithmId].value).toEqual(expectData);
      });
    });
  });
});
