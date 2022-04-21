import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreBuiltWidgetTemplateModalComponent } from './pre-built-widget-template-modal.component';

import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MockDashboardService } from 'src/mocks';
import { WidgetType } from 'src/models';

describe('PreBuiltWidgetTemplateModalComponent', () => {
  let component: PreBuiltWidgetTemplateModalComponent;
  let fixture: ComponentFixture<PreBuiltWidgetTemplateModalComponent>;
  const widgetType = WidgetType.Station;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreBuiltWidgetTemplateModalComponent],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreBuiltWidgetTemplateModalComponent);
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
