import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';

import { DateFieldComponent } from './date-field.component';

const FIELD: Question = {
  prompt: 'Fake question 8',
  instructions: 'Fake question 8',
  questionType: {
    rithmId: '',
    typeString: QuestionFieldType.Date,
    validationExpression: '.+'
  },
  isReadOnly: false,
  isRequired: true,
  isPrivate: false
};

describe('DateFieldComponent', () => {
  let component: DateFieldComponent;
  let fixture: ComponentFixture<DateFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateFieldComponent ],
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
      ]
    })
    .compileComponents();
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
    expect(component.field.questionType.typeString).toBeTruthy();
    expect(date.valid).toBeFalse();
    expect(date.hasError('required')).toBeTrue();
    expect(component.dateFieldForm.valid).toBeFalse();
  });

});
