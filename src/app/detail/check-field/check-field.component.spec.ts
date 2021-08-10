import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';

import { CheckFieldComponent } from './check-field.component';

const FIELD: Question = {
  prompt: 'Fake question 11',
  instructions: 'Fake instructions 11',
  questionType: {
    rithmId: '',
    typeString: QuestionFieldType.CheckBox,
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
  ]
};

describe('CheckFieldComponent', () => {
  let component: CheckFieldComponent;
  let fixture: ComponentFixture<CheckFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckFieldComponent ],
      imports: [
        MatFormFieldModule,
        MatCheckboxModule,
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
    fixture = TestBed.createComponent(CheckFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELD;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require an input in check field', () => {
    const check = component.checkField.controls['checkBox'];
    expect(component.field.questionType.typeString).toBeTruthy();
    expect(check.valid).toBeFalse();
    expect(check.hasError('required')).toBeTrue();
    expect(component.checkField.valid).toBeFalse();
  });
});
