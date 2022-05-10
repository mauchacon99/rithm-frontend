import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ExpansionMenuComponent } from './expansion-menu.component';
import { MockComponent } from 'ng-mocks';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockDashboardService,
  MockErrorService,
  MockUserService,
} from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { DashboardData, RoleDashboardMenu, User, WidgetType } from 'src/models';
import { of, throwError } from 'rxjs';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { UserService } from 'src/app/core/user.service';

describe('ExpansionMenuComponent', () => {
  let component: ExpansionMenuComponent;
  let fixture: ComponentFixture<ExpansionMenuComponent>;
  const dashboardsList: DashboardData[] = [
    {
      rithmId: '123654-789654-7852',
      name: 'Dashboard 1',
      type: RoleDashboardMenu.Company,
      widgets: [
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 4,
          data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1"}',
          maxItemCols: 0,
          maxItemRows: 0,
          minItemCols: 0,
          minItemRows: 0,
          rows: 2,
          widgetType: WidgetType.Station,
          x: 0,
          y: 0,
        },
      ],
    },
    {
      rithmId: '123654-789654-7852',
      name: 'Dashboard 2',
      type: RoleDashboardMenu.Company,
      widgets: [
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 4,
          data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1-2"}',
          maxItemCols: 0,
          maxItemRows: 0,
          minItemCols: 0,
          minItemRows: 0,
          rows: 2,
          widgetType: WidgetType.Station,
          x: 0,
          y: 0,
        },
      ],
    },
  ];

  const testUser: User = {
    firstName: 'Samus',
    lastName: 'Aran',
    email: 'ycantmetroidcrawl@metroid.com',
    isEmailVerified: true,
    createdDate: new Date().toISOString(),
    rithmId: 'kj34k3jkj',
    notificationSettings: null,
    role: null,
    organization: '',
    profileImageRithmId: 'f47cf568-27a4-4968-5628-f46ccfee24ff',
    defaultDashboardType: RoleDashboardMenu.Personal,
    defaultDashboardId: '347cf568-27a4-4968-5628-046ccfee24fd',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExpansionMenuComponent,
        MockComponent(OptionsMenuComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: UserService, useClass: MockUserService },
      ],
      imports: [
        MatExpansionModule,
        MatListModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'dashboard/:dashboardId',
            component: MockComponent(DashboardComponent),
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionMenuComponent);
    component = fixture.componentInstance;
    component.dashboardsList = dashboardsList;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should returns the organization`s dashboard list', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getOrganizationDashboard'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch an error if the request to obtain the organization`s list of dashboards fails', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    spyOn(
      TestBed.inject(DashboardService),
      'getOrganizationDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });

  it('should returns user`s customized dashboards', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getPersonalDashboard'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch an error if the request to get user`s customized dashboard fails', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    spyOn(
      TestBed.inject(DashboardService),
      'getPersonalDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });

  it('should show only loading while the request responds', () => {
    component.isLoading = true;
    component.showError = false;
    component.dashboardsList = [];
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#loading-dashboards-list'
    );
    const error = fixture.debugElement.nativeElement.querySelector(
      '#error-dashboard-list'
    );
    const emptyDashboard = fixture.debugElement.nativeElement.querySelector(
      '#empty-dashboards-list'
    );
    expect(loading).toBeTruthy();
    expect(error).toBeFalsy();
    expect(emptyDashboard).toBeFalsy();
  });

  it('should only show an error if the request to get organization dashboard fails', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    spyOn(
      TestBed.inject(DashboardService),
      'getOrganizationDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#loading-dashboards-list'
    );
    const error = fixture.debugElement.nativeElement.querySelector(
      '#error-dashboard-list'
    );
    const emptyDashboard = fixture.debugElement.nativeElement.querySelector(
      '#empty-dashboards-list'
    );
    expect(component.isLoading).toBeFalse();
    expect(loading).toBeFalsy();
    expect(component.showError).toBeTrue();
    expect(error).toBeTruthy();
    expect(emptyDashboard).toBeNull();
  });

  it('should only show an error if the request to get user`s customized personal dashboard fails', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    spyOn(
      TestBed.inject(DashboardService),
      'getPersonalDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#loading-dashboards-list'
    );
    const error = fixture.debugElement.nativeElement.querySelector(
      '#error-dashboard-list'
    );
    const emptyDashboard = fixture.debugElement.nativeElement.querySelector(
      '#empty-dashboards-list'
    );
    expect(component.isLoading).toBeFalse();
    expect(loading).toBeFalsy();
    expect(component.showError).toBeTrue();
    expect(error).toBeTruthy();
    expect(emptyDashboard).toBeNull();
  });

  it('should only show message if nor return list to dashboard for organization dashboards', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    spyOn(
      TestBed.inject(DashboardService),
      'getOrganizationDashboard'
    ).and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#loading-dashboards-list'
    );
    const error = fixture.debugElement.nativeElement.querySelector(
      '#error-dashboard-list'
    );
    const emptyDashboard = fixture.debugElement.nativeElement.querySelector(
      '#empty-dashboards-list'
    );
    expect(component.isLoading).toBeFalse();
    expect(loading).toBeFalsy();
    expect(component.showError).toBeFalse();
    expect(error).toBeFalsy();
    expect(emptyDashboard).toBeTruthy();
  });

  it('should only show message if nor return list to dashboard for user dashboards', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    spyOn(
      TestBed.inject(DashboardService),
      'getPersonalDashboard'
    ).and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#loading-dashboards-list'
    );
    const error = fixture.debugElement.nativeElement.querySelector(
      '#error-dashboard-list'
    );
    const emptyDashboard = fixture.debugElement.nativeElement.querySelector(
      '#empty-dashboards-list'
    );
    expect(component.isLoading).toBeFalse();
    expect(loading).toBeFalsy();
    expect(component.showError).toBeFalse();
    expect(error).toBeFalsy();
    expect(emptyDashboard).toBeTruthy();
  });

  it('should list to personal dashboards', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    component.isLoading = false;
    component.showError = false;
    fixture.detectChanges();
    const listOrganizationDashboards =
      fixture.debugElement.nativeElement.querySelector(
        `#${component.dashboardRole}-item-1`
      );
    expect(listOrganizationDashboards).toBeTruthy();
  });

  it('should list to organization dashboards', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    component.isLoading = false;
    component.showError = false;
    fixture.detectChanges();
    const listOrganizationDashboards =
      fixture.debugElement.nativeElement.querySelector(
        `#${component.dashboardRole}-item-1`
      );
    expect(listOrganizationDashboards).toBeTruthy();
  });

  it('should render dashboard and navigate with router', () => {
    component.isLoading = false;
    component.showError = false;
    const spyHiddenDrawer = spyOn(component, 'hiddenDrawer').and.callThrough();
    const spyDrawer = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );

    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector(
      `#${component.dashboardRole}-item-1`
    );
    expect(button).toBeTruthy();
    button.click();
    expect(spyHiddenDrawer).toHaveBeenCalledOnceWith();
    expect(spyDrawer).toHaveBeenCalledOnceWith('menuDashboard');
  });

  it('Should subscribe to user.userData$', () => {
    component.indexDefaultDashboard = 1;
    fixture.detectChanges();
    component.dashboardRole = RoleDashboardMenu.Company;
    const spyUserService = spyOn(
      TestBed.inject(UserService).userData$,
      'next'
    ).and.callThrough();
    component.ngOnInit();
    TestBed.inject(UserService).userData$.next(testUser);
    expect(spyUserService).toHaveBeenCalled();
    expect(component.indexDefaultDashboard).toBeUndefined();
  });

  it('Should hidden icon if default dashboard is not defined', () => {
    component.indexDefaultDashboard = 1;
    fixture.detectChanges();
    const user: User = {
      firstName: 'Samus',
      lastName: 'Aran',
      email: 'ycantmetroidcrawl@metroid.com',
      isEmailVerified: true,
      createdDate: new Date().toISOString(),
      rithmId: 'kj34k3jkj',
      notificationSettings: null,
      role: null,
      organization: '',
      profileImageRithmId: 'f47cf568-27a4-4968-5628-f46ccfee24ff',
      defaultDashboardType: '' as RoleDashboardMenu,
      defaultDashboardId: '',
    };

    component.dashboardRole = RoleDashboardMenu.Company;
    const spyUserService = spyOn(
      TestBed.inject(UserService).userData$,
      'next'
    ).and.callThrough();
    component.ngOnInit();
    TestBed.inject(UserService).userData$.next(user);
    expect(spyUserService).toHaveBeenCalled();
    expect(component.indexDefaultDashboard).toBeUndefined();
  });

  it('Should set index of default dashboard', () => {
    component.markDefaultDashboard(true, 2);
    expect(component.indexDefaultDashboard).toBe(2);
  });
});
