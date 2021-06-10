import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationDocumentsModalComponent } from './station-documents-modal.component';

describe('StationDocumentsModalComponent', () => {
  let component: StationDocumentsModalComponent;
  let fixture: ComponentFixture<StationDocumentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationDocumentsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationDocumentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
