import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentInfoHeaderComponent } from './document-info-header.component';

describe('DocumentInfoHeaderComponent', () => {
  let component: DocumentInfoHeaderComponent;
  let fixture: ComponentFixture<DocumentInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentInfoHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
