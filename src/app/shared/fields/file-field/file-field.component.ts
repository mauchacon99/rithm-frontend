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
import { MatDialog } from '@angular/material/dialog';
import { DocumentService } from 'src/app/core/document.service';
import { QuestionFieldType, Question, DocumentAnswer } from 'src/models';
import { UploadFileModalComponent } from 'src/app/shared/fields/upload-file-modal/upload-file-modal.component';
import { first } from 'rxjs';
import { PopupService } from 'src/app/core/popup.service';
import { ErrorService } from 'src/app/core/error.service';
import { ActivatedRoute } from '@angular/router';

/**
 *
 */
@Component({
  selector: 'app-file-field[documentId][stationId]',
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

  /** The document id as an required parameter. */
  @Input() documentId!: string;

  /** The station id as an required parameter. */
  @Input() stationId!: string;

  /** The form to add this field in the template. */
  fileFieldForm!: FormGroup;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Is file is uploaded or not. */
  isFileUploaded = false;

  /** Is file is deleted or not. */
  isFileDeleted = false;

  /** The name of uploaded file. */
  fileName = '';

  /** The size of uploaded file. */
  fileSize = 0;

  constructor(
    private documentService: DocumentService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private popupService: PopupService,
    private errorService: ErrorService,
    private route: ActivatedRoute
  ) {}

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    const fileName = this.field.answer?.fileName;
    this.fileFieldForm = this.fb.group({
      [this.field.questionType]: [
        fileName && fileName.length ? fileName : '',
        [],
      ],
    });

    if (this.field.isRequired) {
      this.fileFieldForm.get('fileType')?.setValidators([Validators.required]);

      if (fileName && fileName.length) {
        this.fileFieldForm.get('fileType')?.valid;
      }
    }

    this.fileFieldForm.get('fileType')?.markAsTouched();
    this.fileFieldForm.get('fileType')?.updateValueAndValidity();

    if (this.field.answer?.value && this.field.answer?.fileName) {
      this.getDocumentDetails();
    }
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

  /**
   * Navigates the user back to dashboard and displays a message about the invalid params.
   */
  private getDocumentDetails(): void {
    this.fileName = this.field.answer?.fileName
      ? this.field.answer?.fileName
      : '';
    this.fileSize = this.field.answer?.fileSize
      ? this.field.answer?.fileSize
      : 0;
    this.isFileUploaded = true;
  }

  /**
   * Open a modal upload-file-modal.
   */
  openUploadFileModal(): void {
    const dialog = this.dialog.open(UploadFileModalComponent, {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '500px',
      minHeight: '345px',
      disableClose: true,
      data: this.field,
    });
    dialog
      .afterClosed()
      .pipe(first())
      .subscribe((fileData) => {
        if (fileData) {
          this.isFileUploaded = true;
          this.fileName = fileData.name;
          this.fileSize = fileData.size;
        }
        this.fileFieldForm.get('fileType')?.setValue(this.fileName);
      });
  }

  /**
   * Deleted the uploaded file from Question object.
   *
   */
  async deleteDocument(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Remove Document',
      message: `Are you sure you want remove document?`,
      okButtonText: 'Remove',
    });
    if (confirm) {
      this.isFileDeleted = true;
      const documentAnswer: DocumentAnswer = {
        questionRithmId: this.field.rithmId,
        documentRithmId: this.documentId,
        stationRithmId: this.stationId,
        value: '',
        type: this.field.questionType,
        questionUpdated: true,
        file: undefined,
        filename: '',
      };
      this.documentService.updateAnswerSubject(documentAnswer);
      this.documentService
        .saveDocumentAnswer(this.documentId, [documentAnswer])
        .pipe(first())
        .subscribe({
          next: () => {
            this.fileFieldForm.get('fileType')?.setValue('');
            this.isFileUploaded = false;
            this.isFileDeleted = false;
            this.popupService.notify(
              'The document has been deleted successfully.'
            );
          },
          error: (error: unknown) => {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    }
  }
}
