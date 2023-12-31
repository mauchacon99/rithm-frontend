import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { RuleModalComponent } from 'src/app/station/rule-modal/rule-modal.component';
import { DocumentAnswer, Question } from 'src/models';

/**
 * Reusable component to upload a file from the file-field.
 */
@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.scss'],
})
export class UploadFileModalComponent implements OnInit {
  /** Number of files. */
  file: File | undefined;

  /** Indicates the status of file upload process. */
  progress = 0;

  /** The document field to display. */
  field!: Question;

  /** Document Id. */
  private documentId = '';

  /** Station Id. */
  private stationId = '';

  /** Whether the request to save the file info is currently underway. */
  isLoading = false;

  /** Whether the file upload is success or not. */
  fileUpload = false;

  constructor(
    public dialogRef: MatDialogRef<RuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: Question,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private errorService: ErrorService,
    private popupService: PopupService
  ) {
    this.field = modalData;
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.getParams();
  }

  /**
   * Attempts to retrieve the document info from the query params in the URL and make the requests.
   */
  private getParams(): void {
    this.route.queryParams.pipe(first()).subscribe({
      next: (params) => {
        if (!params.stationId || !params.documentId) {
          this.handleInvalidParams();
        } else {
          this.documentId = params.documentId;
          this.stationId = params.stationId;
        }
      },
      error: (error: unknown) => {
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Navigates the user back to dashboard and displays a message about the invalid params.
   */
  private handleInvalidParams(): void {
    this.errorService.displayError(
      'The link you followed is invalid. Please double check the URL and try again.',
      new Error('Invalid params for document')
    );
  }

  /**
   * Close upload file modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }

  /**
   * Gets the details of selected file.
   *
   * @param event File selected event.
   */
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.file = files[0];
    if (this.file) {
      this.updateFieldAnswer();
    }
  }

  /**
   * Gets the details of dragged file.
   *
   * @param event List of files dragged into file drop zone.
   */
  onFilesDragged(event: FileList): void {
    this.file = event[0];
    if (this.file) {
      this.updateFieldAnswer();
    }
  }

  /**
   * Save uploaded file.
   */
  saveData(): void {
    this.dialogRef.close({ name: this.file?.name, size: this.fileSize });
  }

  /**
   * Gets the size of uploaded file in kilobyte.
   *
   * @returns Size of uploaded file.
   */
  get fileSize(): number {
    return this.file ? this.file.size / 1024 : 0;
  }

  /**
   * Allow the answer to be updated in the documentTemplate through a subject.
   *
   */
  updateFieldAnswer(): void {
    const documentAnswer: DocumentAnswer = {
      questionRithmId: this.field.rithmId,
      documentRithmId: this.documentId,
      stationRithmId: this.stationId,
      value: this.file ? this.file?.name : '',
      type: this.field.questionType,
      questionUpdated: true,
      file: this.file,
      filename: this.file?.name,
    };
    this.documentService.updateAnswerSubject(documentAnswer);
    this.isLoading = true;
    this.documentService
      .saveDocumentAnswer(this.documentId, [documentAnswer])
      .pipe(first())
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.fileUpload = true;
          this.popupService.notify(
            'The document has been uploaded successfully.'
          );
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.closeModal();
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
