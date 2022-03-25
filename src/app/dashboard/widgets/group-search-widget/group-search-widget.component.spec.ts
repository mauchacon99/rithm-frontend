import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MockComponent } from 'ng-mocks';
import { throwError } from 'rxjs';

import { GroupSearchWidgetComponent } from './group-search-widget.component';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { StationGroupData } from 'src/models/station-group-data';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { StationComponent } from 'src/app/station/station/station.component';

describe('GroupSearchWidgetComponent', () => {
  let component: GroupSearchWidgetComponent;
  let fixture: ComponentFixture<GroupSearchWidgetComponent>;
  const dataWidget =
    // eslint-disable-next-line max-len
    '{"stationGroupRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168"}';

  const dataStationGroupWidget: StationGroupData = {
    rithmId: '6375027-78345-73824-54244',
    title: 'Station Group',
    subStationGroups: [
      {
        rithmId: '2375027-78345-73824-54244',
        title: 'substation Group',
        subStationGroups: [],
        stations: [
          {
            rithmId: '5237520-7837-78378-78378',
            name: 'StationName',
            workers: [],
            stationOwners: [],
          },
        ],
        admins: [],
        users: [],
        isChained: true,
        isImplicitRootStationGroup: true,
      },
    ],
    stations: [
      {
        rithmId: '3237520-7837-78378-78378',
        name: 'StationName',
        workers: [],
        stationOwners: [],
      },
      {
        rithmId: '9267520-4837-78378-78378',
        name: 'StationName 2',
        workers: [],
        stationOwners: [],
      },
      {
        rithmId: '1237620-2837-78378-78378',
        name: 'StationName 3',
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
        MockComponent(StationDocumentsModalComponent),
      ],
      imports: [
        MatInputModule,
        NoopAnimationsModule,
        FormsModule,
        MatDialogModule,
        RouterTestingModule.withRoutes([
          {
            path: 'station/:stationId',
            component: MockComponent(StationComponent),
          },
        ]),
      ],
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
    component.dataStationGroup = dataStationGroupWidget;
    component.stations = dataStationGroupWidget.stations;
    component.subStationGroupData = dataStationGroupWidget.subStationGroups;
    component.isLoading = false;
    component.errorStationGroup = false;
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
    component.subStationGroupData = [];
    component.isLoading = false;
    component.errorStationGroup = false;
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

  it('should search stations and substations', () => {
    component.dataStationGroup = dataStationGroupWidget;
    component.stations = dataStationGroupWidget.stations;
    component.subStationGroupData = dataStationGroupWidget.subStationGroups;
    component.isLoading = false;
    component.errorStationGroup = false;
    component.search = 'stationName 3';
    fixture.detectChanges();
    const expectedStation = [
      {
        rithmId: '1237620-2837-78378-78378',
        name: 'StationName 3',
        workers: [],
        stationOwners: [],
      },
    ];
    component.searchStation();
    expect(component.stations).toEqual(expectedStation);

    component.search = 'substation group';
    fixture.detectChanges();

    const expectedSubStation = [
      {
        rithmId: '2375027-78345-73824-54244',
        title: 'substation Group',
        subStationGroups: [],
        stations: [
          {
            rithmId: '5237520-7837-78378-78378',
            name: 'StationName',
            workers: [],
            stationOwners: [],
          },
        ],
        admins: [],
        users: [],
        isChained: true,
        isImplicitRootStationGroup: true,
      },
    ];
    component.searchStation();
    expect(component.subStationGroupData).toEqual(expectedSubStation);
  });

  it('should executed modal for render documents the specific station', () => {
    const expectData = {
      minWidth: '370px',
      data: {
        stationName: dataStationGroupWidget.stations[0].name,
        stationId: dataStationGroupWidget.stations[0].rithmId,
      },
    };
    const spyModal = spyOn(TestBed.inject(MatDialog), 'open');
    component.openDocsModal(dataStationGroupWidget.stations[0]);
    expect(spyModal).toHaveBeenCalledOnceWith(
      StationDocumentsModalComponent,
      expectData
    );
  });

  it('should not show modal when edit mode is active', () => {
    component.editMode = true;
    const expectData = {
      minWidth: '370px',
      data: {
        stationName: dataStationGroupWidget.stations[0].name,
        stationId: dataStationGroupWidget.stations[0].rithmId,
      },
    };
    const spyModal = spyOn(TestBed.inject(MatDialog), 'open');
    component.openDocsModal(dataStationGroupWidget.stations[0]);
    expect(spyModal).not.toHaveBeenCalledOnceWith(
      StationDocumentsModalComponent,
      expectData
    );
  });

  it('should redirect to station', async () => {
    component.isLoading = false;
    component.errorStationGroup = false;
    component.stations = dataStationGroupWidget.stations;
    fixture.detectChanges();
    const btnRedirectStation = fixture.debugElement.nativeElement.querySelector(
      '#link-station-button-' + dataStationGroupWidget.stations[0].rithmId
    );
    expect(btnRedirectStation).toBeTruthy();
    await btnRedirectStation.click();
    expect(TestBed.inject(Location).path()).toEqual(
      `/station/${dataStationGroupWidget.stations[0].rithmId}`
    );
  });

  it('should disable button redirect to station when editMode is true', async () => {
    component.isLoading = false;
    component.errorStationGroup = false;
    component.editMode = true;
    component.stations = dataStationGroupWidget.stations;
    fixture.detectChanges();
    const btnRedirectStation = fixture.debugElement.nativeElement.querySelector(
      '#link-station-button-' + dataStationGroupWidget.stations[0].rithmId
    );
    expect(btnRedirectStation).toBeTruthy();
    expect(btnRedirectStation.disabled).toBeTrue();
  });
});
