import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { CustomField, Question } from 'src/models';
import { PopupService } from 'src/app/core/popup.service';
import { Subject } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { QuestionFieldType } from 'src/models/enums/question-field-type.enum';
import { MatDialog } from '@angular/material/dialog';
import { AnswersModalComponent } from './answers-modal/answers-modal.component';

/**
 * Component for station private/all fields in extension panel.
 */
@Component({
  selector: 'app-previous-fields[stationId][isPrivate][isStation]',
  templateUrl: './previous-fields.component.html',
  styleUrls: ['./previous-fields.component.scss'],
})
export class PreviousFieldsComponent implements OnInit, OnDestroy {
  /** The station id used to get previous fields. */
  @Input() stationId!: string;

  /** The type of fields requested private/true - all/false. */
  @Input() isPrivate!: boolean;

  /** The document id used to get document previous questions.*/
  @Input() documentId!: string;

  /** Comes from station or not. */
  @Input() isStation = true;

  /** The question that will be moved to the template area. */
  @Output() private movingQuestion = new EventEmitter<Question>();

  /** Comes from build drawer component or not. */
  @Input() isBuildDrawer!: boolean;

  /** Custom fields to form input category data from build drawer component. */
  @Input() customFields: CustomField[] = [];

  /** Contains the list of inputFrame created. */
  @Input() inputFrameList: string[] = [];

  /** The list of station private/all questions. */
  questions: Question[] = [];

  /** Enable error message if question request fails. */
  questionsError = false;

  /** Whether questions is loading. */
  isLoading = false;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private popupService: PopupService,
    private documentService: DocumentService,
    private dialog: MatDialog
  ) {}

  /**
   * Load private/all Questions.
   */
  ngOnInit(): void {
    if (this.isStation) {
      this.getStationPreviousQuestions();
      this.stationService.questionToMove$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data) => {
          const questionData: Question = data;
          if (questionData.isPrivate === this.isPrivate) {
            this.questions.push(questionData);
          }
        });
    } else {
      this.getDocumentPreviousQuestions();
    }
  }

  /**
   * Whether the field is a selectable answer type or not.
   *
   * @param fieldType Current iterated question field type.
   * @returns If the current type belongs to a selectable Answer question type.
   */
  isSelectableAnswerType(fieldType: QuestionFieldType): boolean {
    return (
      fieldType === QuestionFieldType.Select ||
      fieldType === QuestionFieldType.MultiSelect ||
      fieldType === QuestionFieldType.CheckList
    );
  }

  /**
   * Get the possible selected answers to be displayed.
   *
   * @param question The question to get its current selected answers.
   * @returns An string for all of the selected answers.
   */
  returnSelectableAnswers(question: Question): string | null {
    let selectedAnswers: string | null = '';
    if (question.answer && question.answer.asArray?.length) {
      question.answer.asArray?.forEach((selected) => {
        selectedAnswers += selected.isChecked ? selected.value + ' | ' : '';
      });
    }
    selectedAnswers = selectedAnswers.length
      ? selectedAnswers.slice(0, -2)
      : null;
    return selectedAnswers;
  }

  /**
   * Get all station previous private/all questions.
   *
   */
  private getStationPreviousQuestions(): void {
    this.isLoading = true;
    this.stationService
      .getStationPreviousQuestions(this.stationId, this.isPrivate)
      .pipe(first())
      .subscribe({
        next: (questions: Question[]) => {
          if (questions) {
            this.questions = questions;
          }
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.questionsError = true;
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Get previous field icon.
   *
   * @param fieldType The question type field to get the icon.
   * @returns String of the icon.
   */
  getPreviousFieldIcon(fieldType: QuestionFieldType): string {
    const customField = this.customFields.find(
      (item: CustomField) => item.questionType === fieldType
    );
    return customField ? customField.icon : 'fa-regular fa-circle-question';
  }

  /**
   * Open a modal to move a field from all/private to the template area.
   *
   * @param  previousField The previous field in the questions list.
   */
  async moveFieldToTemplate(previousField: Question): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Move field?',
      message:
        'Are you sure you want to move this field into the template area?',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
    });
    if (confirm) {
      this.questions = this.questions.filter(
        (question: Question) => question.rithmId !== previousField.rithmId
      );
      this.movingQuestion.emit(previousField);
    }
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Get Previous Questions.
   *
   */
  private getDocumentPreviousQuestions(): void {
    this.isLoading = true;
    this.documentService
      .getDocumentPreviousQuestions(
        this.documentId,
        this.stationId,
        this.isPrivate
      )
      .pipe(first())
      .subscribe({
        next: (previousQuestions) => {
          this.isLoading = false;
          this.questions = previousQuestions;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Open The Modal display of previous questions.
   *
   * @param previousQuestion The Question of the document.
   */
  openModalPreviousQuestions(previousQuestion: Question): void {
    this.dialog.open(AnswersModalComponent, {
      data: {
        title: `${previousQuestion.prompt}`,
        isSelectableType: this.isSelectableAnswerType(
          previousQuestion.questionType
        ),
        information: previousQuestion,
      },
      width: '500px',
      maxWidth: '1200px',
    });
  }
}
