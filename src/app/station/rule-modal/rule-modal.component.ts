import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
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
export class RuleModalComponent implements OnInit {
  /** Station Rithm id. */
  stationRithmId = '';

  /** Orientation for stepper. */
  stepperOrientation$: Observable<StepperOrientation>;

  /** The value of the first operand. */
  firstOperand = '';

  /** Get current and previous Questions for Stations. */
  questionStation: Question[] = [];

  /** The value of the operator. */
  operator = '';

  /** The error if question stations fails . */
  questionStationError = false;

  /** The value of the second operand. */
  secondOperand = '';

  /** Loading in current and previous questions for stations. */
  questionStationLoading = false;

  /** The value of the operands to be compared. */
  result = 'Fieldset #1 is not Fieldset #2';

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
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStationQuestions();
  }

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }

  /**
   * Get current and previous questions.
   */
  getStationQuestions(): void {
    this.questionStationLoading = true;
    this.stationService
      .getStationQuestions(this.stationRithmId, true)
      .pipe(first())
      .subscribe({
        next: (questions) => {
          this.questionStationLoading = false;
          this.questionStation = questions;
        },
        error: (error: unknown) => {
          this.questionStationError = true;
          this.questionStationLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
