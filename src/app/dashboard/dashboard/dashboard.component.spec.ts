import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { GridsterModule } from 'angular-gridster2';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { ElementRef, Renderer2, Type } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MockComponent, MockService } from 'ng-mocks';

import {
  MockDashboardService,
  MockErrorService,
  MockSplitService,
  MockUserService,
  MockPopupService,
} from 'src/mocks';
import { DashboardData, RoleDashboardMenu, WidgetType } from 'src/models';
import { UserService } from 'src/app/core/user.service';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MenuComponent } from 'src/app/dashboard/dashboard-menu/menu/menu.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { PopupService } from 'src/app/core/popup.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { WidgetDrawerComponent } from 'src/app/dashboard/drawer-widget/widget-drawer/widget-drawer.component';
import { AddWidgetModalComponent } from 'src/app/dashboard/widget-modal/add-widget-modal/add-widget-modal.component';
import { MobileBrowserChecker } from 'src/helpers';
import { GroupSearchWidgetComponent } from 'src/app/shared/widget-dashboard/group-search-widget/group-search-widget.component';
import { GroupTrafficWidgetComponent } from 'src/app/shared/widget-dashboard/group-traffic-widget/group-traffic-widget.component';
import { ContainerPreBuiltWidgetComponent } from 'src/app/dashboard/widgets/container-pre-built-widget/container-pre-built-widget.component';
import { StationWidgetComponent } from 'src/app/shared/widget-dashboard/station-widget/station-widget.component';
import { DocumentWidgetComponent } from 'src/app/shared/widget-dashboard/document-widget/document-widget.component';

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
    isEditable: true,
    canView: false,
  };
  let userService: UserService;
  let dashboardService: DashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MockComponent(MenuComponent),
        MockComponent(StationWidgetComponent),
        MockComponent(LoadingIndicatorComponent),
        MockComponent(DocumentWidgetComponent),
        MockComponent(WidgetDrawerComponent),
        MockComponent(AddWidgetModalComponent),
        MockComponent(GroupSearchWidgetComponent),
        MockComponent(GroupTrafficWidgetComponent),
        MockComponent(ContainerPreBuiltWidgetComponent),
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService, useClass: MockSplitService },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: PopupService, useClass: MockPopupService },
        Renderer2,
        { provide: ElementRef, useValue: MockService(ElementRef) },
        { provide: MobileBrowserChecker, useClass: MobileBrowserChecker },
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
    component.dashboardData = dataDashboard;
    userService = TestBed.inject(UserService);
    dashboardService = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the app-loading-indicator component', () => {
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
      isEditable: false,
      canView: false,
    };
    const spyMethodUpdateDashboard = spyOn(
      component,
      'updateDashboard'
    ).and.callThrough();
    const spyServiceUpdateDashboard = spyOn(
      dashboardService,
      'updatePersonalDashboard'
    ).and.callThrough();

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
      isEditable: false,
      canView: false,
    };
    const spyMethodUpdateDashboard = spyOn(
      component,
      'updateDashboard'
    ).and.callThrough();

    const spyServiceUpdateDashboard = spyOn(
      dashboardService,
      'updateOrganizationDashboard'
    ).and.callThrough();

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
      dashboardService,
      'getOrganizationDashboard'
    ).and.callThrough();
    component['getOrganizationDashboard']();
    expect(spyService).toHaveBeenCalledOnceWith();
  });

  it('should catch an error if the request to obtain the organization`s list of dashboards fails', () => {
    spyOn(dashboardService, 'getOrganizationDashboard').and.returnValue(
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
      dashboardService,
      'getDashboardWidgets'
    ).and.callThrough();

    component['getDashboardByRithmId'](dashboardRithmId);

    expect(spyService).toHaveBeenCalled();
  });

  it('should catch error if petition to return dashboard for id service fails when is dashboard default', () => {
    spyOn(dashboardService, 'getDashboardWidgets').and.returnValue(
      throwError(() => {
        throw new HttpErrorResponse({ error: 'any error', status: 400 });
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component['getDashboardByRithmId'](dashboardRithmId, true);
    expect(spyError).toHaveBeenCalled();
  });

  it('should catch error if petition to return dashboard for id service fails when is not dashboard default', () => {
    spyOn(dashboardService, 'getDashboardWidgets').and.returnValue(
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
    component.isLoading = false;
    component.editMode = true;
    component.errorLoadingDashboard = false;
    component.isCreateNewDashboard = false;
    component.isLoading = false;
    component.isAddWidget = true;
    component.canAssignUserWidget = true;
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
      isEditable: false,
      canView: false,
    };
    fixture.detectChanges();
    const spyDialog = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
      afterClosed: () => of(false),
    } as MatDialogRef<typeof component>);

    const btn = fixture.nativeElement.querySelector('#add-widget-button');
    expect(btn).toBeTruthy();
    btn.click();
    expect(spyDialog).toHaveBeenCalled();
  });

  it('should push new widget to dashboardData', () => {
    component.dashboardData = dataDashboard;
    const widgetItem = {
      rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
      cols: 3,
      rows: 1,
      x: 0,
      y: 0,
      widgetType: WidgetType.Station,
      data: '{"documentRithmId":"2f568-27a4-4968-04c4f3","columns":[]}',
      minItemCols: 3,
      minItemRows: 1,
      maxItemCols: 12,
      maxItemRows: 12,
    };
    const spyPushWidget = spyOn(
      component.dashboardData.widgets,
      'push'
    ).and.callThrough();
    const spyDialog = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
      afterClosed: () => of(widgetItem),
    } as MatDialogRef<typeof component>);
    component.openDialogAddWidget();
    expect(spyPushWidget).toHaveBeenCalledOnceWith(widgetItem);
    expect(spyDialog).toHaveBeenCalled();
    expect(component.dashboardData.widgets.length).toEqual(2);
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
      component.deleteWidget = true;
      fixture.detectChanges();
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
        widgetItem,
        widgetIndex,
        quantityElementsWidget
      );
      expect(spyMethod).toHaveBeenCalledOnceWith('widgetDashboard', {
        widgetItem,
        widgetIndex,
        quantityElementsWidget,
        deleteWidget: true,
      });
    });

    it('should call toggle drawer for close drawer the widgets how dashboard change a editMode false', async () => {
      const drawerContext = 'widgetDashboard';
      sidenavDrawer.drawerContext$.next(drawerContext);
      expect(component.drawerContext).toBe(drawerContext);
      component.dashboardDataCopy = dataDashboard;
      spyOnProperty(component, 'isDrawerOpen').and.returnValue(true);
      const spyMethod = spyOn(component, 'changedOptions').and.callThrough();
      const spyDrawer = spyOn(sidenavDrawer, 'toggleDrawer');
      await component.toggleEditMode(false);
      expect(spyMethod).toHaveBeenCalledWith();
      expect(spyDrawer).toHaveBeenCalledWith('widgetDashboard');
    });

    it('should toggle drawer if drawer open is different a menuDashboard when update dashboard', () => {
      component.drawerContext = 'widgetDashboard';
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
      const dataExpectModal = {
        panelClass: [
          'w-11/12',
          'sm:w-4/5',
          'h-[95%]',
          'sm:h-5/6',
          'custom-margin-modal',
        ],
        maxWidth: '1500px',
        data: {
          dashboardRithmId: dataDashboard.rithmId,
          showDetailWidgetPopover: false,
          canAssignUserWidget: component.canAssignUserWidget,
        },
      };
      const spyDialog = spyOn(
        TestBed.inject(MatDialog),
        'open'
      ).and.returnValue({
        afterClosed: () => of(false),
      } as MatDialogRef<typeof component>);
      component.openDialogAddWidget();
      expect(spyDialog).toHaveBeenCalledOnceWith(
        AddWidgetModalComponent,
        dataExpectModal
      );
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
      isEditable: false,
      canView: false,
    };
    let renderer: Renderer2;

    beforeEach(() => {
      renderer = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
    });

    it('should expand widget', () => {
      const spyRenderer = spyOn(renderer, 'addClass');
      component.dashboardDataCopy = dashboardData;
      component.dashboardData = dashboardData;
      component.toggleExpandWidget(0, true);

      expect(component.dashboardData.widgets[0].rows).toEqual(3);
      expect(component.dashboardData.widgets[0].layerIndex).toEqual(2);
      expect(spyRenderer).toHaveBeenCalled();
    });

    it('should not expand widget', () => {
      const spyRenderer = spyOn(renderer, 'removeClass');
      component.dashboardDataCopy = dashboardData;
      component.dashboardData = dashboardData;
      component.toggleExpandWidget(0, false);

      expect(component.dashboardData.widgets[0].layerIndex).toEqual(1);
      expect(component.dashboardData).toEqual(component.dashboardDataCopy);
      expect(spyRenderer).toHaveBeenCalled();
    });
  });

  it('should update dashboard widgets', () => {
    const quantityElementsWidget = 2;
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
    const spyMethod = spyOn(component, 'updateDashboardWidget');
    const expectEditDataWidget = {
      widgetItem: dataDashboard.widgets[0],
      widgetIndex: 1,
      quantityElementsWidget,
    };

    dashboardService.updateDashboardWidgets(expectEditDataWidget);

    expect(spyMethod).toHaveBeenCalledOnceWith(expectEditDataWidget);
  });

  it('should emit DashboardService.isLoadingDashboard$ and call getParams', () => {
    const spyRoute = spyOn(TestBed.inject(ActivatedRoute).params, 'subscribe');
    dashboardService.toggleLoadingDashboard(true, true);
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
          widgetType: WidgetType.StationGroupSearch,
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
      isEditable: false,
      canView: false,
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
    component.dashboardData.isEditable = true;
    fixture.detectChanges();
    spyOnProperty(component, 'isAdmin').and.returnValue(true);
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
      isEditable: false,
      canView: false,
    };
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('#add-widget-button');
    expect(btn).toBeNull();
  });

  it('should show buttons and input when editMode is true and show new dashboard', () => {
    component.editMode = true;
    component.isLoading = false;
    component.errorLoadingDashboard = false;
    component.isCreateNewDashboard = false;
    fixture.detectChanges();
    const inputNameDashboard = fixture.debugElement.nativeElement.querySelector(
      '#name-dashboard-input'
    );
    const buttonSave =
      fixture.debugElement.nativeElement.querySelector('#save-button');
    const buttonCancel =
      fixture.debugElement.nativeElement.querySelector('#cancel-button');

    expect(inputNameDashboard).toBeTruthy();
    expect(buttonSave).toBeTruthy();
    expect(buttonCancel).toBeTruthy();
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;

    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
    });

    it('should call split service and treatments', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      // showButtonSetting
      const spyGetConfigWidgetsTreatment = spyOn(
        splitService,
        'getConfigWidgetsTreatment'
      ).and.callThrough();
      // isAddWidget
      const spyGetDashboardLibraryTreatment = spyOn(
        splitService,
        'getDashboardLibraryTreatment'
      ).and.callThrough();
      //canAssignUserStationTableWidget
      const spyGetAssignUserStationTableWidgetTreatment = spyOn(
        splitService,
        'getAssignUserWidgetTreatment'
      ).and.callThrough();

      splitService.sdkReady$.next();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(spyGetConfigWidgetsTreatment).toHaveBeenCalled();
      expect(spyGetDashboardLibraryTreatment).toHaveBeenCalled();
      expect(spyGetAssignUserStationTableWidgetTreatment).toHaveBeenCalled();
      expect(component.isAddWidget).toBeTrue();
      expect(component.showButtonSetting).toBeTrue();
      expect(component.canAssignUserWidget).toBeTrue();
      expect(component.showDetailWidgetPopover).toBeTrue();
    });

    it('should catch split error ', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      splitService.sdkReady$.error('error');
      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(errorService).toHaveBeenCalled();
      expect(component.isAddWidget).toBeFalse();
      expect(component.showButtonSetting).toBeFalse();
      expect(component.showDetailWidgetPopover).toBeFalse();
      expect(component.canAssignUserWidget).toBeFalse();
    });
  });

  it('should parse dashboard data to widgets rithmId', () => {
    const widgetItem = {
      rithmId: 'TEMPID-147cf568-27a4-4968-5628-046ccfee24fd',
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
    component.dashboardData.widgets = [widgetItem];
    const expectedData = component['parseDashboardData']();
    expect(expectedData.widgets[0].rithmId).toEqual('');
  });

  it('should set config breakpoint for mobile devices', () => {
    spyOnProperty(
      TestBed.inject(MobileBrowserChecker),
      'isMobileDevice'
    ).and.returnValue(true);
    component.ngOnInit();
    expect(component.options.mobileBreakpoint).toBe(1920);
  });

  it('should set config breakpoint for not mobile devices', () => {
    component.ngOnInit();
    expect(component.options.mobileBreakpoint).toBe(640);
  });

  it('should get and set config when init live cycle component and nor mobile device', () => {
    const spyChangeGridster = spyOn(
      component,
      'changedOptions'
    ).and.callThrough();
    component.ngOnInit();
    expect(component.options.mobileBreakpoint).toBe(640);
    expect(spyChangeGridster).toHaveBeenCalled();
  });

  it('should get and set config when init live cycle component and yes mobile device', () => {
    const spyChangeGridster = spyOn(
      component,
      'changedOptions'
    ).and.callThrough();
    spyOnProperty(
      TestBed.inject(MobileBrowserChecker),
      'isMobileDevice'
    ).and.returnValue(true);
    component.ngOnInit();
    expect(component.options.mobileBreakpoint).toBe(1920);
    expect(spyChangeGridster).toHaveBeenCalled();
  });

  it('should show editMode button when user=admin and type=Company', () => {
    component.editMode = false;
    component.isLoading = false;
    component.isCreateNewDashboard = false;
    component.errorLoadingDashboard = false;
    component.dashboardData.type = RoleDashboardMenu.Company;
    spyOnProperty(component, 'isAdmin').and.returnValue(true);
    fixture.detectChanges();
    const editMode = fixture.nativeElement.querySelector('#menu-edit-button');
    expect(editMode).toBeTruthy();
  });

  it('should show editMode button when user=admin and type=personal', () => {
    component.editMode = false;
    component.isLoading = false;
    component.isCreateNewDashboard = false;
    component.errorLoadingDashboard = false;
    component.dashboardData.type = RoleDashboardMenu.Personal;
    spyOnProperty(component, 'isAdmin').and.returnValue(true);
    fixture.detectChanges();
    const editMode = fixture.nativeElement.querySelector('#menu-edit-button');
    expect(editMode).toBeTruthy();
  });

  it('should validate getQueryParams when user=admin', fakeAsync(() => {
    spyOnProperty(component, 'isAdmin').and.returnValue(true);
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

  it('should validate getQueryParams when user=!admin and type=personal', fakeAsync(() => {
    component.dashboardData.type = RoleDashboardMenu.Personal;
    component.dashboardData.isEditable = true;
    fixture.detectChanges();
    spyOnProperty(component, 'isAdmin').and.returnValue(false);
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

  it('should get default dashboard', () => {
    const spyService = spyOn(
      dashboardService,
      'getDashboardWidgets'
    ).and.callThrough();

    component['getDefaultDashboard']();

    expect(spyService).toHaveBeenCalledOnceWith(
      userService.user.defaultDashboardId as string
    );
  });

  it('should not get default dashboard', () => {
    spyOnProperty(userService, 'user').and.returnValue({
      rithmId: '123',
      firstName: 'Testy',
      lastName: 'Test',
      email: 'test@test.com',
      isEmailVerified: true,
      notificationSettings: null,
      createdDate: '1/2/34',
      role: null,
      organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
      profileImageRithmId: '123-456-789',
      defaultDashboardType: '',
      defaultDashboardId: '',
    });
    const spyService = spyOn(
      dashboardService,
      'getOrganizationDashboard'
    ).and.callThrough();

    component['getDefaultDashboard']();

    expect(spyService).toHaveBeenCalled();
  });

  it('should set null dashboard default to user', () => {
    const spyService = spyOn(userService, 'updateUserAccount').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const errorService = spyOn(
      TestBed.inject(ErrorService),
      'logError'
    ).and.callThrough();

    component['setNullDashboardUser']();

    expect(spyService).toHaveBeenCalledOnceWith({
      defaultDashboardType: '',
      defaultDashboardId: '',
    });
    expect(errorService).toHaveBeenCalled();
  });
});
