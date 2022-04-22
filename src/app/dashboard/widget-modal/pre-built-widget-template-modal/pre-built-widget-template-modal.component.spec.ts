import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MockDashboardService } from 'src/mocks';
import { WidgetType } from 'src/models';
import { PreBuiltWidgetTemplateModalComponent } from './pre-built-widget-template-modal.component';

describe('PreBuiltWidgetTemplateModalComponent', () => {
  let component: PreBuiltWidgetTemplateModalComponent;
  let fixture: ComponentFixture<PreBuiltWidgetTemplateModalComponent>;
  const widgetType = WidgetType.Station;
  let dashboardService: DashboardService;
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
    dashboardService = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data template', () => {
    const expectedDataTemplate =
      dashboardService.dataTemplatePreviewWidgetModal;
    expect(component.dataTemplate).toEqual(expectedDataTemplate);
    expect(component.dataTemplate[component.widgetType]).toEqual(
      expectedDataTemplate[widgetType]
    );
  });
});
