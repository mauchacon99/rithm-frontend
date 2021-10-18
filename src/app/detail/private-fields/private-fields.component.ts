import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { Question } from 'src/models';

/**
 * Component for station private fields extension panel.
 */
@Component({
  selector: 'app-private-fields',
  templateUrl: './private-fields.component.html',
  styleUrls: ['./private-fields.component.scss']
})
export class PrivateFieldsComponent implements OnInit {

/** The private questions loaded by station-component. */
@Input() stationId = '';

/** The list of station private questions. */
questions: Question[] = [];

/** Whether questions is loading. */
isLoading = false;

constructor(
  private stationService: StationService,
  private errorService: ErrorService,
){

}

/**
 * Loading Private Questions.
 */
ngOnInit(): void{
  this.getStationPreviousQuestions(this.stationId, true);
}

  /**
   * Get all station previous private questions.
   *
   * @param stationId The Specific id of station.
   * @param isPrivate True returns private questions.
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
