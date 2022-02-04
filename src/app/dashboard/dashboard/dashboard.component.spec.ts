import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '../header/header.component';
import { PriorityQueueComponent } from '../priority-queue/priority-queue.component';
import { PreviouslyStartedDocumentsComponent } from '../previously-started-documents/previously-started-documents.component';
import { MyStationsComponent } from '../my-stations/my-stations.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { StationService } from 'src/app/core/station.service';
import {
  MockErrorService,
  MockStationService,
  MockUserService,
  MockDashboardService,
  MockSplitService,
} from 'src/mocks';
import { UserService } from 'src/app/core/user.service';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from '../dashboard-menu/menu/menu.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { By } from '@angular/platform-browser';
import { StationWidgetComponent } from '../widgets/station-widget/station-widget.component';
import { GridsterModule } from 'angular-gridster2';
import { DashboardData, RoleDashboardMenu, WidgetType } from 'src/models';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MockComponent(HeaderComponent),
        MockComponent(PriorityQueueComponent),
        MockComponent(PreviouslyStartedDocumentsComponent),
        MockComponent(MyStationsComponent),
        MockComponent(MenuComponent),
        MockComponent(StationWidgetComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService, useClass: MockSplitService },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
      imports: [
        MatSidenavModule,
        NoopAnimationsModule,
        GridsterModule,
        MatInputModule,
        RouterTestingModule.withRoutes([
          {
            path: 'dashboard/:dashboardId',
            component: MockComponent(DashboardComponent),
          },
          {
            path: 'dashboard',
            component: MockComponent(DashboardComponent),
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the app-loading-indicator component', () => {
    component.viewNewDashboard = true;
    component.isLoading = true;
    fixture.detectChanges();
    const loader = fixture.debugElement.nativeElement.querySelector(
      '#loading-dashboard-widgets'
    );
    const dashboardWidgets =
      fixture.debugElement.nativeElement.querySelector('#dashboard-widgets');

    expect(loader).toBeTruthy();
    expect(dashboardWidgets).toBeNull();
  });

  it('should show error message when return error dashboard', function () {
    component.viewNewDashboard = true;
    component.errorLoadingDashboard = true;
    fixture.detectChanges();
    const errorLoadingDashboard =
      fixture.debugElement.nativeElement.querySelector(
        '#error-loading-dashboard'
      );
    const dashboardWidgets =
      fixture.debugElement.nativeElement.querySelector('#dashboard-widgets');

    expect(errorLoadingDashboard).toBeTruthy();
    expect(dashboardWidgets).toBeNull();
  });

  it('should show message when dashboard its empty', function () {
    component.viewNewDashboard = true;
    component.isCreateNewDashboard = true;
    fixture.detectChanges();
    const dashboardEmpty = fixture.debugElement.nativeElement.querySelector(
      '#message-create-new-dashboard'
    );
    const dashboardWidgets =
      fixture.debugElement.nativeElement.querySelector('#dashboard-widgets');

    expect(dashboardEmpty).toBeTruthy();
    expect(dashboardWidgets).toBeNull();
  });

  it('should call the `toggle` method on the `SidenavService`', () => {
    const spy = spyOn(TestBed.inject(SidenavDrawerService), 'toggleDrawer');
    component.toggleMenu('menuDashboard');
    expect(spy).toHaveBeenCalledOnceWith('menuDashboard');
  });

  it('should click the dashboard menu button ', () => {
    component.viewNewDashboard = true;
    fixture.detectChanges();
    const spy = spyOn(component, 'toggleMenu');
    const menuBtn = fixture.debugElement.query(By.css('#menu-button'));
    menuBtn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call service to update a personal dashboard', () => {
    component.viewNewDashboard = true;
    const updatePersonalDashboardSpy = spyOn(
      TestBed.inject(DashboardService),
      'updatePersonalDashboard'
    ).and.callThrough();

    component['updatePersonalDashboard']();
    expect(updatePersonalDashboardSpy).toHaveBeenCalled();
  });

  it('should call the service updateOrganizationDashboard ', () => {
    const dashboardData: DashboardData = {
      rithmId: '',
      name: 'new name',
      type: RoleDashboardMenu.Company,
      widgets: [
        {
          cols: 1,
          rows: 2,
          x: 0,
          y: 0,
          widgetType: WidgetType.Document,
          data: 'string',
          minItemRows: 1,
          maxItemRows: 2,
          minItemCols: 1,
          maxItemCols: 2,
        },
      ],
    };

    const methodService = spyOn(
      TestBed.inject(DashboardService),
      'updateOrganizationDashboard'
    ).and.callThrough();

    component.updateOrganizationDashboard(dashboardData);
    expect(methodService).toHaveBeenCalledWith(dashboardData);
  });
});
