import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { RoleDashboardMenu } from 'src/models';
import { MemberDashboardListModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/member-dashboard-list-modal/member-dashboard-list-modal.component';

import { ManagementMemberDashboardModalComponent } from './management-member-dashboard-modal.component';
import {
  DashboardService,
  UsersAdd,
} from 'src/app/dashboard/dashboard.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockDashboardService } from 'src/mocks';
import { throwError } from 'rxjs';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

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

  const testUsers: UsersAdd[] = [
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
    expect(spyService).toHaveBeenCalledOnceWith(
      component.dashboardRithmId,
      component.usersAdd
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
});
