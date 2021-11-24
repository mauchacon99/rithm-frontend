import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';

import { TextFieldComponent } from './text-field.component';

const FIELDS: Question[] = [
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 1',
    instructions: '',
    questionType: QuestionFieldType.ShortText,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 2',
    instructions: 'Fake instructions 2',
    questionType: QuestionFieldType.LongText,
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 3',
    instructions: '',
    questionType: QuestionFieldType.URL,
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 4',
    instructions: '',
    questionType: QuestionFieldType.Email,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  },
];

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextFieldComponent ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELDS[1];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('shortText field', () => {
    beforeEach(() => {
      component.field = FIELDS[0];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should require an input in short text field', () => {
      const shortText = component.textFieldForm.controls['shortText'];
      expect(component.field.questionType).toBeTruthy();
      expect(shortText.valid).toBeFalse();
      expect(shortText.hasError('required')).toBeTrue();
      expect(component.textFieldForm.valid).toBeFalse();
    });

  });

  describe('longText field', () => {
    beforeEach(() => {
      component.field = FIELDS[1];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not require an input in long text field', () => {
      const longText = component.textFieldForm.controls['longText'];
      expect(longText.valid).toBeTrue();
      expect(longText.hasError('required')).toBeFalse();
      expect(component.textFieldForm.valid).toBeTrue();
    });
  });

  describe('url field', () => {
    beforeEach(() => {
      component.field = FIELDS[2];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not require an input in url field', () => {
      const url = component.textFieldForm.controls['url'];
      expect(url.valid).toBeTrue();
      expect(url.hasError('required')).toBeFalse();
      expect(component.textFieldForm.valid).toBeTrue();
    });

    it('should require a valid url', () => {
      const url = component.textFieldForm.controls['url'];
      url.setValue('test.com');
      expect(url.valid).toBeFalse();
      expect(url.hasError('urlIncorrect')).toBeTrue();
      expect(component.textFieldForm.valid).toBeFalse();
    });
  });

  describe('email field', () => {
    beforeEach(() => {
      component.field = FIELDS[3];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should require an input in email field', () => {
      const email = component.textFieldForm.controls['email'];
      expect(email.valid).toBeFalse();
      expect(email.hasError('required')).toBeTrue();
      expect(component.textFieldForm.valid).toBeFalse();
    });

    it('should require a valid email', () => {
      const email = component.textFieldForm.controls['email'];
      email.setValue('test.com');
      expect(email.valid).toBeFalse();
      expect(email.hasError('email')).toBeTrue();
      expect(component.textFieldForm.valid).toBeFalse();
    });
  });

});
