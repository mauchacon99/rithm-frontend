import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsMenuComponent } from './options-menu.component';
import { MockComponent } from 'ng-mocks';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { ErrorService } from 'src/app/core/error.service';
import { MockDashboardService, MockErrorService } from 'src//mocks';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardData, RoleDashboardMenu, WidgetType } from 'src/models';
import { MenuComponent } from '../menu/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';

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

  it('should call method deleteOrganizationDashboard', () => {
    const deleteCompanyDashboard = spyOn(
      TestBed.inject(DashboardService),
      'deleteOrganizationDashboard'
    ).and.callThrough();

    component.deleteOrganizationDashboard(
      '247cf568-27a4-4968-9338-046ccfee24f3'
    );

    expect(deleteCompanyDashboard).toHaveBeenCalledOnceWith(
      '247cf568-27a4-4968-9338-046ccfee24f3'
    );
  });

  it('should show error if the request deleteOrganizationDashboard fail', () => {
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

    component.deleteOrganizationDashboard(
      '247cf568-27a4-4968-9338-046ccfee24f3'
    );

    expect(deleteCompanyDashboard).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });
});
