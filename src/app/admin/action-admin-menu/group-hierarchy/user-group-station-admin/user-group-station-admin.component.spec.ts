import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationListGroup, StationGroupData } from 'src/models';

import { UserGroupStationAdminComponent } from './user-group-station-admin.component';

describe('UserGroupStationAdminComponent', () => {
  let component: UserGroupStationAdminComponent;
  let fixture: ComponentFixture<UserGroupStationAdminComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserGroupStationAdminComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupStationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should  return true or false in isGroup', () => {
    component.selectedItem = stations;
    const result = component.isGroup;
    expect(result).toBeFalse();
    component.selectedItem = subStationGroups;
    const result2 = component.isGroup;
    expect(result2).toBeTrue();
  });
});
