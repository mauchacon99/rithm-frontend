import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationWidgetTemplateModalComponent } from './station-widget-template-modal.component';
import { WidgetType } from 'src/models';

describe('StationWidgetTemplateModalComponent', () => {
  let component: StationWidgetTemplateModalComponent;
  let fixture: ComponentFixture<StationWidgetTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationWidgetTemplateModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationWidgetTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit previewWidgetSelected', () => {
    const spyEmit = spyOn(
      component.previewWidgetSelected,
      'emit'
    ).and.callThrough();
    component.widgetType = WidgetType.Station;
    component.emitPreviewWidgetSelected();
    expect(spyEmit).toHaveBeenCalledOnceWith(
      component.dataTemplate[WidgetType.Station].title
    );
  });
});
