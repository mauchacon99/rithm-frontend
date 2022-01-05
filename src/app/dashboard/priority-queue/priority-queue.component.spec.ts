import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { DashboardService } from '../dashboard.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockDashboardService, MockPopupService } from 'src/mocks';
import { DocumentListCardComponent } from '../document-list-card/document-list-card.component';

import { PriorityQueueComponent } from './priority-queue.component';

describe('PriorityQueueComponent', () => {
  let component: PriorityQueueComponent;
  let fixture: ComponentFixture<PriorityQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PriorityQueueComponent,
        MockComponent(DocumentListCardComponent),
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return priority queue documents', () => {
    expect(component.priorityQueueDocuments.length).toBeGreaterThanOrEqual(0);
  });
});
