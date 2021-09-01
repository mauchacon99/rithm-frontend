import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { QuestionFieldType } from 'src/models';
import { AddressFieldComponent } from '../../detail/address-field/address-field.component';
import { CheckFieldComponent } from '../../detail/check-field/check-field.component';
import { DateFieldComponent } from '../../detail/date-field/date-field.component';
import { NumberFieldComponent } from '../../detail/number-field/number-field.component';
import { SelectFieldComponent } from '../../detail/select-field/select-field.component';
import { TextFieldComponent } from '../../detail/text-field/text-field.component';

import { DocumentFieldComponent } from './document-field.component';

describe('DocumentFieldComponent', () => {
  let component: DocumentFieldComponent;
  let fixture: ComponentFixture<DocumentFieldComponent>;
  const formBuilder = new FormBuilder();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fn = function() { };
  const errorMessage = {
    invalidForm: {
      valid: false,
      message: 'User form is invalid'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentFieldComponent,
        MockComponent(TextFieldComponent),
        MockComponent(NumberFieldComponent),
        MockComponent(DateFieldComponent),
        MockComponent(AddressFieldComponent),
        MockComponent(SelectFieldComponent),
        MockComponent(CheckFieldComponent),
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
    fixture = TestBed.createComponent(DocumentFieldComponent);
    component = fixture.componentInstance;
    component.field = {
      prompt: 'Address line 1',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.ShortText,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register function with the `onTouched` event', () => {
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  it('should return null when form is valid', () => {
    const error = component.validate();
    expect(error).toEqual(null);
  });

  it('should return validation errors when form is invalid', () => {
    component.documentFieldForm.setErrors({ valid: false });
    const error = component.validate();
    expect(error).toEqual(errorMessage);
  });
});
