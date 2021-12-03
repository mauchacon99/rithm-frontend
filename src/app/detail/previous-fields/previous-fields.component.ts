import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { Question } from 'src/models';
import { PopupService } from 'src/app/core/popup.service';
import { Subject } from 'rxjs';

/**
 * Component for station private/all fields in extension panel.
 */
@Component({
  selector: 'app-previous-fields[stationId][isPrivate]',
  templateUrl: './previous-fields.component.html',
  styleUrls: ['./previous-fields.component.scss']
})
export class PreviousFieldsComponent implements OnInit {

/** The station id used to get previous fields. */
@Input() stationId!: string;

/** The type of fields requested private/true - all/false. */
@Input() isPrivate!: boolean;

/** The list of station private/all questions. */
questions: Question[] = [];

/** Enable error message if question request fails. */
questionsError=false;

/** Whether questions is loading. */
isLoading = false;

/** The question that will be moved to the template area. */
@Output() private movingQuestion = new EventEmitter<Question>();

/** Observable for when the component is destroyed. */
private destroyed$ = new Subject<void>();

constructor(
  private stationService: StationService,
  private errorService: ErrorService,
  private popupService: PopupService
){}

/**
 * Load private/all Questions.
 */
ngOnInit(): void{
  this.getStationPreviousQuestions();
  this.stationService.questionToMove$
    .pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (data) => {
        const questionData: Question = data;
        if (Object.keys(questionData).length !== 0) {
          if (questionData.isPrivate === this.isPrivate){
            this.questions.push(questionData);
          }
        }
      }, error: (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      }
    });
}

  /**
   * Get all station previous private/all questions.
   *
   */
  getStationPreviousQuestions(): void {
    this.isLoading = true;
    this.stationService.getStationPreviousQuestions(this.stationId, this.isPrivate)
      .pipe(first())
      .subscribe({
        next: (questions: Question[]) => {
          if (questions) {
            this.questions = questions;
          }
          this.isLoading = false;
        }, error: (error: unknown) => {
          this.questionsError = true;
          this.isLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Open a modal to move a field from all/private to the template area.
   *
   * @param  previousField The previous field in the questions list.
   */
  async moveFieldToTemplate(previousField: Question): Promise<void> {
     const confirm = await this.popupService.confirm({
      title: 'Move field?',
      message: 'Are you sure you want to move this field into the template area?',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close'
    });
    if (confirm) {
      this.questions = this.questions.filter((question: Question) => question.rithmId !== previousField.rithmId);
      this.movingQuestion.emit(previousField);
    }
  }
}
