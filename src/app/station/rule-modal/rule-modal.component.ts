import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  OnDestroy,
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
  RuleEquation,
  RuleOperand,
} from 'src/models';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';
import { NumberFieldComponent } from 'src/app/shared/fields/number-field/number-field.component';
import { DateFieldComponent } from 'src/app/shared/fields/date-field/date-field.component';
import { DocumentService } from 'src/app/core/document.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SelectFieldComponent } from 'src/app/shared/fields/select-field/select-field.component';

/**
 * Reusable component for displaying the information to add a new rule.
 */
@Component({
  selector: 'app-rule-modal',
  templateUrl: './rule-modal.component.html',
  styleUrls: ['./rule-modal.component.scss'],
  providers: [],
})
export class RuleModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  /** The component text-field to be updated for step 3. */
  @ViewChild('textField', { static: false })
  textField!: TextFieldComponent;

  /** The component number-field to be updated for step 3. */
  @ViewChild('numberField', { static: false })
  numberField!: NumberFieldComponent;

  /** The component date-field to be updated for step 3. */
  @ViewChild('dateField', { static: false })
  dateField!: DateFieldComponent;

  /** The component date-field to be updated for step 3. */
  @ViewChild('selectField', { static: false })
  selectField!: SelectFieldComponent;

  /** The component date-field to be updated for step 3. */
  @ViewChild('checkField', { static: false })
  checkField!: SelectFieldComponent;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

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

  /** The rithmId of the first selected question to be compared. */
  firstOperandQuestionRithmId = '';

  /** The value of the first operand. */
  firstOperand: RuleOperand = {
    type: OperandType.String,
    value: '',
    text: '',
  };

  /** The rithmId of the second selected question to be compared if needed. */
  secondOperandQuestionRithmId = '';

  /** Set the text to show when the secondOperand is a field. */
  secondOperandQuestionPrompt = '';

  /** The value of the second operand. */
  secondOperand: RuleOperand = {
    type: OperandType.String,
    value: '',
    text: '',
  };

  /** The type of the first questions selected for the first operand. */
  firstOperandQuestionType!: QuestionFieldType;

  operatorSelected: {
    /**Operator text. */
    text: string;
    /**Operator type */
    value: OperatorType;
  } | null = null;

  /** Get all the existing Operand types. */
  operandType = OperandType;

  /** Get all the existing question fields types. */
  fieldTypes = QuestionFieldType;

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

  /** The default value for the second question if is needed.*/
  secondOperandDefaultQuestion: Question = {
    questionType: QuestionFieldType.ShortText,
    rithmId: Math.random().toString(36).slice(2),
    prompt: 'Custom',
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    value: '',
    children: [],
    possibleAnswers: [],
  };

  /** The rule to be returned and added to new rulesArray. */
  ruleToAdd!: RuleEquation;

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
        this.secondOperand.text = answer.value;
        this.secondOperand.value = answer.value;
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
   * Get the list of questions for the second operand.
   *
   * @returns Questions for the second operand options.
   */
  get secondOperandQuestionList(): Question[] {
    const secondOperandQuestions: Question[] = this.questionStation.filter(
      (question: Question) =>
        question.rithmId !== this.firstOperandQuestionRithmId &&
        question.questionType === this.firstOperandQuestionType
    );
    return secondOperandQuestions;
  }

  /**
   * Returns the second Operand to display in the las step.
   *
   * @returns A normal value or a rithmId to display.
   */
  get secondOperandToShow(): string {
    return this.secondOperand.type === OperandType.Field
      ? this.secondOperandQuestionPrompt
      : this.secondOperand.value;
  }

  /**
   * Returns the second Operand to display in the las step.
   *
   * @returns A normal value or a rithmId to display.
   */
  get displayOperatorType(): string {
    return this.firstOperand.type === this.operandType.String
      ? 'string'
      : this.firstOperand.type === this.operandType.Date
      ? 'date'
      : this.firstOperand.type === this.operandType.Number
      ? 'number'
      : this.firstOperand.type === this.operandType.Field
      ? this.firstOperandQuestionType === this.fieldTypes.Select
        ? 'select'
        : this.firstOperandQuestionType === this.fieldTypes.MultiSelect
        ? 'multiselect'
        : 'checklist'
      : 'string';
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
   * @param questionSelected The field type to show the options of the corresponding operator list.
   */
  setFirstOperandInformation(questionSelected: Question): void {
    this.firstOperandQuestionType = questionSelected.questionType;
    this.secondOperandDefaultQuestion.questionType =
      questionSelected.questionType;
    this.firstOperand.value = questionSelected.rithmId;
    this.firstOperand.text = questionSelected.prompt;
    switch (questionSelected.questionType) {
      case QuestionFieldType.ShortText:
      case QuestionFieldType.URL:
      case QuestionFieldType.Email:
      case QuestionFieldType.Phone:
        this.operatorList = this.textGroup;
        this.firstOperand.type =
          questionSelected.questionType !== QuestionFieldType.Phone
            ? OperandType.String
            : OperandType.Number;
        this.secondOperand.type = this.firstOperand.type;
        break;
      case QuestionFieldType.LongText:
        this.operatorList = this.contentGroup;
        this.firstOperand.type = OperandType.String;
        this.secondOperand.type = this.firstOperand.type;
        break;

      case QuestionFieldType.Number:
      case QuestionFieldType.Currency:
        this.operatorList = this.numberGroup;
        this.firstOperand.type = OperandType.Number;
        this.secondOperand.type = this.firstOperand.type;
        break;
      case QuestionFieldType.Date:
        this.operatorList = this.dateGroup;
        this.firstOperand.type = OperandType.Date;
        this.secondOperand.type = this.firstOperand.type;
        break;
      case QuestionFieldType.MultiSelect:
      case QuestionFieldType.Select:
        this.operatorList = this.selectGroup;
        this.secondOperand.type = OperandType.String;
        this.secondOperandDefaultQuestion.prompt = questionSelected.prompt;
        this.secondOperandDefaultQuestion.possibleAnswers =
          questionSelected.possibleAnswers;
        break;
      case QuestionFieldType.CheckList:
        this.operatorList = this.selectGroup;
        this.firstOperand.type = OperandType.Field;
        this.secondOperand.type = OperandType.String;
        this.secondOperandDefaultQuestion.prompt = questionSelected.prompt;
        this.secondOperandDefaultQuestion.questionType =
          QuestionFieldType.MultiSelect;
        this.secondOperandDefaultQuestion.possibleAnswers =
          questionSelected.possibleAnswers;
        break;
    }
    this.resetQuestionFieldComponent();
  }

  /**
   * Set operator list for the comparison type and set first operand type.
   *
   * @param questionSelected The field type to show the options of the corresponding operator list.
   */
  setSecondOperandInformation(questionSelected: Question): void {
    this.secondOperandQuestionPrompt = questionSelected.prompt;
    this.secondOperand.type = OperandType.Field;
  }

  /**
   * Reset component field when a first operand is selected.
   */
  resetQuestionFieldComponent(): void {
    switch (this.displayOperatorType) {
      case 'string':
        this.textField?.ngOnInit();
        break;
      case 'number':
        this.numberField?.ngOnInit();
        break;
      case 'date':
        this.dateField?.ngOnInit();
        break;
      case 'select':
      case 'multiselect':
      case 'checklist':
        this.selectField?.ngOnInit();
        break;
    }
  }

  /**
   * Change and listen to each step selection.
   *
   * @param event The stepper selection event for all steps.
   */
  clearOnStepBack(event: StepperSelectionEvent): void {
    if (event.selectedIndex < event.previouslySelectedIndex) {
      switch (event.selectedIndex) {
        case 0:
          this.operatorSelected = null;
          this.secondOperand.value = '';
          this.secondOperand.type = OperandType.String;
          this.secondOperandQuestionPrompt = '';
          this.resetQuestionFieldComponent();
          break;
        case 1:
          this.secondOperand.value = '';
          this.secondOperand.type = OperandType.String;
          this.secondOperandQuestionPrompt = '';
          this.resetQuestionFieldComponent();
          break;
      }
    } else if (event.selectedIndex === 2) {
      this.resetQuestionFieldComponent();
    }
  }

  /**
   * Set The value for the current Rule.
   */
  setEquationContent(): void {
    this.ruleToAdd = {
      leftOperand: {
        type: this.firstOperand.type,
        value: this.firstOperandQuestionRithmId,
        text: this.firstOperand.text,
      },
      operatorType: this.operatorSelected
        ? this.operatorSelected.value
        : OperatorType.EqualTo,
      rightOperand: {
        type: this.secondOperand.type,
        value: this.secondOperand.value,
        text: this.secondOperandToShow,
      },
    };
    this.dialogRef.close(this.ruleToAdd);
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
