import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import {
  Question,
  QuestionFieldType,
  OperatorType,
  OperandType,
  DocumentAnswer,
} from 'src/models';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';
import { NumberFieldComponent } from 'src/app/shared/fields/number-field/number-field.component';
import { DateFieldComponent } from 'src/app/shared/fields/date-field/date-field.component';
import { DocumentService } from 'src/app/core/document.service';

/**
 * Reusable component for displaying the information to add a new rule.
 */
@Component({
  selector: 'app-rule-modal',
  templateUrl: './rule-modal.component.html',
  styleUrls: ['./rule-modal.component.scss'],
  providers: [],
})
export class RuleModalComponent implements OnInit, AfterViewChecked {
  /** Station Rithm id. */
  stationRithmId = '';

  /** Orientation for stepper. */
  stepperOrientation$: Observable<StepperOrientation>;

  /** Get current and previous Questions for Stations. */
  questionStation: Question[] = [];

  /** The error if question stations fails . */
  questionStationError = false;

  /** Loading in current and previous questions for stations. */
  questionStationLoading = false;

  /** The component text-field to be updated for step 3. */
  @ViewChild('textField', { static: false })
  textField!: TextFieldComponent;

  /** The component number-field to be updated for step 3. */
  @ViewChild('numberField', { static: false })
  numberField!: NumberFieldComponent;

  /** The component date-field to be updated for step 3. */
  @ViewChild('dateField', { static: false })
  dateField!: DateFieldComponent;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** The value of the first operand. */
  firstOperand = '';

  /** The value of the first question field type. */
  firstFieldType!: QuestionFieldType;

  /** The value of the first operand type. */
  firstOperandType!: OperandType;

  /** The first operand of text to show. */
  firstOperandText = '';

  /** The value of the operator. */
  operator = '';

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

  /** The operator text to show. */
  operatorText = '';

  /** The operand type for the field. */
  operandType = OperandType;

  /** The value of the second operand. */
  secondOperand = '';

  /** The second operand of text to show. */
  secondOperandText = '';

  /** The second operand of field. */
  secondOperandField: Question = {
    questionType: QuestionFieldType.ShortText,
    rithmId: Math.random().toString(36).slice(2),
    prompt: 'Custom Value',
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    value: '',
    children: [],
  };

  constructor(
    public dialogRef: MatDialogRef<RuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public rithmId: string,
    breakpointObserver: BreakpointObserver,
    private stationService: StationService,
    private errorService: ErrorService,
    private readonly changeDetectorR: ChangeDetectorRef,
    private documentService: DocumentService
  ) {
    this.stationRithmId = rithmId;
    this.stepperOrientation$ = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    //Gets from documentAnswer the value to be set to the second operand
    this.documentService.documentAnswer$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((answer: DocumentAnswer) => {
        if (answer.value !== '') {
          this.secondOperand = '';
          this.secondOperandField.value = answer.value;
          this.secondOperandText = answer.value;
        } else {
          this.secondOperandField.value = '';
          this.secondOperandText = '';
        }
      });
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStationQuestions();
  }

  /**
   * Checks after the component views and child views.
   */
  ngAfterViewChecked(): void {
    this.changeDetectorR.detectChanges();
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
   * Get the list of questions for the second operand.
   *
   * @returns Questions for the second operand options.
   */
  get secondOperandQuestionList(): Question[] {
    const secondOperandQuestions: Question[] = this.questionStation.filter(
      (question: Question) =>
        question.rithmId !== this.firstOperand &&
        question.questionType === this.firstFieldType
    );
    return secondOperandQuestions;
  }

  /**
   * Set operator list for the comparison type and set first operand type.
   *
   * @param fieldType The field type to show the options of the corresponding operator list.
   * @param text The text to be shown for the first operand.
   */
  setOperatorList(fieldType: QuestionFieldType, text: string): void {
    this.operatorList = [];
    this.operator = '';
    //Set first field type for options of the second operand
    this.firstFieldType = fieldType;
    //Set first operand of text to show. */
    this.firstOperandText = text;
    this.secondOperandField.questionType = fieldType;
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
        break;
    }
    this.refreshComponentField();
  }

  /**
   * Refresh component field when a first operand is selected.
   */
  refreshComponentField(): void {
    switch (this.firstOperandType) {
      case OperandType.String:
        this.textField?.ngOnInit();
        break;
      case OperandType.Number:
        this.numberField?.ngOnInit();
        break;
      case OperandType.Date:
        this.dateField?.ngOnInit();
        break;
    }
  }

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
