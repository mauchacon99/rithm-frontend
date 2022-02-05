import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { DocumentListCardComponent } from './document-list-card.component';

describe('DocumentListCardComponent', () => {
  let component: DocumentListCardComponent;
  let fixture: ComponentFixture<DocumentListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentListCardComponent],
      imports: [MatCardModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
