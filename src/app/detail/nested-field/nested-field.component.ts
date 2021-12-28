import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { STATES } from 'src/helpers';
import { DocumentFieldValidation } from 'src/helpers/document-field-validation';
import { Question, QuestionFieldType } from 'src/models';

/**
 * Reusable component used to construct nested questions such as Address and Payment fields.
 */
@Component({
  selector: 'app-nested-field',
  templateUrl: './nested-field.component.html',
  styleUrls: ['./nested-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NestedFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NestedFieldComponent),
      multi: true
    }
  ]
})
export class NestedFieldComponent implements OnInit{
  /** The form to add this field in the template. */
  nestedFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Helper class for field validation. */
  fieldValidation = new DocumentFieldValidation();

  /** They array of children fields. */
  childrenFields!: Question[];

  constructor(
    private fb: FormBuilder,
  ) {
    this.nestedFieldForm = this.fb.group({
      textFieldForm: this.fb.control(''),
      numberFieldForm: this.fb.control(''),
      selectFieldForm: this.fb.control(''),
    });
  }

  /**
   * Sets this.childrenFields.
   */
  ngOnInit(): void {
    this.childrenFields = this.field.children;

    if (this.childrenFields[3].questionType === 'state'){
      this.childrenFields[3].possibleAnswers = STATES;
    }
  }

  /**
   * The `onTouched` function.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => { };

  /**
   * Writes a value to this form.
   *
   * @param val The value to be written.
   */
  // eslint-disable-next-line
  writeValue(val: any): void {
    val && this.nestedFieldForm.setValue(val, { emitEvent: false });
  }

  /**
   * Registers a function with the `onChange` event.
   *
   * @param fn The function to register.
   */
  // eslint-disable-next-line
  registerOnChange(fn: any): void {
    // TODO: check for memory leak
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.nestedFieldForm.valueChanges.subscribe(fn);
  }

  /**
   * Registers a function with the `onTouched` event.
   *
   * @param fn The function to register.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of this form control.
   *
   * @param isDisabled The disabled state to set.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.nestedFieldForm.disable() : this.nestedFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.nestedFieldForm.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'Nested field form is invalid'
      }
    };
  }
}

//TODO: figure out how to correctly format the nested field upon creation.

/* Nested field should be formatted like this: */
/* {
      prompt: '',
      instructions: 'Enter the shipping address',
      questionType: {
        rithmId: '3j4k-3h2j-hj4j',
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
            rithmId: '3j4k-3h2j-hj4j',
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
            rithmId: '3j4k-3h2j-hj4j',
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
            rithmId: '3j4k-3h2j-hj4j',
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
            rithmId: '3j4k-3h2j-hj4j',
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
            rithmId: '3j4k-3h2j-hj4j',
            typeString: QuestionFieldType.Zip,
            validationExpression: '.+'
          },
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
      ],
    } */
