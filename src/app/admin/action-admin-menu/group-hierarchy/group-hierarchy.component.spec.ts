import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { ComingSoonMessageModule } from 'src/app/shared/coming-soon-message/coming-soon-message.module';
import { StationGroupData, StationListGroup } from 'src/models';

import { GroupHierarchyComponent } from './group-hierarchy.component';
import { GroupListHierarchyComponent } from './group-list-hierarchy/group-list-hierarchy.component';
import { UserGroupStationAdminComponent } from './user-group-station-admin/user-group-station-admin.component';

describe('GroupHierarchyComponent', () => {
  let component: GroupHierarchyComponent;
  let fixture: ComponentFixture<GroupHierarchyComponent>;

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
      declarations: [
        GroupHierarchyComponent,
        MockComponent(GroupListHierarchyComponent),
        MockComponent(UserGroupStationAdminComponent),
      ],
      imports: [MatInputModule, NoopAnimationsModule, ComingSoonMessageModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show group hierarchy menu when show variable is true', () => {
    component.showGroupHierarchy = true;
    const sectionGroupHierarchy =
      fixture.debugElement.nativeElement.querySelector('#group-hierarchy');
    const sectionPermissionDenied =
      fixture.debugElement.nativeElement.querySelector('#permissionDenied');
    expect(sectionGroupHierarchy).toBeDefined();
    expect(sectionPermissionDenied).toBeNull();
  });
  it('should not show group hierarchy menu when show variable is false', () => {
    component.showGroupHierarchy = false;
    const sectionGroupHierarchy =
      fixture.debugElement.nativeElement.querySelector('#group-hierarchy');
    const sectionPermissionDenied =
      fixture.debugElement.nativeElement.querySelector(
        '#group-hierarchy-permission-denied'
      );
    expect(sectionGroupHierarchy).toBeNull();
    expect(sectionPermissionDenied).toBeDefined();
  });

  it('should push new columns to columnsStationGroupRithmId', () => {
    const spyPush = spyOn(
      component.columnsStationGroupRithmId,
      'push'
    ).and.callThrough();
    const spySplice = spyOn(
      component.columnsStationGroupRithmId,
      'splice'
    ).and.callThrough();

    component.setSelectItem(subStationGroups, 0);
    expect(spyPush).toHaveBeenCalledOnceWith(subStationGroups.rithmId);
    expect(spySplice).toHaveBeenCalled();
    expect(component.columnsStationGroupRithmId.at(1)).toEqual(
      subStationGroups.rithmId
    );
    expect(component.selectedItem).toEqual(subStationGroups);
  });

  it('should return true or false in isGroup', () => {
    component.selectedItem = stations;
    const result = component.isGroup;
    expect(result).toBeFalse();
    component.selectedItem = subStationGroups;
    const result2 = component.isGroup;
    expect(result2).toBeTrue();
  });
});
