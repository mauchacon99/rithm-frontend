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
import { NgChartsModule } from 'ng2-charts';

describe('GroupTrafficWidgetComponent', () => {
  let component: GroupTrafficWidgetComponent;
  let fixture: ComponentFixture<GroupTrafficWidgetComponent>;
  let stationService: StationService;
  let dashboardService: DashboardService;
  let errorService: ErrorService;
  const dataWidget =
    '{"stationGroupRithmId":"7f0611fe-dfd2-42ec-9e06-9f4e4e0b24bb", "valueShowGraphic":"5"}';
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
    averageDocumentFlow: [3000, 72000, 60, 2880, 10080],
    averageDocumentFlowLabels: [
      '2 days',
      '7 weeks',
      '1 hour',
      '2 days',
      '1 weeks',
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GroupTrafficWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      imports: [NgChartsModule],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    stationService = TestBed.inject(StationService);
    dashboardService = TestBed.inject(DashboardService);
    errorService = TestBed.inject(ErrorService);
    fixture = TestBed.createComponent(GroupTrafficWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
    component.widgetItem = widgetItem;
    component.indexWidget = 1;
    component.groupTrafficData = dataGroupTraffic;
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
    spyOn(stationService, 'getGroupTrafficData').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(errorService, 'logError').and.callThrough();
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

  it('should set config chart', () => {
    const {
      labels,
      averageDocumentFlow,
      stationDocumentCounts,
      averageDocumentFlowLabels,
    } = dataGroupTraffic;

    component['setConfigChart']();
    expect(component.configChart.data.labels).toEqual(labels);
    expect(component.configChart.data.datasets[0].data).toEqual(
      stationDocumentCounts
    );
    expect(component.configChart.data.datasets[1].data).toEqual(
      averageDocumentFlow
    );
    expect(component.configChart.data.datasets[1].label).toEqual(
      JSON.stringify(averageDocumentFlowLabels || [])
    );
  });

  it('should call setTooltips and plugins should be object', () => {
    component['setTooltips']();

    expect(typeof component.configChart.options?.plugins).toEqual('object');
  });

  describe('Paginate chart', () => {
    beforeEach(() => {
      component.isLoading = false;
      component.errorGroupTraffic = false;
      component.editMode = false;
      component.valueShowGraphic = 5;
    });

    it('should paginate next', () => {
      component.paginationChart = 0;
      fixture.detectChanges();
      const spyPaginateMethod = spyOn(component, 'paginate').and.callThrough();

      const btnNext = fixture.debugElement.nativeElement.querySelector(
        '#next-paginate-button'
      );
      expect(btnNext).toBeTruthy();
      btnNext.disabled = false;
      btnNext.click();

      expect(component.paginationChart).toEqual(component.valueShowGraphic);
      expect(spyPaginateMethod).toHaveBeenCalledOnceWith('next');
    });

    it('should paginate previous', () => {
      component.paginationChart = 5;
      fixture.detectChanges();
      const spyPaginateMethod = spyOn(component, 'paginate').and.callThrough();

      const btnPrevious = fixture.debugElement.nativeElement.querySelector(
        '#previous-paginate-button'
      );
      expect(btnPrevious).toBeTruthy();
      btnPrevious.click();

      expect(component.paginationChart).toEqual(0);
      expect(spyPaginateMethod).toHaveBeenCalledOnceWith('previous');
    });
  });
});
