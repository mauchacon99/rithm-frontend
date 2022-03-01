import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabWidgetModalComponent } from './custom-tab-widget-modal.component';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { ErrorService } from '../../../core/error.service';

describe('CustomTabWidgetModalComponent', () => {
  let component: CustomTabWidgetModalComponent;
  let fixture: ComponentFixture<CustomTabWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomTabWidgetModalComponent],
      providers: [
        { provide: DashboardService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
