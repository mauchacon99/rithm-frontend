import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviouslyStartedDocumentsComponent } from './previously-started-documents.component';

describe('PreviouslyStartedDocumentsComponent', () => {
  let component: PreviouslyStartedDocumentsComponent;
  let fixture: ComponentFixture<PreviouslyStartedDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviouslyStartedDocumentsComponent ]
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
});
