import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineWidgetComponent } from './headline-widget.component';

describe('HeadlineWidgetComponent', () => {
  let component: HeadlineWidgetComponent;
  let fixture: ComponentFixture<HeadlineWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeadlineWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadlineWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should evaluate the function that open setting drawer', () => {
    const spySettingDrawer = spyOn(
      component,
      'openFieldSettingDrawer'
    ).and.callThrough();
    component.openFieldSettingDrawer(component.headlineTextValue);
    expect(spySettingDrawer).toHaveBeenCalledOnceWith(
      component.headlineTextValue
    );
  });

  it('should emit event openSettingDrawer', () => {
    component.widgetMode = 'setting';
    const spyEmit = spyOn(component.openSettingDrawer, 'emit');
    component.openFieldSettingDrawer(component.headlineTextValue);
    expect(spyEmit).toHaveBeenCalledWith(component.headlineTextValue);
  });
});
