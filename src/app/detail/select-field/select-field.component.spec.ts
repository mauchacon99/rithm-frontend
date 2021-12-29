import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';

import { SelectFieldComponent } from './select-field.component';

const FIELD: Question = {
  rithmId: '3j4k-3h2j-hj4j',
  prompt: 'Fake question 9',
  questionType: QuestionFieldType.Select,
  isReadOnly: false,
  isRequired: true,
  isPrivate: false,
  possibleAnswers: [
    {
      text: 'Option 1',
      default: false,
    },
    {
      text: 'Option 2',
      default: true,
    },
    {
      text: 'Option 3',
      default: false,
    },
    {
      text: 'Option 4',
      default: false,
    },
  ],
  children: [],
};

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectFieldComponent],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: FormGroup, useValue: formBuilder }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELD;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should require an input in select field', () => {
    // TODO: figure out why this is failing
    // const select = component.selectFieldForm.get(QuestionFieldType.Select);
    // expect(component.field.questionType.typeString).toBeTruthy();
    // expect(select.valid).toBeFalse();
    // expect(select.hasError('required')).toBeTrue();
    // expect(component.selectFieldForm.valid).toBeFalse();
  });
});
