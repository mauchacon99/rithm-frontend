import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';
import { FileFieldComponent } from './file-field.component';

import { MockDocumentService } from 'src/mocks';
import { DocumentService } from 'src/app/core/document.service';

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
const fn = function () {};
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
      declarations: [FileFieldComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: DocumentService, useValue: MockDocumentService },
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

  fit('should register function with the `onTouched` event', () => {
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  it('should require an input in file field', () => {
    const file = component.fileFieldForm.controls['file'];
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
});
