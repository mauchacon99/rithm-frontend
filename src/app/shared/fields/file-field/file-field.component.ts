import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';

import { DocumentService } from 'src/app/core/document.service';
import { QuestionFieldType, Question, DocumentAnswer } from 'src/models';

/**
 *
 */
@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileFieldComponent),
      multi: true,
    },
  ],
})
export class FileFieldComponent
  implements OnInit, ControlValueAccessor, Validator
{
  /** The document field to display. */
  @Input() field!: Question;

  /** Whether the instance comes from station or document. */
  @Input() isStation = true;

  /** The form to add this field in the template. */
  fileFieldForm!: FormGroup;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  constructor(
    private documentService: DocumentService,
    private fb: FormBuilder
  ) {}

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.fileFieldForm = this.fb.group({
      [this.field.questionType]: [this.fieldValue, []],
    });

    if (this.field.isRequired) {
      this.fileFieldForm.get('fileType')?.setValidators([Validators.required]);
    }

    this.fileFieldForm.get('fileType')?.markAsTouched();
    this.fileFieldForm.get('fileType')?.updateValueAndValidity();
  }

  /**
   * The `onTouched` function.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  /**
   * Writes a value to this form.
   *
   * @param val The value to be written.
   */
  // eslint-disable-next-line
  writeValue(val: any): void {
    val && this.fileFieldForm.setValue(val, { emitEvent: false });
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
    this.fileFieldForm.valueChanges.subscribe(fn);
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
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.fileFieldForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'File field form is invalid',
          },
        };
  }

  /**
   * Allow the answer to be updated in the documentTemplate through a subject.
   *
   */
  updateFieldAnswer(): void {
    const documentAnswer: DocumentAnswer = {
      questionRithmId: this.field.rithmId,
      documentRithmId: '',
      stationRithmId: '',
      value: this.fileFieldForm.controls['file'].value,
      type: this.field.questionType,
      questionUpdated: true,
    };
    this.documentService.updateAnswerSubject(documentAnswer);
  }

  /**
   * Gets the input/textArea value.
   *
   * @returns A string value.
   */
  get fieldValue(): string {
    let fieldVal = '';
    if (this.isStation) {
      fieldVal = this.field.value ? this.field.value : '';
    }
    return fieldVal;
  }
}
