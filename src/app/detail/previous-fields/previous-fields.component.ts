import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { Question } from 'src/models';

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

constructor(
  private stationService: StationService,
  private errorService: ErrorService,
){}

/**
 * Load private/all Questions.
 */
ngOnInit(): void{
  this.getStationPreviousQuestions(this.stationId, this.isPrivate);
}

  /**
   * Get all station previous private/all questions.
   *
   * @param stationId The Specific id of station.
   * @param isPrivate True/false returns private/all questions.
   */
  getStationPreviousQuestions(stationId: string, isPrivate: boolean): void {
    this.isLoading = true;
    this.stationService.getStationPreviousQuestions(stationId, isPrivate)
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
  * Update all station previous private/all questions.
  *
  * @param stationId The Specific id of station.
  * @param previousQuestion The Specific previous question of station.
  * @param isPrivate True assigns the private questions - False assigns all questions.
  */
  updateStationPreviousQuestions(stationId: string, previousQuestion: Question[], isPrivate: boolean): void {
    this.isLoading = true;
    this.stationService.updateStationPreviousQuestions(stationId, previousQuestion, isPrivate)
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
}
