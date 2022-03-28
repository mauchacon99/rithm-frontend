import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
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
      declarations: [GroupListHierarchyComponent],
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
    expect(spyService).toHaveBeenCalledOnceWith('');
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

  it('should clicked in item', () => {
    const method = spyOn(component, 'selectedListItem');
    const itemGroup = fixture.nativeElement.querySelector(
      '#group-item-' + subStationGroups.rithmId
    );
    itemGroup.click();
    expect(method).toHaveBeenCalled();
    const itemStation = fixture.nativeElement.querySelector(
      '#station-item-' + stations.rithmId
    );
    itemStation.click();
    expect(method).toHaveBeenCalled();
  });

  it('should emit value and type when selected item', () => {
    const method = spyOn(component, 'selectedListItem').and.callThrough();
    const getSelectedItem = spyOn(component.getSelectedItem, 'emit');
    const getTypeSelectedItem = spyOn(component.getTypeSelectedItem, 'emit');
    component.selectedListItem(subStationGroups, 'group');
    expect(method).toHaveBeenCalled();
    expect(getSelectedItem).toHaveBeenCalledOnceWith(subStationGroups);
    expect(getTypeSelectedItem).toHaveBeenCalledOnceWith('group');
  });
});
