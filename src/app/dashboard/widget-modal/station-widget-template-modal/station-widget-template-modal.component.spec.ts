import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationWidgetTemplateModalComponent } from './station-widget-template-modal.component';
import { MockDashboardService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

describe('StationWidgetTemplateModalComponent', () => {
  let component: StationWidgetTemplateModalComponent;
  let fixture: ComponentFixture<StationWidgetTemplateModalComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
