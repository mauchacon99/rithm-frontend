import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFieldComponent } from './document-field.component';

describe('DocumentFieldComponent', () => {
  let component: DocumentFieldComponent;
  let fixture: ComponentFixture<DocumentFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
