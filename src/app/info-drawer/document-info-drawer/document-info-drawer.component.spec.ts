import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentInfoDrawerComponent } from './document-info-drawer.component';

describe('DocumentInfoDrawerComponent', () => {
  let component: DocumentInfoDrawerComponent;
  let fixture: ComponentFixture<DocumentInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentInfoDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
