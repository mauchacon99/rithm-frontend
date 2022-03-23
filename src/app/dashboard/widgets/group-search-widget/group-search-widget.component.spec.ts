import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { GroupSearchWidgetComponent } from './group-search-widget.component';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { MockComponent } from 'ng-mocks';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { StationGroupData } from 'src/models/station-group-data';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GroupSearchWidgetComponent', () => {
  let component: GroupSearchWidgetComponent;
  let fixture: ComponentFixture<GroupSearchWidgetComponent>;
  const dataWidget =
    // eslint-disable-next-line max-len
    '{"stationGroupRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168"}';

  const dataStationGroupWidget: StationGroupData = {
    rithmId: '6375027-78345-73824-54244',
    title: 'Station Group',
    subStationGroups: [],
    stations: [
      {
        rithmId: '3237520-7837-78378-78378',
        name: 'StationName',
        workers: [],
        stationOwners: [],
      },
    ],
    admins: [],
    users: [],
    isChained: true,
    isImplicitRootStationGroup: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GroupSearchWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      imports: [MatInputModule, NoopAnimationsModule, FormsModule],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSearchWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
    component.dataStationGroup = dataStationGroupWidget;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station data', () => {
    const spyService = spyOn(
      TestBed.inject(StationService),
      'getStationGroups'
    ).and.callThrough();
    const expectData = JSON.parse(dataWidget).stationGroupRithmId;
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith(expectData);
  });

  it('should show error message when request station document  data', () => {
    spyOn(TestBed.inject(StationService), 'getStationGroups').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    const errorElement = fixture.debugElement.nativeElement.querySelector(
      '#error-load-widget-station-group'
    );
    expect(errorElement).toBeTruthy();
    expect(component.errorStationGroup).toBeTrue();
    expect(spyService).toHaveBeenCalled();
  });

  it('should rendered component loading for widget', () => {
    component.isLoading = true;
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
      '#app-loading-indicator-station-group'
    );
    expect(loadingIndicator).toBeTruthy();
    expect(component.isLoading).toBeTrue();
  });

  it('should show list of stations groups', () => {
    component.dataStationGroup.stations.push({
      rithmId: '3237520-7837-78378-78378',
      name: 'StationName',
      workers: [],
      stationOwners: [],
    });
    fixture.detectChanges();
    const listStations = fixture.debugElement.nativeElement.querySelector(
      '#list-stations-groups'
    );
    const stationGroupsEmpty = fixture.debugElement.nativeElement.querySelector(
      '#station-group-empty'
    );
    expect(listStations).toBeTruthy();
    expect(stationGroupsEmpty).toBeNull();
  });

  it('should show message list of stations groups empty', () => {
    component.dataStationGroup = dataStationGroupWidget;
    component.stations = [];
    component.isLoading = false;
    component.errorStationGroup = false;
    component.dataStationGroup.stations = [];
    fixture.detectChanges();
    const listStations = fixture.debugElement.nativeElement.querySelector(
      '#list-stations-groups'
    );
    const stationGroupsEmpty = fixture.debugElement.nativeElement.querySelector(
      '#station-group-empty'
    );
    expect(listStations).toBeNull();
    expect(stationGroupsEmpty).toBeTruthy();
  });

  it('should search stations', () => {
    component.isLoading = false;
    component.errorStationGroup = false;
    component.search = 'StationName 3';
    fixture.detectChanges();
    const expectedStation = [
      {
        rithmId: '3237520-7837-78378-78378',
        name: 'StationName',
        workers: [],
        stationOwners: [],
      },
    ];
    component.searchStation();
    expect(component.stations).toEqual(expectedStation);
  });
});
