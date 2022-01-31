import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ExpansionMenuComponent } from './expansion-menu.component';
import { MockComponent } from 'ng-mocks';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';
import { ErrorService } from 'src/app/core/error.service';
import { MockDashboardService, MockErrorService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { DashboardData, RoleDashboardMenu, WidgetType } from 'src/models';
import { of, throwError } from 'rxjs';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

describe('ExpansionMenuComponent', () => {
  let component: ExpansionMenuComponent;
  let fixture: ComponentFixture<ExpansionMenuComponent>;
  const dashboardsList: DashboardData[] = [
    {
      rithmId: '123654-789654-7852',
      name: 'Dashboard 1',
      widgets: [
        {
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
      widgets: [
        {
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
      ],
      imports: [MatExpansionModule, MatListModule, BrowserAnimationsModule],
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
    component.dashboardRole = RoleDashboardMenu.OrganizationDashboard;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getOrganizationDashboard'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch an error if the request to obtain the organization`s list of dashboards fails', () => {
    component.dashboardRole = RoleDashboardMenu.OrganizationDashboard;
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
    component.dashboardRole = RoleDashboardMenu.PersonalDashboard;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getPersonalDashboard'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch an error if the request to get user`s customized dashboard fails', () => {
    component.dashboardRole = RoleDashboardMenu.PersonalDashboard;
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
    component.dashboardRole = RoleDashboardMenu.OrganizationDashboard;
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
    component.dashboardRole = RoleDashboardMenu.PersonalDashboard;
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
    component.dashboardRole = RoleDashboardMenu.OrganizationDashboard;
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
    component.dashboardRole = RoleDashboardMenu.PersonalDashboard;
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
    component.dashboardRole = RoleDashboardMenu.PersonalDashboard;
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
    component.dashboardRole = RoleDashboardMenu.OrganizationDashboard;
    component.isLoading = false;
    component.showError = false;
    fixture.detectChanges();
    const listOrganizationDashboards =
      fixture.debugElement.nativeElement.querySelector(
        `#${component.dashboardRole}-item-1`
      );
    expect(listOrganizationDashboards).toBeTruthy();
  });
});
