import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardService } from '../dashboard.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockDashboardService, MockPopupService } from 'src/mocks';
import { MockComponent } from 'ng-mocks';

import { PreviouslyStartedDocumentsComponent } from './previously-started-documents.component';
import { DocumentListCardComponent } from '../document-list-card/document-list-card.component';

describe('PreviouslyStartedDocumentsComponent', () => {
  let component: PreviouslyStartedDocumentsComponent;
  let fixture: ComponentFixture<PreviouslyStartedDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PreviouslyStartedDocumentsComponent,
        MockComponent(DocumentListCardComponent),
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviouslyStartedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return previously started documents', () => {
    expect(component.previouslyStartedDocuments.length).toBeGreaterThanOrEqual(
      0
    );
  });
});
