import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService } from 'src/mocks';
import { Question, QuestionFieldType } from 'src/models';

import { NumberFieldComponent } from './number-field.component';

const FIELDS: Question[] = [
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 5',
    questionType: QuestionFieldType.Number,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 6',
    questionType: QuestionFieldType.Phone,
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 7',
    questionType: QuestionFieldType.Currency,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  },
];

describe('NumberFieldComponent', () => {
  let component: NumberFieldComponent;
  let fixture: ComponentFixture<NumberFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberFieldComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        NgxMaskModule.forRoot(),
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: DocumentService, useValue: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELDS[1];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('number field', () => {
    let numberField: AbstractControl;

    beforeEach(() => {
      component.field = FIELDS[0];
      component.ngOnInit();
      numberField = component.numberFieldForm.controls['number'];
      fixture.detectChanges();
    });

    it('should require an input in number field', () => {
      expect(component.field.questionType).toBeTruthy();
      expect(numberField.valid).toBeFalse();
      expect(numberField.hasError('required')).toBeTrue();
      expect(component.numberFieldForm.valid).toBeFalse();
    });
  });

  describe('phone field', () => {
    let phoneField: AbstractControl;

    beforeEach(() => {
      component.field = FIELDS[1];
      component.ngOnInit();
      phoneField = component.numberFieldForm.controls['phoneNumber'];
      fixture.detectChanges();
    });

    it('should not require an input in phone field', () => {
      expect(phoneField.valid).toBeTrue();
      expect(phoneField.hasError('required')).toBeFalse();
      expect(component.numberFieldForm.valid).toBeTrue();
    });

    it('should require a valid phone', () => {
      phoneField.setValue('4564');
      expect(phoneField.valid).toBeFalse();
      expect(phoneField.hasError('phoneIncorrect')).toBeTrue();
      expect(component.numberFieldForm.valid).toBeFalse();
    });
  });

  describe('currency field', () => {
    let currencyField: AbstractControl;

    beforeEach(() => {
      component.field = FIELDS[2];
      component.ngOnInit();
      currencyField = component.numberFieldForm.controls['currency'];
      fixture.detectChanges();
    });

    it('should require an input in currency field', () => {
      expect(currencyField.valid).toBeFalse();
      expect(currencyField.hasError('required')).toBeTrue();
      expect(component.numberFieldForm.valid).toBeFalse();
    });

    it('should require a valid currency', () => {
      currencyField.setValue('45.45.45');
      expect(currencyField.valid).toBeFalse();
      expect(currencyField.hasError('currencyIncorrect')).toBeTrue();
      expect(component.numberFieldForm.valid).toBeFalse();
    });
  });

  describe('zip validation', () => {
    let zipField: AbstractControl;

    beforeEach(() => {
      component.field = {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Postal code',
        questionType: QuestionFieldType.Zip,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      };
      component.ngOnInit();
      zipField = component.numberFieldForm.controls['zip'];
      fixture.detectChanges();
    });

    it('should require an input for a zip code', () => {
      expect(zipField.valid).toBeFalse();
      expect(zipField.hasError('required')).toBeTrue();
      expect(component.numberFieldForm.valid).toBeFalse();
    });

    it('should require a valid zip', () => {
      zipField.setValue('455');
      expect(zipField.valid).toBeFalse();
      expect(zipField.hasError('zipIncorrect')).toBeTrue();
      expect(component.numberFieldForm.valid).toBeFalse();
    });
  });
});
