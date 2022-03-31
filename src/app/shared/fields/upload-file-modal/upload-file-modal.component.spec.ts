import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { UploadFileModalComponent } from './upload-file-modal.component';
import { CommonModule } from '@angular/common';

describe('UploadFileModalComponent', () => {
  let component: UploadFileModalComponent;
  let fixture: ComponentFixture<UploadFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DocumentService, useValue: MockDocumentService },
        { provide: ErrorService, useValue: MockErrorService },
      ],
      declarations: [UploadFileModalComponent],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        MatInputModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatProgressBarModule,
        CommonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close the modal when the close-modal-btn is pressed', () => {
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModal').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector('#close-modal-btn');
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });
});
