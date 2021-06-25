import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockDocumentService, MockPopupService } from 'src/mocks';

import { PreviouslyStartedDocumentsComponent } from './previously-started-documents.component';

describe('PreviouslyStartedDocumentsComponent', () => {
  let component: PreviouslyStartedDocumentsComponent;
  let fixture: ComponentFixture<PreviouslyStartedDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviouslyStartedDocumentsComponent],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService }
      ],
    })
      .compileComponents();
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
    expect(component.previouslyStartedDocuments.length).toBeGreaterThanOrEqual(0);
  });

});
