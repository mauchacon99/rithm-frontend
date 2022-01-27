import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import {
  Question,
  QuestionFieldType,
  OperatorType,
  OperandType,
} from 'src/models';

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
  textGroup = [
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
  contentGroup = [
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
  numberGroup = [
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
  dateGroup = [
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
  selectGroup = [
    {
      text: 'is',
      value: OperatorType.EqualTo,
    },
    {
      text: 'is not',
      value: OperatorType.NotEqualTo,
    },
  ];

  /** The operatorList to be shown. */
  operatorList: {
    /** The operator selector text to show.*/
    text: string;
    /** The operator selector value.*/
    value: OperatorType;
  }[] = [];

  /** The value of the first question field type. */
  firstFieldType!: QuestionFieldType;

  /** The value of the first operand type. */
  firstOperandType!: OperandType;

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
          //Filter to show questions that are different to Instructions
          this.questionStation = this.questionStation.filter(
            (question: Question) =>
              question.questionType !== QuestionFieldType.Instructions
          );
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
   * Set operator list for the comparison type and set first operand type.
   *
   * @param fieldType The field type to show the options of the corresponding operator list.
   */
  setOperatorList(fieldType: QuestionFieldType): void {
    this.operatorList = [];
    this.operator = '';
    //Set first field type for options of the second operand
    this.firstFieldType = fieldType;
    switch (fieldType) {
      case QuestionFieldType.ShortText:
      case QuestionFieldType.URL:
      case QuestionFieldType.Email:
      case QuestionFieldType.AddressLine:
      case QuestionFieldType.Phone:
      case QuestionFieldType.MultiSelect:
        this.operatorList = this.textGroup;
        this.firstOperandType =
          fieldType !== QuestionFieldType.Phone
            ? OperandType.String
            : OperandType.Number;
        break;
      case QuestionFieldType.LongText:
      case QuestionFieldType.CheckList:
        this.operatorList = this.contentGroup;
        this.firstOperandType = OperandType.String;
        break;
      case QuestionFieldType.Number:
      case QuestionFieldType.Currency:
        this.operatorList = this.numberGroup;
        this.firstOperandType = OperandType.Number;
        break;
      case QuestionFieldType.Date:
        this.operatorList = this.dateGroup;
        this.firstOperandType = OperandType.Date;
        break;
      case QuestionFieldType.Select:
        this.operatorList = this.selectGroup;
        this.firstOperandType = OperandType.String;
    }
  }
}
