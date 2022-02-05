import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService } from 'src/mocks';
import { Question, QuestionFieldType } from 'src/models';

import { CheckFieldComponent } from './check-field.component';

const FIELD: Question = {
  rithmId: '3j4k-3h2j-hj4j',
  prompt: 'Fake question 11',
  questionType: QuestionFieldType.CheckList,
  isReadOnly: false,
  isRequired: true,
  isPrivate: false,
  possibleAnswers: [
    {
      rithmId: '3j4k-3h2j-hj41',
      text: 'Option 1',
      default: false,
    },
  ],
  children: [],
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const fn = function () {};
const errorMessage = {
  invalidForm: {
    valid: false,
    message: 'Check field form is invalid',
  },
};

describe('CheckFieldComponent', () => {
  let component: CheckFieldComponent;
  let fixture: ComponentFixture<CheckFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckFieldComponent],
      imports: [
        MatFormFieldModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: FormGroup, useValue: formBuilder },
        { provide: DocumentService, useValue: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELD;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should require an input in check field', () => {
    // TODO: figure out why this is failing
    const check = component.checkFieldForm.controls['singleCheckbox'];
    expect(component.field.questionType).toBeTruthy();
    expect(check.valid).toBeFalse();
    expect(check.hasError('required')).toBeTrue();
    expect(component.checkFieldForm.valid).toBeFalse();
  });

  it('should register function with the `onTouched` event', () => {
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  xit('should return null when form is valid', () => {
    component.checkFieldForm.setErrors({ valid: true });
    const error = component.validate();
    expect(error).toEqual(null);
  });

  it('should return validation errors when form is invalid', () => {
    component.checkFieldForm.setErrors({ valid: false });
    const error = component.validate();
    expect(error).toEqual(errorMessage);
  });
});
