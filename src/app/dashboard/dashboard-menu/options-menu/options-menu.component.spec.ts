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
} from 'src/mocks';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardData, RoleDashboardMenu, WidgetType } from 'src/models';
import { MenuComponent } from '../menu/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { PopupService } from 'src/app/core/popup.service';

describe('OptionsMenuComponent', () => {
  let component: OptionsMenuComponent;
  let fixture: ComponentFixture<OptionsMenuComponent>;

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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionsMenuComponent, MockComponent(MenuComponent)],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: PopupService, useClass: MockPopupService },
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service from generateNewOrganizationDashboard', async () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    const spyToggleMenu = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );
    const spyLoadingDashboard = spyOn(
      TestBed.inject(DashboardService),
      'toggleLoadingDashboard'
    );
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'generateNewOrganizationDashboard'
    ).and.returnValue(of(expectNewDashboard));

    await component.generateNewDashboard();
    expect(spyLoadingDashboard).toHaveBeenCalled();
    expect(spyService).toHaveBeenCalled();
    expect(spyToggleMenu).toHaveBeenCalledWith('menuDashboard');
    expect(TestBed.inject(Location).path()).toEqual(
      `/dashboard/${expectNewDashboard.rithmId}`
    );
  });

  it('should show an error message when calling generateNewOrganizationDashboard', () => {
    component.dashboardRole = RoleDashboardMenu.Company;
    const spyToggleMenu = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );
    const spyLoadingDashboard = spyOn(
      TestBed.inject(DashboardService),
      'toggleLoadingDashboard'
    );
    spyOn(
      TestBed.inject(DashboardService),
      'generateNewOrganizationDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.generateNewDashboard();
    expect(spyLoadingDashboard).toHaveBeenCalled();
    expect(spyToggleMenu).toHaveBeenCalledWith('menuDashboard');
    expect(spyError).toHaveBeenCalled();
  });

  it('should call service from generateNewPersonalDashboard', async () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    const spyToggleMenu = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );
    const spyLoadingDashboard = spyOn(
      TestBed.inject(DashboardService),
      'toggleLoadingDashboard'
    );
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'generateNewPersonalDashboard'
    ).and.returnValue(of(expectNewDashboard));

    await component.generateNewDashboard();
    expect(spyService).toHaveBeenCalled();
    expect(spyLoadingDashboard).toHaveBeenCalled();
    expect(spyToggleMenu).toHaveBeenCalledWith('menuDashboard');
    expect(TestBed.inject(Location).path()).toEqual(
      `/dashboard/${expectNewDashboard.rithmId}`
    );
  });

  it('should show an error message when calling generateNewPersonalDashboard', () => {
    component.dashboardRole = RoleDashboardMenu.Personal;
    const spyToggleMenu = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );
    spyOn(
      TestBed.inject(DashboardService),
      'generateNewPersonalDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyLoadingDashboard = spyOn(
      TestBed.inject(DashboardService),
      'toggleLoadingDashboard'
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

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
      TestBed.inject(DashboardService),
      'deleteOrganizationDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    const toggleDrawer = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );

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
      TestBed.inject(DashboardService),
      'deletePersonalDashboard'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    const toggleDrawer = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );

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

    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();

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
      TestBed.inject(DashboardService),
      'deleteOrganizationDashboard'
    ).and.returnValue(of('rithmId'));

    const deletePersonalDashboard = spyOn(
      TestBed.inject(DashboardService),
      'deletePersonalDashboard'
    ).and.returnValue(of('rithmId'));

    const popUpNotifySpy = spyOn(
      TestBed.inject(PopupService),
      'notify'
    ).and.callThrough();

    const toggleDrawer = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );

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
      TestBed.inject(DashboardService),
      'deleteOrganizationDashboard'
    ).and.returnValue(of('rithmId'));

    const deletePersonalDashboard = spyOn(
      TestBed.inject(DashboardService),
      'deletePersonalDashboard'
    ).and.returnValue(of('rithmId'));

    const popUpNotifySpy = spyOn(
      TestBed.inject(PopupService),
      'notify'
    ).and.callThrough();

    const toggleDrawer = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );

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
    const rithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    fixture.detectChanges();

    const deletePersonalDashboard = spyOn(
      TestBed.inject(DashboardService),
      'toggleLoadingDashboard'
    ).and.callThrough();

    const toggleDrawer = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );

    component.deleteDashboard(rithmId);
    expect(deletePersonalDashboard).toHaveBeenCalled();
    expect(toggleDrawer).toHaveBeenCalled();
  });
});
