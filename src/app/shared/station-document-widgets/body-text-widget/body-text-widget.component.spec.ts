import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyTextWidgetComponent } from './body-text-widget.component';

describe('BodyTextWidgetComponent', () => {
  let component: BodyTextWidgetComponent;
  let fixture: ComponentFixture<BodyTextWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyTextWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyTextWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event openSettingDrawer', () => {
    component.widgetMode = 'setting';
    const spyEmit = spyOn(component.openSettingDrawer, 'emit');
    const field = component.bodyTextValue;
    component.handleOpenSettingDrawer(field);
    expect(spyEmit).toHaveBeenCalledWith(field);
  });
});
