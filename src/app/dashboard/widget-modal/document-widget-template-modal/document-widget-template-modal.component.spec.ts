import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentWidgetTemplateModalComponent } from './document-widget-template-modal.component';

describe('DocumentWidgetTemplateModalComponent', () => {
  let component: DocumentWidgetTemplateModalComponent;
  let fixture: ComponentFixture<DocumentWidgetTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentWidgetTemplateModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWidgetTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
