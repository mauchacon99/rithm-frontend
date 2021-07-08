import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DocumentInfoHeaderComponent } from './document-info-header.component';

describe('DocumentInfoHeaderComponent', () => {
  let component: DocumentInfoHeaderComponent;
  let fixture: ComponentFixture<DocumentInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentInfoHeaderComponent ],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
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
