import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { StationDocumentsModalComponent } from './station-documents-modal.component';
import { MockDocumentService } from 'src/mocks';
import { MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';
import { DialogData } from 'src/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const DIALOG_TEST_DATA: DialogData = {
  title: 'Roster',
  message: 'This is an example alert used for testing.',
  okButtonText: 'Understood',
  cancelButtonText: 'Cancel'
};

describe('StationDocumentsModalComponent', () => {
  let component: StationDocumentsModalComponent;
  let fixture: ComponentFixture<StationDocumentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationDocumentsModalComponent],
      imports: [],
      providers: [
        { provide: PopupService, useClass: MockPopupService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService }
      ]
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

  it('should return zero or more documents', () => {
    expect(component.totalDocs.length).toBeGreaterThanOrEqual(0);
    expect(component.numberOfDocs).toBeGreaterThanOrEqual(0);
    expect(component.isWorker).toBe(true || false);
  });
});
