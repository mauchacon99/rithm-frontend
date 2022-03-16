import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentWidgetTemplateModalComponent } from './document-widget-template-modal.component';
import { MockDashboardService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

describe('DocumentWidgetTemplateModalComponent', () => {
  let component: DocumentWidgetTemplateModalComponent;
  let fixture: ComponentFixture<DocumentWidgetTemplateModalComponent>;

  const widgetType = 'defaultDocument';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentWidgetTemplateModalComponent],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWidgetTemplateModalComponent);
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
