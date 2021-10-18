import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class PrivateFieldsComponent implements OnDestroy {

  /** Whether the private field data is loading. */
  isLoading = false;

  /** The Id of the station for which the previous questions are being requested. */
  @Input() stationId!: string;

  /** The list of station private-items. */
  stationPrivateItems: Question[] = [];

  /** Observable for when the component is destroyed. */
  destroyed$ = new Subject();

  /**
   * Provisional for Repeat data cards field private.
   *
   * @returns Fields private for Cards provisional.
   */
  get fieldsPrivatesProvisional(): Array<[]> {
    return Array(5);
  }

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
  ){
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
    .pipe(takeUntil(this.destroyed$))
    .subscribe((questions: Question[]) => {
      if (questions) {
        this.stationPrivateItems = questions;
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

  /**
   * Completes all subscriptions.
   */
   ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
