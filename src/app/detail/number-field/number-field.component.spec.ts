import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { Question, QuestionFieldType } from 'src/models';

import { NumberFieldComponent } from './number-field.component';

const FIELDS: Question[] = [
  {
    prompt: 'Fake question 5',
    instructions: 'Fake question 5',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.Number,
      validationExpression: '.+'
    },
    isReadOnly: false,
    isRequired: true,
    isPrivate: false
  },
  {
    prompt: 'Fake question 6',
    instructions: '',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.Phone,
      validationExpression: '.+'
    },
    isReadOnly: false,
    isRequired: false,
    isPrivate: false
  },
  {
    prompt: 'Fake question 7',
    instructions: '',
    questionType: {
      rithmId: '',
      typeString: QuestionFieldType.Currency,
      validationExpression: '.+'
    },
    isReadOnly: false,
    isRequired: true,
    isPrivate: false
  },
];

describe('NumberFieldComponent', () => {
  let component: NumberFieldComponent;
  let fixture: ComponentFixture<NumberFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberFieldComponent ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        NgxMaskModule.forRoot(),
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
      ]
    })
    .compileComponents();
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
    beforeEach(() => {
      component.field = FIELDS[0];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should require an input in number field', () => {
      const number = component.numberField.controls['number'];
      expect(component.field.questionType.typeString).toBeTruthy();
      expect(number.valid).toBeFalse();
      expect(number.hasError('required')).toBeTrue();
      expect(component.numberField.valid).toBeFalse();
    });

  });

  describe('phone field', () => {
    beforeEach(() => {
      component.field = FIELDS[1];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not require an input in phone field', () => {
      const phone = component.numberField.controls['phone'];
      expect(phone.valid).toBeTrue();
      expect(phone.hasError('required')).toBeFalse();
      expect(component.numberField.valid).toBeTrue();
    });

    it('should require a valid phone', () => {
      const phone = component.numberField.controls['phone'];
      phone.setValue('4564');
      expect(phone.valid).toBeFalse();
      expect(phone.hasError('phoneIncorrect')).toBeTrue();
      expect(component.numberField.valid).toBeFalse();
    });
  });

  describe('currency field', () => {
    beforeEach(() => {
      component.field = FIELDS[2];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should require an input in currency field', () => {
      const currency = component.numberField.controls['currency'];
      expect(currency.valid).toBeFalse();
      expect(currency.hasError('required')).toBeTrue();
      expect(component.numberField.valid).toBeFalse();
    });

    it('should require a valid currency', () => {
      const currency = component.numberField.controls['currency'];
      currency.setValue('45.45.45');
      expect(currency.valid).toBeFalse();
      expect(currency.hasError('currencyIncorrect')).toBeTrue();
      expect(component.numberField.valid).toBeFalse();
    });
  });

  describe('zip validation', () => {
    beforeEach(() => {
      component.field = {
        prompt: 'Postal code',
        instructions: '',
        questionType: {
          rithmId: '',
          typeString: QuestionFieldType.Address,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: true,
        isPrivate: false
      };
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should require an input for a zip code', () => {
      const zip = component.numberField.controls['address'];
      expect(zip.valid).toBeFalse();
      expect(zip.hasError('required')).toBeTrue();
      expect(component.numberField.valid).toBeFalse();
    });

    it('should require a valid zip', () => {
      const zip = component.numberField.controls['address'];
      zip.setValue('455');
      expect(zip.valid).toBeFalse();
      expect(zip.hasError('zipIncorrect')).toBeTrue();
      expect(component.numberField.valid).toBeFalse();
    });
  });

});
