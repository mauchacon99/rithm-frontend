import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { Question, QuestionFieldType } from 'src/models';
import { OperatorType } from 'src/models/enums/operator-type.enum';
import { OperatorGroup } from 'src/models/operator-group';

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

  /** Text group for the operator options. */
  textGroup: OperatorGroup[] = [
    {
      text: 'is',
      value: OperatorType.EqualTo,
    },
    {
      text: 'is not',
      value: OperatorType.NotEqualTo,
    },
    {
      text: 'contains',
      value: OperatorType.Contains,
    },
  ];

  /** Content group for the operator options. */
  contentGroup: OperatorGroup[] = [
    {
      text: 'contains',
      value: OperatorType.Contains,
    },
    {
      text: 'does not contain',
      value: OperatorType.NotContains,
    },
  ];

  /** Number group for the operator options. */
  numberGroup: OperatorGroup[] = [
    {
      text: 'is',
      value: OperatorType.EqualTo,
    },
    {
      text: 'is not',
      value: OperatorType.NotEqualTo,
    },
    {
      text: 'greater than',
      value: OperatorType.GreaterThan,
    },
    {
      text: 'less than',
      value: OperatorType.LesserThan,
    },
  ];

  /** Date group for the operator options. */
  dateGroup: OperatorGroup[] = [
    {
      text: 'before',
      value: OperatorType.Before,
    },
    {
      text: 'after',
      value: OperatorType.After,
    },
    {
      text: 'on',
      value: OperatorType.On,
    },
  ];

  /** Select group for the operator options. */
  selectGroup: OperatorGroup[] = [
    {
      text: 'is',
      value: OperatorType.EqualTo,
    },
    {
      text: 'is not',
      value: OperatorType.NotEqualTo,
    },
  ];

  /** The options of the comparison type. */
  operatorGroup: OperatorGroup[] = [];

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

  /**
   * Set operator group for the comparison type.
   *
   * @param fieldType The field type to show the options of the corresponding operator group.
   */
  setOperatorGroup(fieldType: QuestionFieldType): void {
    this.operatorGroup = [];
    switch (fieldType) {
      case QuestionFieldType.ShortText:
      case QuestionFieldType.URL:
      case QuestionFieldType.Email:
      case QuestionFieldType.AddressLine:
      case QuestionFieldType.Phone:
      case QuestionFieldType.MultiSelect:
        this.operatorGroup = [...this.textGroup];
        break;
      case QuestionFieldType.LongText:
      case QuestionFieldType.CheckList:
        this.operatorGroup = [...this.contentGroup];
        break;
      case QuestionFieldType.Number:
      case QuestionFieldType.Currency:
        this.operatorGroup = [...this.numberGroup];
        break;
      case QuestionFieldType.Date:
        this.operatorGroup = [...this.dateGroup];
        break;
      case QuestionFieldType.Select:
        this.operatorGroup = [...this.selectGroup];
    }
  }
}
