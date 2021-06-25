import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockDocumentService, MockPopupService } from 'src/mocks';

import { PriorityQueueComponent } from './priority-queue.component';

describe('PriorityQueueComponent', () => {
  let component: PriorityQueueComponent;
  let fixture: ComponentFixture<PriorityQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriorityQueueComponent],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService }
      ],
    })
      .compileComponents();
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
