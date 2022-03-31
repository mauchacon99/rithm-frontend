import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';
import { FileFieldComponent } from './file-field.component';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { DocumentService } from 'src/app/core/document.service';
import { UploadFileModalComponent } from 'src/app/shared/fields/upload-file-modal/upload-file-modal.component';
import { MockComponent } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorService } from 'src/app/core/error.service';
import { CommonModule } from '@angular/common';

const FIELD: Question = {
  rithmId: '3j4k-3h2j-hj4j',
  prompt: 'Fake question 8',
  questionType: QuestionFieldType.File,
  isReadOnly: false,
  isRequired: true,
  isPrivate: false,
  children: [],
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const fn = () => {};
const errorMessage = {
  invalidForm: {
    valid: false,
    message: 'File field form is invalid',
  },
};

describe('FileFieldComponent', () => {
  let component: FileFieldComponent;
  let fixture: ComponentFixture<FileFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FileFieldComponent,
        MockComponent(UploadFileModalComponent),
      ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        CommonModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: DocumentService, useValue: MockDocumentService },
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ErrorService, useValue: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELD;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register function with the `onTouched` event', () => {
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  it('should require an input in file field', () => {
    const file = component.fileFieldForm.controls['fileType'];
    expect(component.field.questionType).toBeTruthy();
    expect(file.valid).toBeFalse();
    expect(file.hasError('required')).toBeTrue();
    expect(component.fileFieldForm.valid).toBeFalse();
  });

  it('should return validation errors when form is invalid', () => {
    component.fileFieldForm.setErrors({ valid: false });
    const error = component.validate();
    expect(error).toEqual(errorMessage);
  });

  it('should to call MatDialog service when clicking on the upload-button', () => {
    const uploadBtn = fixture.nativeElement.querySelector('#upload-button');
    expect(uploadBtn).toBeTruthy();
    const expectDataModal = {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '500px',
      minHeight: '345px',
      disableClose: true,
      data: component.field,
    };
    const dialogSpy = spyOn(
      TestBed.inject(MatDialog),
      'open'
    ).and.callThrough();
    uploadBtn.click();
    expect(dialogSpy).toHaveBeenCalledWith(
      UploadFileModalComponent,
      expectDataModal
    );
  });

  describe('UploadFileModalComponent', () => {
    let componentUpload: UploadFileModalComponent;
    let fixtureUpload: ComponentFixture<UploadFileModalComponent>;
    beforeEach(() => {
      fixtureUpload = TestBed.createComponent(UploadFileModalComponent);
      componentUpload = fixtureUpload.componentInstance;
      fixtureUpload.detectChanges();
    });

    it('should close the modal for upload file', () => {
      const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
      const spyMethod = spyOn(componentUpload, 'closeModal').and.callThrough();
      const btnClose =
        fixtureUpload.nativeElement.querySelector('#close-modal-btn');
      expect(btnClose).toBeTruthy();
      btnClose.click();
      expect(spyMethod).toHaveBeenCalled();
      expect(spyMatDialogRef).toHaveBeenCalled();
    });
  });
});
