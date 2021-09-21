import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator
} from '@angular/forms';
import { STATES } from 'src/helpers';
import { Question, QuestionFieldType } from 'src/models';

/**
 * Component for the document template area of a station/document.
 */
@Component({
  selector: 'app-document-template[documentFields][stationInstructions]',
  templateUrl: './document-template.component.html',
  styleUrls: ['./document-template.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocumentTemplateComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DocumentTemplateComponent),
      multi: true
    }
  ]
})
export class DocumentTemplateComponent implements OnInit, ControlValueAccessor, Validator {
  /** The form to add to document. */
  documentTemplateForm!: FormGroup;

  /** The general instructions to be displayed, if any. */
  @Input() stationInstructions!: string;

  /** The document fields in the template area for the document. */
  @Input() documentFields!: Question[];



  constructor(
    private fb: FormBuilder,
  ) {
    this.documentTemplateForm = this.fb.group({
      documentFieldForm: this.fb.control('')
    });
  }

  /** Mock nested address field. */
  ngOnInit(): void {
    this.documentFields.push({
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
    });
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
    val && this.documentTemplateForm.setValue(val, { emitEvent: false });
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
    this.documentTemplateForm.valueChanges.subscribe(fn);
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
    isDisabled ? this.documentTemplateForm.disable() : this.documentTemplateForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.documentTemplateForm.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }

}
