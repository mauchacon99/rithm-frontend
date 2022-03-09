import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { GridsterModule } from 'angular-gridster2';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { throwError } from 'rxjs';
import { MockComponent } from 'ng-mocks';

import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from 'src/app/dashboard/header/header.component';
import { PriorityQueueComponent } from 'src/app/dashboard/priority-queue/priority-queue.component';
import {
  PreviouslyStartedDocumentsComponent
} from '../previously-started-documents/previously-started-documents.component';
import { MyStationsComponent } from '../my-stations/my-stations.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { StationService } from 'src/app/core/station.service';
import {
  MockDashboardService,
  MockErrorService,
  MockSplitService,
  MockStationService,
  MockUserService,
  MockPopupService,
} from 'src/mocks';
import { UserService } from 'src/app/core/user.service';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MenuComponent } from 'src/app/dashboard/dashboard-menu/menu/menu.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationWidgetComponent } from 'src/app/dashboard/widgets/station-widget/station-widget.component';
import { DashboardData, RoleDashboardMenu, WidgetType } from 'src/models';
import { PopupService } from 'src/app/core/popup.service';
import { WidgetDrawerComponent } from 'src/app/dashboard/drawer-widget/widget-drawer/widget-drawer.component';
import { DocumentWidgetComponent } from 'src/app/dashboard/widgets/document-widget/document-widget.component';
import { AddWidgetModalComponent } from 'src/app/dashboard/widget-modal/add-widget-modal/add-widget-modal.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const dashboardRithmId = '123-951-753-789';
  const dataDashboard = {
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
        data: '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3","columns":[]}',
        minItemCols: 4,
        minItemRows: 4,
        maxItemCols: 12,
        maxItemRows: 12,
      },
    ],
  };

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
        MockComponent(DocumentWidgetComponent),
        MockComponent(WidgetDrawerComponent),
        MockComponent(AddWidgetModalComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService, useClass: MockSplitService },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: PopupService, useClass: MockPopupService },
      ],
      imports: [
        MatSidenavModule,
        NoopAnimationsModule,
        GridsterModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatTabsModule,
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

  it('should show error message when return error dashboard', () => {
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

  it('should show message when dashboard its empty', () => {
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

  it('should click the dashboard menu button ', () => {
    component.viewNewDashboard = true;
    fixture.detectChanges();
    const spy = spyOn(component, 'toggleDrawer');
    const menuBtn = fixture.debugElement.query(By.css('#menu-button'));
    menuBtn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call service to update a personal dashboard', () => {
    const dashboardData = {
      rithmId: 'ABC-123-BCA-321',
      name: 'update Dashboard',
      widgets: [],
      type: RoleDashboardMenu.Personal,
    };
    const spyMethodUpdateDashboard = spyOn(
      component,
      'updateDashboard'
    ).and.callThrough();
    const spyServiceUpdateDashboard = spyOn(
      TestBed.inject(DashboardService),
      'updatePersonalDashboard'
    ).and.callThrough();

    component.viewNewDashboard = true;
    component.dashboardData = dashboardData;
    component.isLoading = false;
    component.editMode = true;
    fixture.detectChanges();

    const btnSave = fixture.nativeElement.querySelector('#save-button');
    expect(btnSave).toBeTruthy();
    component.dashboardData = dashboardData;
    btnSave.click();

    expect(spyMethodUpdateDashboard).toHaveBeenCalled();
    expect(spyServiceUpdateDashboard).toHaveBeenCalledOnceWith(dashboardData);
  });

  it('should call service to update a organization dashboard', () => {
    const dashboardData = {
      rithmId: 'ABC-123-BCA-321',
      name: 'update Dashboard',
      widgets: [],
      type: RoleDashboardMenu.Company,
    };
    const spyMethodUpdateDashboard = spyOn(
      component,
      'updateDashboard'
    ).and.callThrough();

    const spyServiceUpdateDashboard = spyOn(
      TestBed.inject(DashboardService),
      'updateOrganizationDashboard'
    ).and.callThrough();

    component.viewNewDashboard = true;
    component.isLoading = false;
    component.dashboardData = dashboardData;
    component.editMode = true;
    fixture.detectChanges();

    const btnSave = fixture.nativeElement.querySelector('#save-button');
    expect(btnSave).toBeTruthy();
    btnSave.click();

    expect(spyMethodUpdateDashboard).toHaveBeenCalled();
    expect(spyServiceUpdateDashboard).toHaveBeenCalledOnceWith(dashboardData);
  });

  it('should returns the organization`s dashboard list', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getOrganizationDashboard'
    ).and.callThrough();
    component['getOrganizationDashboard']();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch an error if the request to obtain the organization`s list of dashboards fails', () => {
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
    component['getOrganizationDashboard']();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call service dashboard for id', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getDashboardWidgets'
    ).and.callThrough();

    component['getDashboardByRithmId'](dashboardRithmId);

    expect(spyService).toHaveBeenCalled();
  });

  it('should catch error if petition to return dashboard for id service fails', () => {
    spyOn(
      TestBed.inject(DashboardService),
      'getDashboardWidgets'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component['getDashboardByRithmId'](dashboardRithmId);
    expect(spyError).toHaveBeenCalled();
  });

  it('should show alert confirm for change editMode the dashboard', async () => {
    const dataExpect = {
      title: 'Cancel?',
      message: 'All unsaved changes will be lost',
      important: true,
      okButtonText: 'Yes',
      cancelButtonText: 'No',
    };
    component.dashboardData = dataDashboard;
    component.dashboardDataCopy = dataDashboard;
    const spyMethod = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.toggleEditMode(false);
    expect(spyMethod).toHaveBeenCalledWith(dataExpect);
  });

  it('should call changedOptions when dashboard alert for activate edit mode', async () => {
    component.dashboardDataCopy = dataDashboard;
    const spyMethod = spyOn(component, 'changedOptions').and.callThrough();
    await component.toggleEditMode(true);
    expect(spyMethod).toHaveBeenCalledWith();
  });

  it('should call openDialog', () => {
    component.viewNewDashboard = true;
    component.editMode = true;
    component.isAddWidget = true;
    component.dashboardData = {
      rithmId: '123654-789654-7852',
      name: 'Organization 1',
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
    };
    fixture.detectChanges();
    const spyDialog = spyOn(TestBed.inject(MatDialog), 'open');

    const btn = fixture.nativeElement.querySelector('#add-widget-button');
    expect(btn).toBeTruthy();
    btn.click();
    expect(spyDialog).toHaveBeenCalled();
  });

  describe('Test for SidenavDrawerService', () => {
    let sidenavDrawer: SidenavDrawerService;

    beforeEach(() => {
      sidenavDrawer = TestBed.inject(SidenavDrawerService);
    });

    it('should call sidenav service for live init cycle component', () => {
      const spySideNav = spyOn(sidenavDrawer, 'setDrawer').and.callThrough();
      component.ngOnInit();
      expect(spySideNav).toHaveBeenCalled();
    });

    it('should call the `toggle` method on the `SidenavService`', () => {
      const spyProperty = spyOnProperty(
        sidenavDrawer,
        'isDrawerOpen',
        'get'
      ).and.returnValue(false);
      const spy = spyOn(sidenavDrawer, 'toggleDrawer');
      component.toggleDrawer('menuDashboard');
      expect(spyProperty).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledOnceWith('menuDashboard', undefined);
    });

    it('should call twice the `toggle` method on the `SidenavService` if `isDrawerOpen` is true', async () => {
      const spyService = spyOn(sidenavDrawer, 'toggleDrawer');
      spyOn(component.drawer, 'close').and.callThrough();
      const spyProperty = spyOnProperty(
        sidenavDrawer,
        'isDrawerOpen',
        'get'
      ).and.returnValue(true);
      await component.toggleDrawer('menuDashboard');
      expect(spyProperty).toHaveBeenCalled();
      expect(spyService).toHaveBeenCalled();
      expect(component.drawer.close).toHaveBeenCalled();
    });

    it('Should toggle drawer of the widgets', () => {
      const quantityElementsWidget = 2;
      spyOn(sidenavDrawer, 'toggleDrawer');
      const widgetItem = {
        rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
        cols: 4,
        rows: 1,
        x: 0,
        y: 0,
        widgetType: WidgetType.Station,
        data: '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3","columns":[]}',
        minItemCols: 4,
        minItemRows: 4,
        maxItemCols: 12,
        maxItemRows: 12,
      };
      const widgetIndex = 1;
      const spyMethod = spyOn(component, 'toggleDrawer').and.callThrough();
      component.toggleWidgetDrawer(
        'stationWidget',
        widgetItem,
        widgetIndex,
        quantityElementsWidget
      );
      expect(spyMethod).toHaveBeenCalledOnceWith('stationWidget', {
        widgetItem,
        widgetIndex,
        quantityElementsWidget,
      });
    });

    it('should call toggle drawer for close drawer the widgets how dashboard change a editMode false', async () => {
      const drawerContext = 'stationWidget';
      sidenavDrawer.drawerContext$.next(drawerContext);
      expect(component.drawerContext).toBe(drawerContext);
      component.dashboardData = dataDashboard;
      component.dashboardDataCopy = dataDashboard;
      spyOnProperty(component, 'isDrawerOpen').and.returnValue(true);
      const spyMethod = spyOn(component, 'changedOptions').and.callThrough();
      const spyDrawer = spyOn(sidenavDrawer, 'toggleDrawer');
      await component.toggleEditMode(false);
      expect(spyMethod).toHaveBeenCalledWith();
      expect(spyDrawer).toHaveBeenCalledWith('stationWidget');
    });

    it('should toggle drawer if drawer open is different a menuDashboard when update dashboard', () => {
      component.drawerContext = 'stationWidget';
      component.dashboardData = dataDashboard;
      spyOnProperty(component, 'isDrawerOpen').and.returnValue(true);
      const spyDrawer = spyOn(sidenavDrawer, 'toggleDrawer');
      component.updateDashboard();
      expect(spyDrawer).toHaveBeenCalled();
    });

    it('should call method returnWidgetsCompared', () => {
      const response = component['returnWidgetsCompared'](
        dataDashboard.widgets
      );
      expect(response).not.toBeUndefined();
    });

    it('should call toggle drawer for close drawer when show dialog add new widget', () => {
      component.dashboardData = dataDashboard;
      const drawerContext = 'stationWidget';
      sidenavDrawer.drawerContext$.next(drawerContext);
      expect(component.drawerContext).toBe(drawerContext);
      spyOnProperty(component, 'isDrawerOpen').and.returnValue(true);
      const spyDrawer = spyOn(sidenavDrawer, 'toggleDrawer');
      const spyDialog = spyOn(TestBed.inject(MatDialog), 'open');
      component.openDialogAddWidget();
      expect(spyDrawer).toHaveBeenCalledWith(drawerContext);
      expect(spyDialog).toHaveBeenCalled();
    });
  });

  describe('Expand widget', () => {
    const dashboardData = {
      rithmId: '123654-789654-7852',
      name: 'Organization 1',
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
    };

    it('should expand widget', () => {
      component.dashboardDataCopy = dashboardData;
      component.dashboardData = dashboardData;
      component.toggleExpandWidget(0, true);

      expect(component.dashboardData.widgets[0].rows).toEqual(3);
      expect(component.dashboardData.widgets[0].layerIndex).toEqual(2);
    });

    it('should not expand widget', () => {
      component.dashboardDataCopy = dashboardData;
      component.dashboardData = dashboardData;
      component.toggleExpandWidget(0, false);

      expect(component.dashboardData.widgets[0].layerIndex).toEqual(1);
      expect(component.dashboardData).toEqual(component.dashboardDataCopy);
    });
  });

  it('should update dashboard widgets', () => {
    const quantityElementsWidget = 2;
    component.dashboardData = dataDashboard;
    const editDataWidget = {
      widgetItem: {
        rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
        cols: 4,
        // eslint-disable-next-line max-len
        data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1","columns": [{"name": "name"}, {"name": "name", "questionId": "d17f6f7a-9642-45e0-8221-e48045d3c97e"}]}',
        maxItemCols: 0,
        maxItemRows: 0,
        minItemCols: 0,
        minItemRows: 0,
        rows: 2,
        widgetType: WidgetType.Station,
        x: 0,
        y: 0,
      },
      widgetIndex: 0,
      quantityElementsWidget,
      isCloseDrawer: false,
    };
    const expectDashboardData = dataDashboard;
    expectDashboardData.widgets[0] = editDataWidget.widgetItem;
    component.updateDashboardWidget(editDataWidget);
    expect(component.dashboardData).toEqual(expectDashboardData);
  });

  it('should subscribe to DashboardService.updateDataWidget$', () => {
    const quantityElementsWidget = 2;
    component.dashboardData = dataDashboard;
    const spyMethod = spyOn(component, 'updateDashboardWidget');
    const expectEditDataWidget = {
      widgetItem: dataDashboard.widgets[0],
      widgetIndex: 1,
      quantityElementsWidget,
    };

    TestBed.inject(DashboardService).updateDashboardWidgets(
      expectEditDataWidget
    );

    expect(spyMethod).toHaveBeenCalledOnceWith(expectEditDataWidget);
  });

  it('should emit DashboardService.isLoadingDashboard$ and call getParams', () => {
    const spyRoute = spyOn(TestBed.inject(ActivatedRoute).params, 'subscribe');
    TestBed.inject(DashboardService).toggleLoadingDashboard(true, true);
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    expect(component.errorLoadingDashboard).toBeFalse();
    expect(component.isCreateNewDashboard).toBeFalse();
    expect(spyRoute).toHaveBeenCalled();
  });

  it('should remove a widget in dashboard', () => {
    const spyRemoveWidgetIndex = spyOn(
      component,
      'removeWidgetIndex'
    ).and.callThrough();

    const widgetIndex = 1;
    const dashboardData: DashboardData = {
      rithmId: 'DF362D34-25E0-49B8-9FA8-2B1349E9A42D',
      name: 'Company Dashboard no delete!',
      widgets: [
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 4,
          rows: 2,
          x: 8,
          y: 0,
          widgetType: WidgetType.StationGroup,
          data: '{"documentRithmId":"07ce2489-b07e-48e2-a378-99e7f487aa0f"}',
          minItemRows: 1,
          maxItemRows: 1,
          minItemCols: 3,
          maxItemCols: 1,
        },
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 4,
          rows: 2,
          x: 0,
          y: 0,
          widgetType: WidgetType.Station,
          data: '',
          minItemRows: 1,
          maxItemRows: 1,
          minItemCols: 3,
          maxItemCols: 1,
        },
      ],
      type: RoleDashboardMenu.Company,
    };

    component.dashboardData = dashboardData;
    fixture.detectChanges();
    expect(component.dashboardData.widgets.length).toEqual(2);
    component.removeWidgetIndex(widgetIndex);
    expect(spyRemoveWidgetIndex).toHaveBeenCalledOnceWith(widgetIndex);
    expect(component.dashboardData.widgets.length).toEqual(1);
  });

  it('should call trackBy and return id', () => {
    const rithmId = 'DF362D34-25E0-49B8-9FA8-2B1349E9A42D';
    const item = {
      rithmId,
      x: 0,
      y: 0,
      rows: 1,
      cols: 1,
      '': '',
    };
    const ExpectedRithmId = component.trackBy(1, item);
    expect(ExpectedRithmId).toBe(rithmId);
  });

  it('should get queryParam edit and toggleEditMode', fakeAsync(() => {
    TestBed.inject(Router).navigate(
      ['/', 'dashboard', '2433D3E3-D3BA-4F18-A0D3-2121968EC7F5'],
      {
        queryParams: { editMode: true },
      }
    );
    const spyService = spyOn(
      TestBed.inject(ActivatedRoute).queryParams,
      'subscribe'
    ).and.callThrough();
    tick();
    component['getQueryParams']();
    expect(component.editMode).toBeTrue();
    expect(spyService).toHaveBeenCalled();
  }));

  it('should not show the button add widget in edit mode', () => {
    component.viewNewDashboard = true;
    component.editMode = true;
    component.isAddWidget = false;
    component.dashboardData = {
      rithmId: '123654-789654-7852',
      name: 'Organization 1',
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
    };
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('#add-widget-button');
    expect(btn).toBeNull();
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
    });

    it('should get splits for the viewNewDashboard and isAddWidget', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk');
      const spyGetDashboardTreatment = spyOn(
        splitService,
        'getDashboardTreatment'
      ).and.returnValue('on');
      const spyGetDashboardLibraryTreatment = spyOn(
        splitService,
        'getDashboardLibraryTreatment'
      ).and.returnValue('on');
      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(spyGetDashboardTreatment).toHaveBeenCalled();
      expect(spyGetDashboardLibraryTreatment).toHaveBeenCalled();
      expect(component.viewNewDashboard).toBeTrue();
      expect(component.isAddWidget).toBeTrue();

    });

    it('should catch error the splits for the menu', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk');
      splitService.sdkReady$.error('error');
      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(errorService).toHaveBeenCalled();
    });
  });
});
