import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSearchWidgetComponent } from './group-search-widget.component';

describe('GroupSearchWidgetComponent', () => {
  let component: GroupSearchWidgetComponent;
  let fixture: ComponentFixture<GroupSearchWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupSearchWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSearchWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
