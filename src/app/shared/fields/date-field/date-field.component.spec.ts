import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';

import { DateFieldComponent } from './date-field.component';
import { MockDocumentService } from 'src/mocks';
import { DocumentService } from 'src/app/core/document.service';

const FIELD: Question = {
  rithmId: '3j4k-3h2j-hj4j',
  prompt: 'Fake question 8',
  questionType: QuestionFieldType.Date,
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
    message: 'Date field form is invalid',
  },
};

describe('DateFieldComponent', () => {
  let component: DateFieldComponent;
  let fixture: ComponentFixture<DateFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateFieldComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
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
    fixture = TestBed.createComponent(DateFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELD;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require an input in date field', () => {
    const date = component.dateFieldForm.controls['date'];
    expect(component.field.questionType).toBeTruthy();
    expect(date.valid).toBeFalse();
    expect(date.hasError('required')).toBeTrue();
    expect(component.dateFieldForm.valid).toBeFalse();
  });

  it('should register function with the `onTouched` event', () => {
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  xit('should return null when form is valid', () => {
    const error = component.validate();
    expect(error).toEqual(null);
  });

  it('should return validation errors when form is invalid', () => {
    component.dateFieldForm.setErrors({ valid: false });
    const error = component.validate();
    expect(error).toEqual(errorMessage);
  });
});
