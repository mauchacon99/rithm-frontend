import {
  Component,
  forwardRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  NgZone,
  Inject,
} from '@angular/core';
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
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { StationService } from 'src/app/core/station.service';
import { DocumentFieldValidation } from 'src/helpers/document-field-validation';
import { QuestionFieldType, Question, DocumentAnswer } from 'src/models';
import { PopupService } from 'src/app/core/popup.service';

/**
 * Reusable component for all fields involving text.
 */
@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
})
export class TextFieldComponent
  implements OnInit, ControlValueAccessor, Validator
{
  /** The document field to display. */
  @Input() field!: Question;

  /** Add new field label from toolbar. */
  @Input() toolBar!: boolean;

  /** Does the field need to be removable? */
  @Input() removableField!: boolean;

  /** The label tag for each field. */
  @Input() labelTag!: string;

  /** Whether the instance comes from station or document. */
  @Input() isStation = true;

  /** Whether Field belongs to another component beside station to be displayed as an inputText instead a textarea. */
  @Input() isInput = false;

  /** Whether field belongs to a station/container widget or not. */
  @Input() widgetItem = false;

  /** Whether to validate input text mask (true by default). */
  @Input() validateMask = true;

  /** Output the value of the field. */
  @Output() removeOptionField = new EventEmitter<Question>();

  /** Output the value of a possibleAnswer. */
  @Output() updPossibleAnswer = new EventEmitter<Question>();

  /** The form to add this field in the template. */
  textFieldForm!: FormGroup;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Helper class for field validation. */
  fieldValidation = new DocumentFieldValidation();

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private documentService: DocumentService,
    private popupService: PopupService,
    @Inject(NgZone) private ngZone: NgZone
  ) {}

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.textFieldForm = this.fb.group({
      [this.field.questionType]: [
        { value: this.fieldValue, disabled: this.field.isReadOnly },
        [],
      ],
    });

    //Logic to determine if a field should be required, and the validators to give it.
    const validators: ValidatorFn[] = [];

    //The field is required. Validators.required must be included.
    if (this.isStation) {
      validators.push(Validators.required);
    } else if (this.field.isRequired) {
      validators.push(Validators.required);
    }

    if (this.validateMask) {
      //Need to set email and url.
      switch (this.field.questionType) {
        case QuestionFieldType.Email:
          validators.push(Validators.email);
          break;
        case QuestionFieldType.URL:
          validators.push(this.fieldValidation.urlValidation());
          break;
      }
    }
    this.textFieldForm.get(this.field.questionType)?.setValidators(validators);
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
    val = '';
    val && this.textFieldForm.setValue(val, { emitEvent: false });
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
    this.textFieldForm.valueChanges.subscribe(fn);
    this.ngZone.onStable.pipe(first()).subscribe(() => {
      this.textFieldForm.get(this.field.questionType)?.markAsTouched();
      this.textFieldForm.get(this.field.questionType)?.updateValueAndValidity();
    });
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
    isDisabled ? this.textFieldForm.disable() : this.textFieldForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.textFieldForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'Text field form is invalid',
          },
        };
  }

  /**
   * Call the station service to to update field from the current form.
   */
  updateFieldPrompt(): void {
    this.field.prompt =
      this.textFieldForm.controls[this.field.questionType].value;
    this.stationService.updateStationQuestionInTemplate(this.field);
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
      value: this.textFieldForm.controls[this.field.questionType].value,
      type: this.field.questionType,
      questionUpdated: true,
    };
    this.documentService.updateAnswerSubject(documentAnswer);
  }

  /**
   * Emits an event to parent component to remove field from form.
   *
   * @param field The field to emit.
   */
  removeField(field: Question): void {
    this.removeOptionField.emit(field);
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
    } else {
      switch (this.field.questionType) {
        case QuestionFieldType.ShortText:
        case QuestionFieldType.LongText:
        case QuestionFieldType.URL:
        case QuestionFieldType.Email:
        case QuestionFieldType.City:
        case QuestionFieldType.Number:
          fieldVal = this.field.answer?.asString
            ? this.field.answer?.asString
            : '';
          break;
        default:
          fieldVal = '';
          break;
      }
    }
    return fieldVal;
  }

  /**
   * Show modal that executes the function to remove the field.
   *
   * @param field The field to be removed.
   */
  async removeFieldStation(field: Question): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Remove Field',
      message: `Are you sure you want to remove this field?`,
      okButtonText: 'Remove',
      cancelButtonText: 'Close',
      important: true,
    });
    if (confirm) {
      this.removeField(field);
    }
  }
}
