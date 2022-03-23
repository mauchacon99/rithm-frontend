import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';

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
      imports: [MatInputModule, NoopAnimationsModule],
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
});
