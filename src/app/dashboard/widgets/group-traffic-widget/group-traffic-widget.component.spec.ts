import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockDashboardService,
  MockErrorService,
  MockStationService,
} from 'src/mocks';
import { GroupTrafficWidgetComponent } from './group-traffic-widget.component';
import { throwError } from 'rxjs';
import { StationService } from 'src/app/core/station.service';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { MockComponent } from 'ng-mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { DashboardItem, GroupTrafficData, WidgetType } from 'src/models';

describe('GroupTrafficWidgetComponent', () => {
  let component: GroupTrafficWidgetComponent;
  let fixture: ComponentFixture<GroupTrafficWidgetComponent>;
  let stationService: StationService;
  let dashboardService: DashboardService;
  const dataWidget =
    '{"stationGroupRithmId":"7f0611fe-dfd2-42ec-9e06-9f4e4e0b24bb", "valueShowGraffic":"5"}';
  const widgetItem: DashboardItem = {
    rithmId: '3F73BDEA-3C7B-42B7-93A3-FA318D225DFF',
    cols: 4,
    rows: 2,
    x: 8,
    y: 8,
    widgetType: WidgetType.StationGroupTraffic,
    data: dataWidget,
    minItemRows: 2,
    maxItemRows: 12,
    minItemCols: 3,
    maxItemCols: 12,
    imageId: null,
    imageName: null,
    profileImageId: null,
  };
  const dataGroupTraffic: GroupTrafficData = {
    title: 'Group Eagle',
    stationGroupRithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
    labels: ['station 1', 'station 2', 'station 3', 'station 4', 'station 5'],
    stationDocumentCounts: [10, 5, 8, 10, 20],
    averageDocumentFlow: [2, 4, 1, 8, 9],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GroupTrafficWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTrafficWidgetComponent);
    stationService = TestBed.inject(StationService);
    dashboardService = TestBed.inject(DashboardService);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
    component.widgetItem = widgetItem;
    component.groupTrafficData = dataGroupTraffic;
    component.indexWidget = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getGroupTrafficData', () => {
    const spyMethod = spyOn(component, 'getGroupTrafficData').and.callThrough();
    const spyGetGroupTrafficData = spyOn(
      stationService,
      'getGroupTrafficData'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyGetGroupTrafficData).toHaveBeenCalled();
  });

  it('should catch an error if the request getGroupTrafficData fails', () => {
    const spyError = spyOn(
      stationService,
      'getGroupTrafficData'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });

  it('should rendered component loading for widget', () => {
    component.isLoading = true;
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
      '#app-loading-indicator-group-traffic'
    );
    expect(loadingIndicator).toBeTruthy();
  });

  it('should show error message when request group traffic data', () => {
    spyOn(
      TestBed.inject(StationService),
      'getGroupTrafficData'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(
      TestBed.inject(ErrorService),
      'logError'
    ).and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    const errorElement = fixture.debugElement.nativeElement.querySelector(
      '#error-load-widget-group-traffic'
    );
    expect(errorElement).toBeTruthy();
    expect(component.errorGroupTraffic).toBeTrue();
    expect(spyService).toHaveBeenCalled();
  });

  it('should call and show sidenavService', () => {
    const dataExpect = {
      widgetIndex: component.indexWidget,
      widgetItem: widgetItem,
      quantityElementsWidget: 5,
    };
    const spyService = spyOn(
      dashboardService,
      'updateDashboardWidgets'
    ).and.callThrough();
    component.updateDataWidget();
    expect(spyService).toHaveBeenCalledOnceWith(dataExpect);
  });
});
