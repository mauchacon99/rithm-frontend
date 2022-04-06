import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTrafficWidgetComponent } from './group-traffic-widget.component';

describe('GroupTrafficWidgetComponent', () => {
  let component: GroupTrafficWidgetComponent;
  let fixture: ComponentFixture<GroupTrafficWidgetComponent>;
  const dataWidget =
    '{"stationGroupRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168"}';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupTrafficWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTrafficWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
