import { Component, Input, ViewChild, OnInit } from '@angular/core';

import { first } from 'rxjs/operators';
import {
  FlowLogicRule,
  OperandType,
  OperatorType,
  Question,
  QuestionFieldType,
  RuleEquation,
  RuleModalOperator,
  RuleOperand,
} from 'src/models';
import { STATES } from 'src/helpers';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';
import { NumberFieldComponent } from 'src/app/shared/fields/number-field/number-field.component';
import { DateFieldComponent } from 'src/app/shared/fields/date-field/date-field.component';
import { SelectFieldComponent } from 'src/app/shared/fields/select-field/select-field.component';

/**
 *
 */
@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ConditionsComponent implements OnInit {
  /** The component text-field to be updated. */
  @ViewChild('textField', { static: false })
  textField!: TextFieldComponent;

  /** The component number-field to be updated. */
  @ViewChild('numberField', { static: false })
  numberField!: NumberFieldComponent;

  /** The component date-field to be updated. */
  @ViewChild('dateField', { static: false })
  dateField!: DateFieldComponent;

  /** The component date-field to be updated. */
  @ViewChild('selectField', { static: false })
  selectField!: SelectFieldComponent;

  /** The station id used to get previous fields. */
  @Input() stationRithmId!: string;

  /** The station Flow Logic Rule. */
  @Input() flowLogicRules: FlowLogicRule[] = [];

  /** Current station's fields as options for the select field name. */
  @Input() currentStationQuestions: Question[] = [];

  /** List of question field type. */
  questionFieldType = QuestionFieldType;

  /** Selected value condition type for rules. */
  selectedConditionType = 'all';

  /** The rithmId of the first selected question to be compared. */
  firstOperandQuestionRithmId = '';

  /** The rithmId of the second selected question to be compared if needed. */
  secondOperandQuestionRithmId = '';

  /** Set the text to show when the secondOperand is a field. */
  secondOperandQuestionPrompt = '';

  /** Determine what fields are currently in the form condition the previous fields. */
  switchConditionPreviousFields = true;

  /** Whether Validate custom values text format. */
  validateFormat = true;

  /** The error if rules fails. */
  openFormCondition = false;

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
    answer: {
      questionRithmId: Math.random().toString(36).slice(2),
      referAttribute: '',
      asArray: [
        {
          value: '',
          isChecked: false,
        },
      ],
      asInt: 0,
      asDecimal: 0,
      asString: '',
      asDate: '',
      value: '',
    },
  };

  /** The station Flow Logic Rule. */
  previousQuestions: Question[] = [];

  /** The type of the first questions selected for the first operand. */
  firstOperandQuestionType!: QuestionFieldType;

  /** The type of the second questions selected for the first operand. */
  secondOperandQuestionType!: QuestionFieldType;

  /** The value of the second operand. */
  secondOperand: RuleOperand = {
    type: OperandType.String,
    questionType: QuestionFieldType.ShortText,
    value: '',
    text: '',
  };

  /** The value of the first operand. */
  firstOperand: RuleOperand = {
    type: OperandType.Field,
    questionType: QuestionFieldType.ShortText,
    value: '',
    text: '',
  };

  /** The operatorList to be shown. */
  operatorList: RuleModalOperator[] = [];

  /** The information of the operator selected. */
  operatorSelected: RuleModalOperator | null = null;

  /** The rule to be returned and added to new rulesArray. */
  ruleToAdd!: RuleEquation;

  /** Static Information. */
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
    /** Not contain, not working. */
    // {
    //   text: 'does not contain',
    //   value: OperatorType.NotContains,
    // },
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
      text: 'is greater than',
      value: OperatorType.GreaterThan,
    },
    {
      text: 'is less than',
      value: OperatorType.LesserThan,
    },
    {
      text: 'is greater than or equal to',
      value: OperatorType.GreaterOrEqual,
    },
    {
      text: 'is lesser than or equal to',
      value: OperatorType.LesserOrEqual,
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
    // {
    //   text: 'on',
    //   value: OperatorType.On,
    // },
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

  constructor(
    private errorService: ErrorService,
    private stationService: StationService
  ) {}

  /**
   * Load private/all Questions.
   */
  ngOnInit(): void {
    this.getStationPreviousQuestions();
  }

  /**
   * Get Previous Questions.
   *
   */
  private getStationPreviousQuestions(): void {
    this.stationService
      .getStationPreviousQuestions(this.stationRithmId, false)
      .pipe(first())
      .subscribe({
        next: (previousQuestions) => {
          this.previousQuestions = previousQuestions;
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Returns the second Operand to display in the last step.
   *
   * @returns A normal value or a rithmId to display.
   */
  get displayOperatorType(): string {
    let display = 'string';
    switch (this.firstOperandQuestionType) {
      case QuestionFieldType.Date:
        display = 'date';
        break;
      case QuestionFieldType.State:
      case QuestionFieldType.Select:
        display = 'select';
        break;
      case QuestionFieldType.MultiSelect:
        display = 'multiselect';
        break;
      case QuestionFieldType.CheckList:
        display = 'checklist';
        break;
      case QuestionFieldType.Number:
      case QuestionFieldType.Phone:
      case QuestionFieldType.CreditCard:
      case QuestionFieldType.Currency:
      case QuestionFieldType.Zip:
        display = 'number';
        break;
      default:
        display = 'string';
        break;
    }
    return display;
  }

  /**
   * Get the list of questions for the second operand.
   *
   * @returns Questions for the second operand options.
   */
  get firstOperandQuestionList(): Question[] {
    const secondOperandQuestions: Question[] =
      this.currentStationQuestions.filter(
        (question: Question) =>
          question.questionType !== QuestionFieldType.Instructions &&
          question.questionType !== QuestionFieldType.State &&
          question.questionType !== QuestionFieldType.City &&
          question.questionType !== QuestionFieldType.Zip &&
          question.questionType !== QuestionFieldType.File &&
          question.prompt !== 'Address Line 1' &&
          question.prompt !== 'Address Line 2'
      );
    return secondOperandQuestions;
  }

  /**
   * Get the list of questions for the second operand.
   *
   * @returns Questions for the second operand options.
   */
  get secondOperandQuestionList(): Question[] {
    const secondOperandQuestions: Question[] = this.previousQuestions.filter(
      (question: Question) =>
        question.questionType === this.secondOperandQuestionType
    );
    return secondOperandQuestions;
  }

  /**
   * Set operator list for the comparison type and set first operand type.
   *
   * @param questionSelected The field type to show the options of the corresponding operator list.
   * @param childIndex Optional value to be used in case of addressLine questions.
   */
  setFirstOperandInformation(
    questionSelected: Question,
    childIndex = -1
  ): void {
    const { questionType, rithmId, prompt } = questionSelected;
    this.firstOperandQuestionType = questionType;
    this.secondOperandQuestionType = questionType;
    this.firstOperand.questionType = questionType;
    this.secondOperandDefaultQuestion.questionType = questionType;
    this.firstOperand.value = rithmId;
    this.firstOperand.text = prompt;
    this.operatorSelected = null;
    this.secondOperand.value = '';
    this.switchConditionPreviousFields = true;
    this.setOperatorList(questionType);
    if (childIndex < 0) {
      switch (questionSelected.questionType) {
        case QuestionFieldType.ShortText:
        case QuestionFieldType.URL:
        case QuestionFieldType.Email:
        case QuestionFieldType.Phone:
        case QuestionFieldType.LongText:
          this.secondOperand.type = OperandType.String;
          break;
        case QuestionFieldType.Number:
        case QuestionFieldType.Currency:
          this.secondOperand.type = OperandType.Number;
          break;
        case QuestionFieldType.Date:
          this.secondOperand.type = OperandType.Date;
          break;
        case QuestionFieldType.MultiSelect:
        case QuestionFieldType.Select:
        case QuestionFieldType.CheckList:
          this.secondOperand.type = OperandType.String;
          this.secondOperandDefaultQuestion.prompt = questionSelected.prompt;
          this.secondOperandDefaultQuestion.possibleAnswers =
            questionSelected.possibleAnswers;
          this.secondOperandDefaultQuestion.questionType =
            questionSelected.questionType === QuestionFieldType.CheckList
              ? QuestionFieldType.MultiSelect
              : questionSelected.questionType;
          break;
      }
    } else {
      const childType: QuestionFieldType =
        questionSelected.children[childIndex].questionType;

      /** Set SecondOperand field type selector and initial data. */
      this.secondOperandQuestionType = childType;
      this.secondOperandDefaultQuestion.children = questionSelected.children;
      this.secondOperandDefaultQuestion.possibleAnswers =
        childType === QuestionFieldType.State ? STATES : [];
      this.secondOperandDefaultQuestion.questionType = childType;

      this.firstOperand.value = questionSelected.children[childIndex].rithmId;
      this.firstOperand.text =
        questionSelected.prompt +
        ' / ' +
        questionSelected.children[childIndex].prompt;
      this.firstOperand.questionType = childType;
      this.firstOperandQuestionType = childType;
      if (
        childType === QuestionFieldType.State ||
        childType === QuestionFieldType.Zip
      ) {
        this.operatorList = this.selectGroup;
      } else {
        this.operatorList = this.textGroup;
      }
    }
  }

  /**
   * Set operator list for the comparison type and set first operand type.
   *
   * @param questionSelected The field type to show the options of the corresponding operator list.
   */
  setSecondOperandInformation(questionSelected: Question): void {
    this.secondOperandQuestionPrompt = questionSelected.prompt;
    this.secondOperand.questionType = questionSelected.questionType;
    this.secondOperand.text = questionSelected.prompt;
    this.switchConditionPreviousFields = true;
  }

  /**
   * Set operator list.
   *
   * @param questionType The question type to filter the operator list.
   */
  setOperatorList(questionType: QuestionFieldType): void {
    switch (questionType) {
      case QuestionFieldType.ShortText:
      case QuestionFieldType.URL:
      case QuestionFieldType.Email:
      case QuestionFieldType.Phone:
      case QuestionFieldType.MultiSelect:
      case QuestionFieldType.Select:
      case QuestionFieldType.CheckList:
        this.operatorList = this.textGroup;
        break;
      case QuestionFieldType.LongText:
        this.operatorList = this.contentGroup;
        break;

      case QuestionFieldType.Number:
      case QuestionFieldType.Currency:
        this.operatorList = this.numberGroup;
        break;
      case QuestionFieldType.Date:
        this.operatorList = this.dateGroup;
        break;
      case QuestionFieldType.AddressLine:
        this.operatorList = this.selectGroup;
        break;
      default:
        this.operatorList = this.textGroup;
        break;
    }
  }

  /**
   * Set The value for the current Rule.
   */
  setEquationContent(): void {
    this.ruleToAdd = {
      leftOperand: {
        type: this.firstOperand.type,
        questionType: this.firstOperand.questionType,
        value: this.firstOperandQuestionRithmId,
        text: this.firstOperand.text,
      },
      operatorType: this.operatorSelected
        ? this.operatorSelected.value
        : OperatorType.EqualTo,
      rightOperand: {
        type: this.secondOperand.type,
        questionType: this.secondOperand.questionType,
        value: this.secondOperand.value,
        text: this.secondOperand.text,
      },
    };
    this.resetValues();
  }

  /**
   * Reset component field when a first operand is selected.
   */
  resetQuestionFieldComponent(): void {
    this.validateFormat =
      this.operatorSelected?.text === 'contains' ? false : true;
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
   * Reset Modal Values.
   */
  resetValues(): void {
    this.firstOperandQuestionRithmId = '';
    this.firstOperand = {
      type: OperandType.Field,
      questionType: QuestionFieldType.ShortText,
      value: '',
      text: '',
    };
    this.secondOperand = {
      type: OperandType.String,
      questionType: QuestionFieldType.ShortText,
      value: '',
      text: '',
    };
    this.operatorSelected = null;
    this.operatorList = [];
    this.firstOperandQuestionType = QuestionFieldType.ShortText;
    this.secondOperandQuestionType = QuestionFieldType.ShortText;
    this.secondOperandQuestionRithmId = '';
    this.secondOperandQuestionPrompt = '';
    this.secondOperandDefaultQuestion = {
      questionType: QuestionFieldType.ShortText,
      rithmId: Math.random().toString(36).slice(2),
      prompt: 'Custom',
      isReadOnly: false,
      isRequired: false,
      isPrivate: false,
      value: '2022-02-23',
      children: [],
      possibleAnswers: [],
      answer: {
        questionRithmId: Math.random().toString(36).slice(2),
        referAttribute: '',
        asArray: [
          {
            value: '',
            isChecked: false,
          },
        ],
        asInt: 0,
        asDecimal: 0,
        asString: '',
        asDate: '',
        value: '',
      },
    };
  }
}
