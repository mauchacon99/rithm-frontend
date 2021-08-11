import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';

import { SelectFieldComponent } from './select-field.component';

const FIELD: Question = {
  prompt: 'Fake question 9',
  instructions: 'Fake instructions 9',
  questionType: {
    rithmId: '',
    typeString: QuestionFieldType.Select,
    validationExpression: '.+'
  },
  isReadOnly: false,
  isRequired: true,
  isPrivate: false,
  options: [
    {
      value: 'Option 1',
      isSelected: false
    },
    {
      value: 'Option 2',
      isSelected: true
    },
    {
      value: 'Option 3',
      isSelected: false
    },
    {
      value: 'Option 4',
      isSelected: false
    }
  ]
};

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectFieldComponent ],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: FormGroup, useValue: formBuilder },
      ]
    })
    .compileComponents();
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

  it('should require an input in select field', () => {
    const select = component.selectFieldForm.controls['singleDropdown'];
    expect(component.field.questionType.typeString).toBeTruthy();
    expect(select.valid).toBeFalse();
    expect(select.hasError('required')).toBeTrue();
    expect(component.selectFieldForm.valid).toBeFalse();
  });

});
