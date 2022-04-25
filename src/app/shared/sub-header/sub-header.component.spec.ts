import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

import { SubHeaderComponent } from './sub-header.component';

describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubHeaderComponent],
      imports: [MatTabsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the method that change tabs to Container tab.', () => {
    const tabsLabel = {
      tab: { textLabel: 'Container' },
    } as MatTabChangeEvent;
    const spyTabsChange = spyOn(
      component,
      'tabSelectedChanged'
    ).and.callThrough();
    component.tabSelectedChanged(tabsLabel);
    expect(spyTabsChange).toHaveBeenCalledWith(tabsLabel);
  });

  it('should call the method that change tabs to Rules tab.', () => {
    const tabsIndex = {
      tab: { textLabel: 'Rules' },
    } as MatTabChangeEvent;
    const spyTabsChange = spyOn(
      component,
      'tabSelectedChanged'
    ).and.callThrough();
    component.tabSelectedChanged(tabsIndex);
    expect(spyTabsChange).toHaveBeenCalledWith(tabsIndex);
  });

  it('should call the method that change tabs to Settings tab.', () => {
    const tabsIndex = {
      tab: { textLabel: 'Settings' },
    } as MatTabChangeEvent;
    const spyTabsChange = spyOn(
      component,
      'tabSelectedChanged'
    ).and.callThrough();
    component.tabSelectedChanged(tabsIndex);
    expect(spyTabsChange).toHaveBeenCalledWith(tabsIndex);
  });
});
