import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { STATES } from 'src/helpers';
import { Question, QuestionFieldType } from 'src/models';
import { NumberFieldComponent } from '../number-field/number-field.component';
import { SelectFieldComponent } from '../select-field/select-field.component';
import { TextFieldComponent } from '../text-field/text-field.component';

import { NestedFieldComponent } from './nested-field.component';

const ADDRESS: Question = {
  prompt: '',
  instructions: 'Enter the shipping address',
  questionType: {
    rithmId: '',
    typeString: QuestionFieldType.Nested,
    validationExpression: '.+'
  },
  isReadOnly: false,
  isRequired: true,
  isPrivate: false,
  children: [
    {
      prompt: 'Address Line 1',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.AddressLine,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    },
    {
      prompt: 'Address Line 2',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.AddressLine,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: false,
      isPrivate: false,
      children: [],
    },
    {
      prompt: 'City',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.City,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    },
    {
      prompt: 'State',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.State,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      possibleAnswers: STATES,
      children: [],
    },
    {
      prompt: 'Zip',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.Zip,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    },
  ],
};

describe('NestedFieldComponent', () => {
  let component: NestedFieldComponent;
  let fixture: ComponentFixture<NestedFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NestedFieldComponent,
        MockComponent(TextFieldComponent),
        MockComponent(NumberFieldComponent),
        MockComponent(SelectFieldComponent),
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedFieldComponent);
    component = fixture.componentInstance;
    component.field = ADDRESS;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have children', () => {
    expect(component.childrenFields.length).toEqual(5);
  });
});
