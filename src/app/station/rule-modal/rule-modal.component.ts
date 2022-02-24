import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { STATES } from 'src/helpers';
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

interface Operator {
  /** The operator selector text to show.*/
  text: string;
  /** The operator selector value.*/
  value: OperatorType;
}

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

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Orientation for stepper. */
  stepperOrientation$: Observable<StepperOrientation>;

  /** Get current and previous Questions for Stations. */
  questionStation: Question[] = [];

  /** The rithmId of the first selected question to be compared. */
  firstOperandQuestionRithmId = '';

  /** The type of the first questions selected for the first operand. */
  firstOperandQuestionType!: QuestionFieldType;

  /** The value of the first operand. */
  firstOperand: RuleOperand = {
    type: OperandType.Field,
    questionType: QuestionFieldType.ShortText,
    value: '',
    text: '',
  };

  /** The rithmId of the second selected question to be compared if needed. */
  secondOperandQuestionRithmId = '';

  /** Set the text to show when the secondOperand is a field. */
  secondOperandQuestionPrompt = '';

  /** The type of the second questions selected for the first operand. */
  secondOperandQuestionType!: QuestionFieldType;

  /** The value of the second operand. */
  secondOperand: RuleOperand = {
    type: OperandType.String,
    questionType: QuestionFieldType.ShortText,
    value: '',
    text: '',
  };

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

  /** Whether the second operand is a custom value or a field value. */
  isCustomValue = false;

  /** The information of the operator selected. */
  operatorSelected: Operator | null = null;

  /** The operatorList to be shown. */
  operatorList: Operator[] = [];

  /** Contain all the operand Types. */
  operandType = OperandType;

  /** Contain all the question Types. */
  questionTypes = QuestionFieldType;

  /** The rule to be returned and added to new rulesArray. */
  ruleToAdd!: RuleEquation;

  /** Is modal rule in edit mode. */
  editRuleMode = false;

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

  /** Loading/Error Variables. */
  /** Loading in current and previous questions for stations. */
  questionStationLoading = false;

  /** Loading in current and previous questions for stations. */
  ruleModalLoading = true;

  /** The error if question stations fails . */
  questionStationError = false;

  constructor(
    public dialogRef: MatDialogRef<RuleModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      /** The station rithmId. */
      stationId: string;
      /** The data of the equation of the rule to be edited. */
      editRule: RuleEquation;
    },
    breakpointObserver: BreakpointObserver,
    private stationService: StationService,
    private errorService: ErrorService,
    private readonly changeDetectorR: ChangeDetectorRef,
    private documentService: DocumentService
  ) {
    this.stepperOrientation$ = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    //Gets from documentAnswer the value to be set to the second operand
    this.documentService.documentAnswer$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((answer: DocumentAnswer) => {
        this.secondOperand.text = answer.value;
        this.secondOperand.value = answer.value;
        this.secondOperand.questionType = this.firstOperand.questionType;
      });
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStationQuestions();
    if (this.modalData.editRule) {
      this.editRuleMode = true;
    }
  }

  /**
   * Checks after the component views and child views.
   */
  ngAfterViewChecked(): void {
    this.changeDetectorR.detectChanges();
  }

  /**
   * Set the Rule Modal Title.
   *
   * @returns Modal Title.
   */
  get ruleModalTitle(): string {
    return this.editRuleMode ? 'Edit Rule' : 'New Rule';
  }

  /**
   * Get the list of questions for the second operand.
   *
   * @returns Questions for the second operand options.
   */
  get firstOperandQuestionList(): Question[] {
    const secondOperandQuestions: Question[] = this.questionStation.filter(
      (question: Question) =>
        question.questionType !== QuestionFieldType.Instructions &&
        question.questionType !== QuestionFieldType.State &&
        question.questionType !== QuestionFieldType.City &&
        question.questionType !== QuestionFieldType.Zip &&
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
    const secondOperandQuestions: Question[] = this.questionStation.filter(
      (question: Question) =>
        question.rithmId !== this.firstOperandQuestionRithmId &&
        question.questionType === this.secondOperandQuestionType
    );
    return secondOperandQuestions;
  }

  /**
   * Returns the second Operand to display in the last step.
   *
   * @returns A normal value or a rithmId to display.
   */
  get secondOperandToShow(): string {
    return this.secondOperand.type === OperandType.Field
      ? this.secondOperandQuestionPrompt
      : this.secondOperand.value;
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
   * Get current and previous questions.
   */
  getStationQuestions(): void {
    this.questionStationLoading = true;
    this.stationService
      .getStationQuestions(this.modalData.stationId, true)
      .pipe(first())
      .subscribe({
        next: (questions) => {
          this.questionStationLoading = false;
          this.questionStation = questions;
          if (this.editRuleMode) {
            this.setRuleModalEditData();
          }
          this.ruleModalLoading = false;
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
   * Set The modal data to update the rule.
   */
  setRuleModalEditData(): void {
    const rule: RuleEquation = this.modalData.editRule;

    this.firstOperand = rule.leftOperand;
    this.secondOperand = rule.rightOperand;
    this.secondOperandDefaultQuestion.questionType =
      this.secondOperand.questionType;

    //Set the values to the first operand
    const firstOperandQuestionSelected: Question | undefined =
      this.questionStation.find(
        (question) => question.rithmId === rule.leftOperand.value
      );

    if (firstOperandQuestionSelected) {
      this.firstOperandQuestionRithmId = firstOperandQuestionSelected.rithmId;
      this.firstOperandQuestionType = this.firstOperand.questionType;

      if (
        this.firstOperand.questionType === QuestionFieldType.Select ||
        this.firstOperand.questionType === QuestionFieldType.MultiSelect ||
        this.firstOperand.questionType === QuestionFieldType.CheckList
      ) {
        this.secondOperandDefaultQuestion.possibleAnswers =
          firstOperandQuestionSelected.possibleAnswers;
        this.secondOperandDefaultQuestion.questionType =
          firstOperandQuestionSelected.questionType ===
          QuestionFieldType.CheckList
            ? QuestionFieldType.MultiSelect
            : firstOperandQuestionSelected.questionType;
      }
    }
    this.setOperatorList(this.firstOperandQuestionType);
    const operatorSelect: Operator | undefined = this.operatorList.find(
      (operator) => operator.value === rule.operatorType
    );

    if (operatorSelect) {
      this.operatorSelected = operatorSelect;
    }

    if (this.secondOperand.type === OperandType.Field) {
      this.secondOperandQuestionRithmId = this.secondOperand.value;
    }

    this.secondOperandDefaultQuestion.value = this.secondOperand.value;

    if (this.secondOperandDefaultQuestion.answer) {
      this.secondOperandDefaultQuestion.answer.asDate =
        this.secondOperand.type === OperandType.Date
          ? this.secondOperand.value
          : '';
      this.secondOperandDefaultQuestion.answer.asString =
        this.secondOperand.type === OperandType.String
          ? this.secondOperand.value
          : '';
      this.secondOperandDefaultQuestion.answer.asInt =
        this.secondOperand.type === OperandType.Number
          ? parseInt(this.secondOperand.value)
          : 0;
      this.secondOperandDefaultQuestion.answer.asDecimal =
        this.secondOperand.type === OperandType.Number
          ? parseFloat(this.secondOperand.value)
          : 0;

      if (
        this.firstOperand.questionType === QuestionFieldType.Select ||
        this.firstOperand.questionType === QuestionFieldType.MultiSelect ||
        this.firstOperand.questionType === QuestionFieldType.CheckList
      ) {
        const optAsArray = this.secondOperand.text?.split('|');
        this.secondOperandDefaultQuestion.possibleAnswers?.forEach((option) => {
          const item = {
            /** The text value of the item.*/
            value: option.text,
            /** Whether the item is checked or not. */
            isChecked: optAsArray?.includes(option.text) ? true : false,
          };
          this.secondOperandDefaultQuestion.answer?.asArray?.push(item);
        });
      }
    }

    this.resetQuestionFieldComponent();
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
    this.firstOperandQuestionType = questionSelected.questionType;
    this.secondOperandQuestionType = questionSelected.questionType;
    this.firstOperand.questionType = questionSelected.questionType;
    this.secondOperandDefaultQuestion.questionType =
      questionSelected.questionType;
    this.firstOperand.value = questionSelected.rithmId;
    this.firstOperand.text = questionSelected.prompt;
    this.setOperatorList(questionSelected.questionType);
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

    // If it is edit mode and you have changed the first operand from options.
    if (this.editRuleMode) {
      this.operatorSelected = null;
      this.secondOperand.value = '';
      this.secondOperand.type = OperandType.String;
      this.secondOperandQuestionPrompt = '';
      this.secondOperandDefaultQuestion.prompt = '';
      this.secondOperandDefaultQuestion.value = '';
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
    this.secondOperand.questionType = questionSelected.questionType;
    this.isCustomValue = false;
  }

  /**
   * Set Second Operand type for Custom Values.
   *
   * @param customValue Whether the value comes from the custom value field or a previous question.
   */
   setSecondOperandType(customValue: boolean): void {
    if (customValue) {
      if (
        this.secondOperandQuestionType === QuestionFieldType.Select ||
        this.secondOperandQuestionType === QuestionFieldType.MultiSelect ||
        this.secondOperandQuestionType === QuestionFieldType.CheckList
        ) {
          this.secondOperand.type = OperandType.String;
        }
    } else {
      this.secondOperand.type = OperandType.Field;
    }
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
        text: this.secondOperandToShow,
      },
    };
    this.dialogRef.close({ rule: this.ruleToAdd, editMode: this.editRuleMode });
    this.resetValues();
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
    if (!this.editRuleMode) {
      if (event.selectedIndex < event.previouslySelectedIndex) {
        switch (event.selectedIndex) {
          case 0:
            this.operatorSelected = null;
            this.secondOperand.value = '';
            this.secondOperand.type = OperandType.String;
            this.secondOperandQuestionPrompt = '';
            this.secondOperandDefaultQuestion.prompt = '';
            this.secondOperandDefaultQuestion.value = '';
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
  }

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.resetValues();
    this.dialogRef.close();
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

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
