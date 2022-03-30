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

  const subStationGroups: StationGroupData = {
    rithmId: '1375027-78345-73824-54244',
    title: 'Sub Station Group',
    subStationGroups: [],
    stations: [],
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

  const stations: StationListGroup = {
    rithmId: '123-321-456',
    name: 'station 1',
    workers: [
      {
        rithmId: '123-321-456',
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
  };

  const stationGroupData: StationGroupData = {
    rithmId: '6375027-78345-73824-54244',
    title: 'Station Group',
    subStationGroups: [subStationGroups],
    stations: [stations],
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
    const spyMethod = spyOn(
      TestBed.inject(StationService),
      'getStationGroups'
    ).and.callThrough();
    component['getStationGroups']();
    fixture.detectChanges();
    const loader = fixture.debugElement.nativeElement.querySelector(
      '#loader-groups-hierarchy'
    );
    expect(spyMethod).toHaveBeenCalled();
    expect(loader).toBeTruthy();
    expect(component.isLoading).toBeTrue();
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
    fixture.detectChanges();
    const method = spyOn(component, 'selectedListItem');
    const itemGroup = fixture.nativeElement.querySelector(
      '#group-item-' + subStationGroups.rithmId
    );
    expect(itemGroup).toBeTruthy();
    itemGroup.click();
    expect(method).toHaveBeenCalled();
  });

  it('should clicked in item station', () => {
    component.isLoading = false;
    component.isErrorGetGroups = false;
    fixture.detectChanges();
    const method = spyOn(component, 'selectedListItem');
    const itemStation = fixture.nativeElement.querySelector(
      '#station-item-' + stations.rithmId
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
});
