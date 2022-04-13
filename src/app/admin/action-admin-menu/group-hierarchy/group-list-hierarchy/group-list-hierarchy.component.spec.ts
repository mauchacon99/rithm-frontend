import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { MatListModule } from '@angular/material/list';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockErrorService, MockStationService } from 'src/mocks';
import { StationGroupData, StationListGroup } from 'src/models';

import { GroupListHierarchyComponent } from './group-list-hierarchy.component';

describe('GroupListHierarchyComponent', () => {
  let component: GroupListHierarchyComponent;
  let fixture: ComponentFixture<GroupListHierarchyComponent>;
  let stationService: StationService;

  const stations: StationListGroup[] = [
    {
      rithmId: '1237620-2837-78378-78378',
      name: 'station 1',
      totalDocuments: 3,
      workers: [
        {
          rithmId: '1237620-2837-78378-78378',
          firstName: 'John',
          lastName: 'Wayne',
          email: 'name@company.com',
          isWorker: true,
          isOwner: true,
        },
      ],
      stationOwners: [
        {
          rithmId: '789-798-456',
          firstName: 'Peter',
          lastName: 'Doe',
          email: 'name1@company.com',
          isWorker: true,
          isOwner: true,
        },
      ],
    },
    {
      rithmId: '1237620-2837-78378-78378',
      name: 'StationName 3',
      totalDocuments: 3,
      workers: [
        {
          rithmId: '1237620-2837-78378-78378',
          firstName: 'John',
          lastName: 'Wayne',
          email: 'name@company.com',
          isWorker: true,
          isOwner: true,
        },
      ],
      stationOwners: [
        {
          rithmId: '789-798-456',
          firstName: 'Peter',
          lastName: 'Doe',
          email: 'name1@company.com',
          isWorker: true,
          isOwner: true,
        },
      ],
    },
  ];
  const subStationGroups: StationGroupData = {
    rithmId: '2375027-78345-73824-54244',
    title: 'substation Group',
    subStationGroups: [
      {
        rithmId: '2375027-78345-73824-54244',
        title: 'substation Group',
        subStationGroups: [],
        stations: [
          {
            rithmId: '5237520-7837-78378-78378',
            name: 'StationName',
            totalDocuments: 3,
            workers: [],
            stationOwners: [
              {
                rithmId: '789-798-456',
                firstName: 'Peter',
                lastName: 'Doe',
                email: 'name1@company.com',
                isWorker: true,
                isOwner: true,
              },
            ],
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
        rithmId: '1237620-2837-78378-78378',
        name: 'StationName 3',
        totalDocuments: 3,
        workers: [
          {
            rithmId: '1237620-2837-78378-78378',
            firstName: 'John',
            lastName: 'Wayne',
            email: 'name@company.com',
            isWorker: true,
            isOwner: true,
          },
        ],
        stationOwners: [
          {
            rithmId: '789-798-456',
            firstName: 'Peter',
            lastName: 'Doe',
            email: 'name1@company.com',
            isWorker: true,
            isOwner: true,
          },
        ],
      },
    ],
    admins: [],
    users: [],
    isChained: true,
    isImplicitRootStationGroup: true,
  };

  const stationGroupData: StationGroupData = {
    rithmId: '6375027-78345-73824-54244',
    title: 'Station Group',
    subStationGroups: [subStationGroups],
    stations: stations,
    users: [
      {
        rithmId: '789-798-456',
        firstName: 'Noah',
        lastName: 'Smith',
        email: 'name2@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
    admins: [
      {
        rithmId: '159-753-456',
        firstName: 'Taylor',
        lastName: 'Du',
        email: 'name3@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
    isChained: true,
    isImplicitRootStationGroup: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GroupListHierarchyComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [MatListModule],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListHierarchyComponent);
    component = fixture.componentInstance;
    stationService = TestBed.inject(StationService);
    component.stationGroups = stationGroupData;
    component.stationsFilter = subStationGroups.stations;
    component.groupsFilter = subStationGroups.subStationGroups;
    component.search = 'search value';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station groups data', () => {
    const spyService = spyOn(
      stationService,
      'getStationGroups'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith('', 1);
  });

  it('should show error message when request station widget document  data', () => {
    spyOn(stationService, 'getStationGroups').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should show error message when request getStationGroups fail', () => {
    const spyError = spyOn(
      TestBed.inject(StationService),
      'getStationGroups'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component['getStationGroups']();
    fixture.detectChanges();
    const showMessage =
      fixture.debugElement.nativeElement.querySelector('#failed-groups');
    expect(spyError).toHaveBeenCalled();
    expect(showMessage).toBeTruthy();
    expect(component.isErrorGetGroups).toBeTrue();
  });

  it('should show loading while request getStationGroups', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const loader = fixture.debugElement.nativeElement.querySelector(
      '#loader-groups-hierarchy'
    );
    component.isLoading = true;
    expect(component.isLoading).toBeTrue();
    expect(loader).toBeTruthy();
  });

  it('should reload getStationGroups if request fail', () => {
    component.isErrorGetGroups = true;
    fixture.detectChanges();
    const spyMethod = spyOn(
      TestBed.inject(StationService),
      'getStationGroups'
    ).and.callThrough();

    const btnTry = fixture.nativeElement.querySelector('#try-again');
    expect(btnTry).toBeTruthy();
    btnTry.click();
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should clicked in item', () => {
    component.isLoading = false;
    component.isErrorGetGroups = false;
    component.groupsFilter = subStationGroups.subStationGroups;
    component.groupsFilter.push(stationGroupData);
    fixture.detectChanges();
    const method = spyOn(component, 'selectedListItem');
    const itemGroup = fixture.nativeElement.querySelector(
      '#group-item-' + component.groupsFilter[0].rithmId
    );
    expect(itemGroup).toBeTruthy();
    itemGroup.click();
    expect(method).toHaveBeenCalled();
  });

  it('should clicked in item station', () => {
    component.isLoading = false;
    component.isErrorGetGroups = false;
    //component.stationGroupsFiltered = subStationGroups;
    //component.stationGroupsFiltered.stations.push(stations);
    fixture.detectChanges();
    const method = spyOn(component, 'selectedListItem');
    const itemStation = fixture.nativeElement.querySelector(
      '#station-item-' + component.stationsFilter[0].rithmId
    );
    expect(itemStation).toBeTruthy();
    itemStation.click();
    expect(method).toHaveBeenCalled();
  });

  it('should emit value when selected item', () => {
    const getSelectedItem = spyOn(component.getSelectedItem, 'emit');
    component.selectedListItem(subStationGroups);
    expect(getSelectedItem).toHaveBeenCalledOnceWith(subStationGroups);
  });

  it('should reload get stations group', () => {
    component.isLoading = false;
    component.isErrorGetGroups = false;
    component.stationsFilter = [];
    component.groupsFilter = [];
    const spyMethod = spyOn(component, 'getStationGroups');
    component.stationGroups = {
      rithmId: '6375027-78345-73824-54244',
      title: 'Station Group',
      subStationGroups: [],
      stations: [],
      users: [],
      admins: [],
      isChained: true,
      isImplicitRootStationGroup: true,
    };
    fixture.detectChanges();

    const btnReload = fixture.debugElement.nativeElement.querySelector(
      '#reload-get-stations-group'
    );

    expect(btnReload).toBeTruthy();
    btnReload.click();
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should search stations and substations', () => {
    component.stationGroups = subStationGroups;
    component.stationsFilter = subStationGroups.stations;
    component.groupsFilter = subStationGroups.subStationGroups;
    component.isLoading = false;
    component.isErrorGetGroups = false;
    component.search = 'stationName 3';
    fixture.detectChanges();
    const expectedStation = [
      {
        rithmId: '1237620-2837-78378-78378',
        name: 'StationName 3',
        totalDocuments: 3,
        workers: [
          {
            rithmId: '1237620-2837-78378-78378',
            firstName: 'John',
            lastName: 'Wayne',
            email: 'name@company.com',
            isWorker: true,
            isOwner: true,
          },
        ],
        stationOwners: [
          {
            rithmId: '789-798-456',
            firstName: 'Peter',
            lastName: 'Doe',
            email: 'name1@company.com',
            isWorker: true,
            isOwner: true,
          },
        ],
      },
    ];
    component.searchStationGroups();
    expect(component.stationsFilter).toEqual(expectedStation);

    fixture.detectChanges();
    component.search = 'substation Group';
    const expectedSubStation = [
      {
        rithmId: '2375027-78345-73824-54244',
        title: 'substation Group',
        subStationGroups: [],
        stations: [
          {
            rithmId: '5237520-7837-78378-78378',
            name: 'StationName',
            totalDocuments: 3,
            workers: [],
            stationOwners: [
              {
                rithmId: '789-798-456',
                firstName: 'Peter',
                lastName: 'Doe',
                email: 'name1@company.com',
                isWorker: true,
                isOwner: true,
              },
            ],
          },
        ],
        admins: [],
        users: [],
        isChained: true,
        isImplicitRootStationGroup: true,
      },
    ];
    component.searchStationGroups();
    expect(component.groupsFilter).toEqual(expectedSubStation);
  });
});
