import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { GroupListHierarchyComponent } from './group-list-hierarchy.component';
import { StationGroupData } from '../../../../../models';

describe('GroupListHierarchyComponent', () => {
  let component: GroupListHierarchyComponent;
  let fixture: ComponentFixture<GroupListHierarchyComponent>;
  let stationService: StationService;
  const stationGroupData: StationGroupData = {
    rithmId: '6375027-78345-73824-54244',
    title: 'Station Group',
    subStationGroups: [
      {
        rithmId: '1375027-78345-73824-54244',
        title: 'Sub Station Group',
        subStationGroups: [],
        stations: [
          {
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
          },
        ],
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
      },
    ],
    stations: [
      {
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
      },
    ],
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

  it('should emit selectedGroupRithmId', () => {
    const spyEmit = spyOn(
      component.selectedGroupRithmId,
      'emit'
    ).and.callThrough();
    component.selectGroup(stationGroupData);
    expect(spyEmit).toHaveBeenCalledOnceWith(stationGroupData.rithmId);
  });
});
