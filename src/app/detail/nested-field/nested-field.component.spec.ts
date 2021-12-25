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
  rithmId: '3j4k-3h2j-hj4j',
  prompt: '',
  questionType: QuestionFieldType.Nested,
  isReadOnly: false,
  isRequired: true,
  isPrivate: false,
  children: [
    {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'Address Line 1',
      questionType: QuestionFieldType.AddressLine,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    },
    {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'Address Line 2',
      questionType: QuestionFieldType.AddressLine,
      isReadOnly: false,
      isRequired: false,
      isPrivate: false,
      children: [],
    },
    {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'City',
      questionType: QuestionFieldType.City,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    },
    {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'State',
      questionType: QuestionFieldType.State,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      possibleAnswers: STATES,
      children: [],
    },
    {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'Zip',
      questionType: QuestionFieldType.Zip,
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

  it('should check the field question type state when there are possibleAnswers options', () => {
    component.ngOnInit();
    const stateField = component.childrenFields.find(element => element.questionType === 'state');
    expect(stateField).toBeTruthy();
    expect(stateField?.possibleAnswers).toEqual(STATES);
  });
});
