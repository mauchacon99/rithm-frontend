import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GroupHierarchyComponent } from './group-hierarchy.component';

describe('GroupHierarchyComponent', () => {
  let component: GroupHierarchyComponent;
  let fixture: ComponentFixture<GroupHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupHierarchyComponent],
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
});
