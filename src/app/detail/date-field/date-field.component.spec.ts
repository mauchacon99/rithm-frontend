import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateFieldComponent ],
      imports: [
        MatFormFieldModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {// TODO: Enable this after form control name is added to the component
    expect(component).toBeTruthy();
  });
});
