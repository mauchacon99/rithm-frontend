import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { FlowLogicRule } from 'src/models';
import { ErrorService } from 'src/app/core/error.service';
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

  /** The station Flow Logic Rule. */
  stationFlowLogic!: FlowLogicRule;

  /** The value of the first operand. */
  firstOperand = '';

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
    this.getStationFlowLogicRule();
  }

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }

  /**
   * Get each station flow rules.
   */
  private getStationFlowLogicRule(): void {
    this.stationService
      .getStationFlowLogicRule(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (stationFlowLogic) => {
          this.stationFlowLogic = stationFlowLogic;
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
