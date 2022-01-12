import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable, first } from 'rxjs';
import { map } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { Question } from 'src/models';
/**
 * Reusable component for displaying the information to add a new rule.
 */
@Component({
  selector: 'app-rule-modal',
  templateUrl: './rule-modal.component.html',
  styleUrls: ['./rule-modal.component.scss'],
})
export class RuleModalComponent {
  /** Station Rithm id. */
  stationRithmId = '';

  /** Orientation for stepper. */
  stepperOrientation$: Observable<StepperOrientation>;

  /** The value of the first operand. */
  firstOperand = '';

  /** Get current and previous Questions for Stations. */
  questionStation: Question[] = [];

  constructor(
    public dialogRef: MatDialogRef<RuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public rithmId: string,
    breakpointObserver: BreakpointObserver,
    private stationService: StationService,
    private errorService: ErrorService
  ) {
    this.stationRithmId = rithmId;
    this.stepperOrientation$ = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }

  /**
   * Get test for previous and current Questions.
   */
  getStationQuestions(): void {
    this.stationService
      .getStationQuestions(this.stationRithmId, true)
      .pipe(first())
      .subscribe({
        next: (questions) => {
          this.questionStation = questions;
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
