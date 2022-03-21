import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupHierarchyComponent } from './group-hierarchy.component';

describe('GroupHierarchyComponent', () => {
  let component: GroupHierarchyComponent;
  let fixture: ComponentFixture<GroupHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupHierarchyComponent],
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
});
