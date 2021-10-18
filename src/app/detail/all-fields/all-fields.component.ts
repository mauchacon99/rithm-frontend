import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { Question } from 'src/models';

/**
 * Component for all fields.
 */
@Component({
  selector: 'app-all-fields[stationId]',
  templateUrl: './all-fields.component.html',
  styleUrls: ['./all-fields.component.scss']
})
export class AllFieldsComponent implements OnInit{

/** The public questions loaded by station-component. */
@Input() stationId = '';

/** The list of station public questions. */
questions: Question[] = [];

/** Whether questions is loading. */
isLoading = false;

constructor(
  private stationService: StationService,
  private errorService: ErrorService,
){

}

/**
 * Loading Public Questions.
 */
ngOnInit(): void{
  this.getStationPreviousQuestions(this.stationId, false);
}

  /**
   * Get all station previous public questions.
   *
   * @param stationId The Specific id of station.
   * @param isPrivate False returns public questions.
   */
   getStationPreviousQuestions(stationId: string, isPrivate: boolean): void{
     this.isLoading = true;
    this.stationService.getStationPreviousQuestions(stationId, isPrivate)
    .pipe(first())
    .subscribe((questions: Question[]) => {
      if (questions) {
        this.questions = questions;
      }
      this.isLoading = false;
    }, (error: unknown) => {
      this.isLoading = false;
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error
      );
    });
  }

}
