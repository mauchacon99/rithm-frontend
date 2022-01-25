import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { QuestionFieldType, Question, DocumentAnswer } from 'src/models';
import { DocumentService } from 'src/app/core/document.service';

/**
 * Reusable field for every select/multi select dropdown.
 */
@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true,
    },
  ],
})
export class SelectFieldComponent
  implements OnInit, ControlValueAccessor, Validator
{
  /** The form to add this field in the template. */
  selectFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService
  ) {}

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.selectFieldForm = this.fb.group({
      [this.field.questionType]: [
        this.fieldValue !== undefined ? this.fieldValue : '',
        [],
      ],
    });

    //Logic to determine if a field should be required, and the validators to give it.
    const validators: ValidatorFn[] = [];

    //The field is required. Validators.required must be included.
    if (this.field.isRequired) {
      validators.push(Validators.required);
    }

    this.selectFieldForm
      .get(this.field.questionType)
      ?.setValidators(validators);

    this.selectFieldForm.get(this.field.questionType)?.markAsTouched();
    this.selectFieldForm.get(this.field.questionType)?.updateValueAndValidity();
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
    val && this.selectFieldForm.setValue(val, { emitEvent: false });
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
    this.selectFieldForm.valueChanges.subscribe(fn);
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
    isDisabled ? this.selectFieldForm.disable() : this.selectFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.selectFieldForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'Select field form is invalid',
          },
        };
  }

  /**
   * Allow the answer to be updated in the documentTemplate through a subject.
   *
   */
  updateFieldAnswer(): void {
    let selectResponse = '';
    if (this.field.questionType === QuestionFieldType.Select) {
      selectResponse = this.selectFieldForm.get(this.field.questionType)?.value;
    } else {
      selectResponse = this.selectFieldForm
        .get(this.field.questionType)
        ?.value.toString()
        .replace(/,/g, '|');
    }
    const documentAnswer: DocumentAnswer = {
      questionRithmId: this.field.rithmId,
      documentRithmId: '',
      stationRithmId: '',
      value: selectResponse,
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
  get fieldValue(): string | string[] | undefined {
    let fieldVal;
    switch (this.field.questionType) {
      case QuestionFieldType.State:
        fieldVal = this.field.answer?.asString
          ? this.field.answer?.asString
          : '';
        break;
      case QuestionFieldType.Select:
        /**if Finally there's an answer list to select */
        if (
          this.field.answer &&
          this.field.answer?.asArray &&
          this.field.answer?.asArray?.length > 0
        ) {
          const target = this.field.answer?.asArray.find(
            (arrayItem) => arrayItem.isChecked === true
          );
          fieldVal = target ? target.value : '';
        }
        break;
      case QuestionFieldType.MultiSelect:
        /**if Finally there's an answer list to select */
        if (
          this.field.answer &&
          this.field.answer?.asArray &&
          this.field.answer?.asArray?.length > 0
        ) {
          // eslint-disable-next-line max-len
          const targets = this.field.answer?.asArray
            .filter((arrayItems) => arrayItems.isChecked === true)
            .map((item) => {
              return item.value;
            });
          if (targets) {
            fieldVal = targets;
          }
        }
        break;
      default:
        fieldVal = undefined;
        break;
    }
    return fieldVal;
  }
}
