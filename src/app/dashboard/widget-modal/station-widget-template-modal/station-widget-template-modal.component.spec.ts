import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationWidgetTemplateModalComponent } from './station-widget-template-modal.component';
import { MockDashboardService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { WidgetType } from 'src/models';

describe('StationWidgetTemplateModalComponent', () => {
  let component: StationWidgetTemplateModalComponent;
  let fixture: ComponentFixture<StationWidgetTemplateModalComponent>;

  const widgetType = WidgetType.Station;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationWidgetTemplateModalComponent],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationWidgetTemplateModalComponent);
    component = fixture.componentInstance;
    component.widgetType = widgetType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data template', () => {
    const expectedDataTemplate =
      TestBed.inject(DashboardService).dataTemplatePreviewWidgetModal;
    expect(component.dataTemplate).toEqual(expectedDataTemplate);
    expect(component.dataTemplate[component.widgetType]).toEqual(
      expectedDataTemplate[widgetType]
    );
  });
});
