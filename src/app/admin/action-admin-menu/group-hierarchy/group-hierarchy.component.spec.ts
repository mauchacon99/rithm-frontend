import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { ComingSoonMessageModule } from 'src/app/shared/coming-soon-message/coming-soon-message.module';

import { GroupHierarchyComponent } from './group-hierarchy.component';
import { GroupListHierarchyComponent } from './group-list-hierarchy/group-list-hierarchy.component';

describe('GroupHierarchyComponent', () => {
  let component: GroupHierarchyComponent;
  let fixture: ComponentFixture<GroupHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GroupHierarchyComponent,
        MockComponent(GroupListHierarchyComponent),
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
    const expectedRithmId = '123-456-789';
    const spyPush = spyOn(
      component.columnsStationGroupRithmId,
      'push'
    ).and.callThrough();
    const spySplice = spyOn(
      component.columnsStationGroupRithmId,
      'splice'
    ).and.callThrough();

    component.onSelectStationGroupRithmId(expectedRithmId, 0);
    expect(spyPush).toHaveBeenCalledOnceWith(expectedRithmId);
    expect(spySplice).toHaveBeenCalled();
    expect(component.columnsStationGroupRithmId.at(1)).toEqual(expectedRithmId);
  });
});
