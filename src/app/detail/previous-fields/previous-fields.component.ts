import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { PreviousFieldModalComponent } from 'src/app/shared/previous-field-modal/previous-field-modal.component';
import { Question, QuestionFieldType } from 'src/models';

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

/** Emit the close modal. */
@Output() modalClosed: EventEmitter<boolean> = new EventEmitter<boolean>();


constructor(
  private stationService: StationService,
  private errorService: ErrorService,
  private dialog: MatDialog,
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
   getStationPreviousQuestions(stationId: string, isPrivate: boolean): void{
    this.isLoading = true;
    this.stationService.getStationPreviousQuestions(stationId, isPrivate)
    .pipe(first())
    .subscribe({
      next: (questions: Question[]) => {
        if (questions) {
          this.questions = questions;
          this.questions.push({
            rithmId: '3j4k-3h2j-hj4j' + isPrivate,
            prompt: 'Label #1',
            instructions: '',
            questionType: QuestionFieldType.ShortText,
            isReadOnly: false,
            isRequired: false,
            isPrivate: isPrivate,
            children: [],
          });
          this.questions.push({
            rithmId: '3j4k-3h2j-hj2j' + isPrivate,
            prompt: 'Label #2',
            instructions: '',
            questionType: QuestionFieldType.ShortText,
            isReadOnly: false,
            isRequired: false,
            isPrivate: isPrivate,
            children: [],
          });
        }
        this.isLoading = false;
      }, error: (error: unknown) => {
        this.questionsError=true;
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
   * @param previousField  The previous field of questions to move.
   */
  openPreviousFieldModal(previousField: Question): void {
    this.dialog.open(PreviousFieldModalComponent, {
      minWidth: '325px',
      data: { rithmId: previousField.rithmId, isPrivate: previousField.isPrivate }
    });
  }
}
