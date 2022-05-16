import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsMenuComponent } from './options-menu.component';
import { MockComponent } from 'ng-mocks';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockDashboardService,
  MockErrorService,
  MockPopupService,
  MockUserService,
} from 'src/mocks';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardData, RoleDashboardMenu, WidgetType } from 'src/models';
import { MenuComponent } from '../menu/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { PopupService } from 'src/app/core/popup.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ManagementMemberDashboardModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/management-member-dashboard-modal/management-member-dashboard-modal.component';
import { UserService } from 'src/app/core/user.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('OptionsMenuComponent', () => {
  let component: OptionsMenuComponent;
  let fixture: ComponentFixture<OptionsMenuComponent>;
  let userService: UserService;
  let dashboardService: DashboardService;
  let errorService: ErrorService;
  let sidenavDrawerService: SidenavDrawerService;
  let popupService: PopupService;

  /** Expected data to return when generate new dashboard. */
  const expectNewDashboard: DashboardData = {
    rithmId: '102030405060708090100',
    name: 'Untitled Dashboard',
    type: RoleDashboardMenu.Company,
    widgets: [
      {
        rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
        cols: 4,
        rows: 1,
        x: 0,
        y: 0,
        widgetType: WidgetType.Station,
        data: '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}',
        minItemCols: 4,
        minItemRows: 4,
        maxItemCols: 12,
        maxItemRows: 12,
      },
    ],
    isEditable: false,
    canView: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OptionsMenuComponent,
        MockComponent(MenuComponent),
        MockComponent(ManagementMemberDashboardModalComponent),
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: UserService, useClass: MockUserService },
        {
          provide: ActivatedRoute,
          useValue: {
            // eslint-disable-next-line rxjs/finnish
            paramMap: of(
              convertToParamMap({
                dashboardId: '747cf568-27a4-4968-5628-046ccfee24fd',
              })
            ),
          },
        },
      ],
      imports: [
        MatMenuModule,
        RouterTestingModule.withRoutes([
          {
            path: 'dashboard/:dashboardId',
            component: MockComponent(DashboardComponent),
          },
        ]),
        MatSidenavModule,
        NoopAnimationsModule,
        MatDialogModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsMenuComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    dashboardService = TestBed.inject(DashboardService);
    errorService = TestBed.inject(ErrorService);
    sidenavDrawerService = TestBed.inject(SidenavDrawerService);
    popupService = TestBed.inject(PopupService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service from generateNewOrganizationDashboard', async () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    const spyToggleMenu = spyOn(sidenavDrawerService, 'toggleDrawer');
    const spyLoadingDashboard = spyOn(
      dashboardService,
      'toggleLoadingDashboard'
    );
    const spyService = spyOn(
      dashboardService,
      'generateNewOrganizationDashboard'
    ).and.returnValue(of(expectNewDashboard));

    await component.generateNewDashboard();
    expect(spyLoadingDashboard).toHaveBeenCalled();
    expect(spyService).toHaveBeenCalled();
    expect(spyToggleMenu).toHaveBeenCalledWith('menuDashboard');
    expect(TestBed.inject(Location).path()).toEqual(
      `/dashboard/${expectNewDashboard.rithmId}?editMode=true`
    );
  });

  it('should show an error message when calling generateNewOrganizationDashboard', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    const spyToggleMenu = spyOn(sidenavDrawerService, 'toggleDrawer');
    const spyLoadingDashboard = spyOn(
      dashboardService,
      'toggleLoadingDashboard'
    );
    spyOn(dashboardService, 'generateNewOrganizationDashboard').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(errorService, 'displayError').and.callThrough();

    component.generateNewDashboard();
    expect(spyLoadingDashboard).toHaveBeenCalled();
    expect(spyToggleMenu).toHaveBeenCalledWith('menuDashboard');
    expect(spyError).toHaveBeenCalled();
  });

  it('should call service from generateNewPersonalDashboard', async () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    const spyToggleMenu = spyOn(sidenavDrawerService, 'toggleDrawer');
    const spyLoadingDashboard = spyOn(
      dashboardService,
      'toggleLoadingDashboard'
    );
    const spyService = spyOn(
      dashboardService,
      'generateNewPersonalDashboard'
    ).and.returnValue(of(expectNewDashboard));

    await component.generateNewDashboard();
    expect(spyService).toHaveBeenCalled();
    expect(spyLoadingDashboard).toHaveBeenCalled();
    expect(spyToggleMenu).toHaveBeenCalledWith('menuDashboard');
    expect(TestBed.inject(Location).path()).toEqual(
      `/dashboard/${expectNewDashboard.rithmId}?editMode=true`
    );
  });

  it('should show an error message when calling generateNewPersonalDashboard', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    const spyToggleMenu = spyOn(sidenavDrawerService, 'toggleDrawer');
    spyOn(dashboardService, 'generateNewPersonalDashboard').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyLoadingDashboard = spyOn(
      dashboardService,
      'toggleLoadingDashboard'
    );

    const spyError = spyOn(errorService, 'displayError').and.callThrough();

    component.generateNewDashboard();
    expect(spyLoadingDashboard).toHaveBeenCalled();
    expect(spyToggleMenu).toHaveBeenCalledWith('menuDashboard');
    expect(spyError).toHaveBeenCalled();
  });

  it('should show error if the request deleteOrganizationDashboard fail', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    fixture.detectChanges();
    const rithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    const deleteCompanyDashboard = spyOn(
      dashboardService,
      'deleteOrganizationDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(errorService, 'displayError').and.callThrough();

    const toggleDrawer = spyOn(sidenavDrawerService, 'toggleDrawer');

    component.deleteDashboard(rithmId);

    expect(deleteCompanyDashboard).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
    expect(toggleDrawer).toHaveBeenCalled();
  });

  it('should show error if the request deletePersonalDashboard fail', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    fixture.detectChanges();
    const rithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    const deleteIndividualDashboard = spyOn(
      dashboardService,
      'deletePersonalDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(errorService, 'displayError').and.callThrough();

    const toggleDrawer = spyOn(sidenavDrawerService, 'toggleDrawer');

    component.deleteDashboard(rithmId);

    expect(deleteIndividualDashboard).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
    expect(toggleDrawer).toHaveBeenCalled();
  });

  it('should display a confirmation pop up', async () => {
    const confirmationData = {
      title: 'Delete dashboard?',
      message: 'This cannot be undone!',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      important: true,
    };

    const popUpConfirmSpy = spyOn(popupService, 'confirm').and.callThrough();

    await component.confirmDashboardDelete();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(confirmationData);
  });

  it('should call deleteDashboard for delete dashboard company', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    const rithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    fixture.detectChanges();

    const deleteDashboard = spyOn(
      component,
      'deleteDashboard'
    ).and.callThrough();

    const deleteCompanyDashboard = spyOn(
      dashboardService,
      'deleteOrganizationDashboard'
    ).and.returnValue(of('rithmId'));

    const deletePersonalDashboard = spyOn(
      dashboardService,
      'deletePersonalDashboard'
    ).and.returnValue(of('rithmId'));

    const popUpNotifySpy = spyOn(popupService, 'notify').and.callThrough();

    const toggleDrawer = spyOn(sidenavDrawerService, 'toggleDrawer');

    component.deleteDashboard(rithmId);
    expect(deleteDashboard).toHaveBeenCalledOnceWith(rithmId);
    expect(deleteCompanyDashboard).toHaveBeenCalled();
    expect(deletePersonalDashboard).not.toHaveBeenCalledOnceWith(rithmId);
    expect(popUpNotifySpy).toHaveBeenCalled();
    expect(toggleDrawer).toHaveBeenCalled();
  });

  it('should call deleteDashboard for delete dashboard personal', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    const rithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    fixture.detectChanges();

    const deleteDashboard = spyOn(
      component,
      'deleteDashboard'
    ).and.callThrough();

    const deleteCompanyDashboard = spyOn(
      dashboardService,
      'deleteOrganizationDashboard'
    ).and.returnValue(of('rithmId'));

    const deletePersonalDashboard = spyOn(
      dashboardService,
      'deletePersonalDashboard'
    ).and.returnValue(of('rithmId'));

    const popUpNotifySpy = spyOn(popupService, 'notify').and.callThrough();

    const toggleDrawer = spyOn(sidenavDrawerService, 'toggleDrawer');

    component.deleteDashboard(rithmId);

    expect(deleteDashboard).toHaveBeenCalledOnceWith(rithmId);
    expect(deleteCompanyDashboard).not.toHaveBeenCalled();
    expect(deletePersonalDashboard).toHaveBeenCalledOnceWith(rithmId);
    expect(popUpNotifySpy).toHaveBeenCalled();
    expect(toggleDrawer).toHaveBeenCalled();
  });

  it('should call dashboardService.toggleLoadingDashboard for update dashboard when is deleted', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    component.index = 0;
    const rithmId = '747cf568-27a4-4968-5628-046ccfee24fd';
    fixture.detectChanges();

    const deletePersonalDashboard = spyOn(
      dashboardService,
      'toggleLoadingDashboard'
    ).and.callThrough();

    const toggleDrawer = spyOn(sidenavDrawerService, 'toggleDrawer');

    component.deleteDashboard(rithmId);
    expect(deletePersonalDashboard).toHaveBeenCalled();
    expect(toggleDrawer).toHaveBeenCalled();
  });

  it('should open modal openDialogManagementMembers', () => {
    const rithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    component.rithmId = rithmId;
    component.dashboardRole = RoleDashboardMenu.Company;

    fixture.detectChanges();

    const methodSpy = spyOn(
      component,
      'openDialogManagementMembers'
    ).and.callThrough();

    const matDialogSpy = spyOn(TestBed.inject(MatDialog), 'open');

    component.openDialogManagementMembers();

    expect(methodSpy).toHaveBeenCalled();
    expect(matDialogSpy).toHaveBeenCalledOnceWith(
      ManagementMemberDashboardModalComponent,
      {
        panelClass: [
          'w-5/6',
          'sm:w-3/5',
          'h-[95%]',
          'sm:h-5/6',
          'custom-margin-modal',
        ],
        maxWidth: '1500px',
        disableClose: true,
        data: {
          dashboardRithmId: rithmId,
          dashboardType: RoleDashboardMenu.Company,
        },
      }
    );
  });

  it('should set default dashboard', () => {
    const defaultDashboard = '747cf568-27a4-4968-5628-046ccfee24fd';
    component.dashboardRole = RoleDashboardMenu.Company;
    component.rithmId = defaultDashboard;
    const updateUserAccountSpy = spyOn(
      userService,
      'updateUserAccount'
    ).and.callThrough();
    component.setDefaultDashboard();
    expect(updateUserAccountSpy).toHaveBeenCalledOnceWith({
      defaultDashboardType: RoleDashboardMenu.Company,
      defaultDashboardId: defaultDashboard,
    });
  });

  it('should call errorService if petition updateUserAccount fail', () => {
    const defaultDashboard = '747cf568-27a4-4968-5628-046ccfee24fd';
    component.dashboardRole = RoleDashboardMenu.Company;
    component.rithmId = defaultDashboard;
    const updateUserAccountSpy = spyOn(
      userService,
      'updateUserAccount'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const logErrorSpy = spyOn(errorService, 'logError').and.callThrough();

    component.setDefaultDashboard();
    expect(updateUserAccountSpy).toHaveBeenCalledOnceWith({
      defaultDashboardType: RoleDashboardMenu.Company,
      defaultDashboardId: defaultDashboard,
    });
    expect(logErrorSpy).toHaveBeenCalled();
  });

  it('should get params of path', () => {
    component.ngOnInit();
    expect(component.paramRithmId).toEqual(
      '747cf568-27a4-4968-5628-046ccfee24fd'
    );
  });

  it('should delete dashboard when is default dashboard', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    const spyMethod = spyOn(component, 'setDefaultDashboard').and.callThrough();
    spyOn(dashboardService, 'deleteOrganizationDashboard').and.returnValue(
      of('rithmId')
    );
    spyOn(sidenavDrawerService, 'toggleDrawer');

    component['deleteDashboard'](userService.user.defaultDashboardId);

    expect(spyMethod).toHaveBeenCalledOnceWith(true);
  });

  it('should set default dashboard when clear default', () => {
    const spyService = spyOn(userService, 'updateUserAccount').and.returnValue(
      of(userService.user)
    );
    const spyLoadingDashboard = spyOn(
      dashboardService,
      'toggleLoadingDashboard'
    );

    component.setDefaultDashboard(true);

    expect(spyService).toHaveBeenCalledOnceWith({
      defaultDashboardType: '',
      defaultDashboardId: '',
    });
    expect(spyLoadingDashboard).toHaveBeenCalledOnceWith(false, true);
  });

  it('should set default dashboard when clear default and return error', () => {
    const spyService = spyOn(userService, 'updateUserAccount').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyLoadingDashboard = spyOn(
      dashboardService,
      'toggleLoadingDashboard'
    );

    component.setDefaultDashboard(true);

    expect(spyService).toHaveBeenCalledOnceWith({
      defaultDashboardType: '',
      defaultDashboardId: '',
    });
    expect(spyLoadingDashboard).toHaveBeenCalledOnceWith(false, true);
  });
});
