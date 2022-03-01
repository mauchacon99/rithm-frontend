import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RuleModalComponent } from './rule-modal.component';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { StationService } from 'src/app/core/station.service';
import {
  MockDocumentService,
  MockErrorService,
  MockStationService,
} from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import {
  OperandType,
  Question,
  QuestionFieldType,
  OperatorType,
  RuleType,
  RuleModalData,
} from 'src/models';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';
import { NumberFieldComponent } from 'src/app/shared/fields/number-field/number-field.component';
import { DateFieldComponent } from 'src/app/shared/fields/date-field/date-field.component';
import { DocumentService } from 'src/app/core/document.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';

describe('RuleModalComponent', () => {
  let component: RuleModalComponent;
  let fixture: ComponentFixture<RuleModalComponent>;
  let selectLoader: HarnessLoader;

  const DIALOG_TEST_DATA: RuleModalData = {
    stationId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
    editRule: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatStepperModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatSnackBarModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        RuleModalComponent,
        MockComponent(LoadingIndicatorComponent),
        MockComponent(TextFieldComponent),
        MockComponent(NumberFieldComponent),
        MockComponent(DateFieldComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    DIALOG_TEST_DATA.editRule = null;
    fixture = TestBed.createComponent(RuleModalComponent);
    component = fixture.componentInstance;
    component.ruleModalLoading = false;
    selectLoader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the method that returns the questions of a station.', () => {
    const getStationQuestions = spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.callThrough();
    component.ngOnInit();
    expect(getStationQuestions).toHaveBeenCalledWith(
      DIALOG_TEST_DATA.stationId,
      true
    );
  });

  it('should show error message when request for questions of a station fails.', () => {
    spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });

  it('should activate the next button in step 1.', () => {
    const btnNextInStep1 =
      fixture.debugElement.nativeElement.querySelector('#next-step-1');
    const valueStationQuestion = 'value 1';
    expect(btnNextInStep1.disabled).toBeTruthy();
    component.firstOperand.value = valueStationQuestion;
    fixture.detectChanges();
    expect(btnNextInStep1.disabled).toBeFalsy();
  });

  it('should show step 1 completed', () => {
    const stepperComponent = fixture.debugElement.query(
      By.directive(MatStepper)
    )?.componentInstance;
    const step1 = stepperComponent.steps.toArray()[0];
    expect(step1.completed).toBeFalse();
    component.firstOperand.value = 'value-1';
    fixture.detectChanges();
    expect(step1.completed).toBeTrue();
  });

  it('should show error if question stations fails', () => {
    spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    const reviewError = fixture.debugElement.nativeElement.querySelector(
      '#question-stations-error'
    );
    expect(component.questionStationError).toBeTrue();
    expect(reviewError).toBeTruthy();
  });

  it('should show loading-indicator-questions while get current and previous questions', () => {
    component.questionStationLoading = false;
    component.getStationQuestions();
    spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.callThrough();
    fixture.detectChanges();
    expect(component.questionStationLoading).toBeTrue();

    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#loading-indicator-questions'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should activate the next button in step 2', () => {
    const btnNextInStep2 =
      fixture.debugElement.nativeElement.querySelector('#next-step-2');
    expect(btnNextInStep2.disabled).toBeTrue();
    component.operatorSelected = {
      text: 'is not',
      value: OperatorType.EqualTo,
    };
    fixture.detectChanges();
    expect(btnNextInStep2.disabled).toBeFalse();
  });

  it('should show step 2 completed', () => {
    const stepperComponent = fixture.debugElement.query(
      By.directive(MatStepper)
    )?.componentInstance;
    const step2 = stepperComponent.steps.toArray()[1];
    expect(step2.completed).toBeFalse();
    component.operatorSelected = {
      text: 'is not',
      value: OperatorType.EqualTo,
    };
    fixture.detectChanges();
    expect(step2.completed).toBeTrue();
  });

  it('should activate the next button in step 3', () => {
    const btnNextInStep3 =
      fixture.debugElement.nativeElement.querySelector('#next-step-3');
    const option = 'Fieldset #2';
    expect(btnNextInStep3.disabled).toBeTrue();
    component.secondOperand.value = option;
    fixture.detectChanges();
    expect(btnNextInStep3.disabled).toBeFalse();
  });

  it('should show step 3 completed', () => {
    const stepperComponent = fixture.debugElement.query(
      By.directive(MatStepper)
    )?.componentInstance;
    const step3 = stepperComponent.steps.toArray()[2];
    expect(step3.completed).toBeFalse();
    component.secondOperand.value = 'Fieldset #2';
    fixture.detectChanges();
    expect(step3.completed).toBeTrue();
  });

  it('should set the operator list as operator options when adding the field type question', () => {
    const question: Question = {
      prompt: 'Example question#1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    expect(component.operatorList).toHaveSize(0);
    component.setFirstOperandInformation(question);
    expect(component.operatorList.length > 0).toBeTrue();
  });

  it('should set the first field type when calling setOperatorList', () => {
    const question: Question = {
      prompt: 'Example question#1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.LongText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    expect(component.firstOperandQuestionType).toBeUndefined();
    component.setFirstOperandInformation(question);
    expect(component.firstOperandQuestionType).toEqual(
      QuestionFieldType.LongText
    );
  });

  it('should close the rule modal when close-modal-btn clicked', () => {
    spyOn(component.dialogRef, 'close');
    const buttonClose =
      fixture.debugElement.nativeElement.querySelector('#close-modal-btn');
    expect(buttonClose).toBeTruthy();
    buttonClose.click();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should set the first operand type and first operand text when calling setOperatorList', () => {
    const question: Question = {
      prompt: 'Fieldset #1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    expect(component.firstOperandQuestionType).toBeUndefined();
    component.setFirstOperandInformation(question);
    expect(component.firstOperandQuestionType).toEqual(OperandType.Number);
    expect(component.firstOperand.value).toBe('3j4k-3h2j-hj4j');
  });

  it('should call resetQuestionFieldComponent to refresh component field', async () => {
    const setOperatorListSpy = spyOn(
      component,
      'resetQuestionFieldComponent'
    ).and.callThrough();
    component.setOperatorList(QuestionFieldType.ShortText);
    fixture.detectChanges();
    const matSelect = await selectLoader.getAllHarnesses(MatSelectHarness);
    await matSelect[0].clickOptions();
    expect(setOperatorListSpy).toHaveBeenCalled();
  });

  it('should return a the list of questions for the second operand', () => {
    const expectedResponse: Question[] = [
      {
        prompt: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    component.questionStation = expectedResponse;
    spyOnProperty(component, 'secondOperandQuestionList').and.returnValue(
      expectedResponse
    );
    const valueExpected = component.secondOperandQuestionList;
    expect(valueExpected).toBe(expectedResponse);
  });

  it('should open the stepper with the first step as selected if is not editMode', () => {
    component.ruleModalLoading = false;
    fixture.detectChanges();
    const stepperComponent: MatStepper = fixture.debugElement.query(
      By.css('mat-stepper')
    )?.componentInstance;

    expect(stepperComponent.selectedIndex).toBe(0);
  });

  describe('Rule Modal Edit Mode', () => {
    beforeEach(() => {
      DIALOG_TEST_DATA.editRule = {
        ruleType: RuleType.And,
        equations: [],
        subRules: [],
      };
      fixture = TestBed.createComponent(RuleModalComponent);
      component = fixture.componentInstance;
      component.ruleModalLoading = false;
      fixture.detectChanges();
    });
    it('should open the stepper with the fourth step as selected if is editMode', () => {
      component.editRuleMode = true;
      fixture.detectChanges();
      const stepperComponent: MatStepper = fixture.debugElement.query(
        By.css('mat-stepper')
      )?.componentInstance;

      expect(stepperComponent.selectedIndex).toBe(3);
    });
  });

  describe('Display field due to the operator type', () => {
    it('should display a date field', () => {
      component.firstOperandQuestionType = QuestionFieldType.Date;
      fixture.detectChanges();
      expect(component.displayOperatorType).toBe('date');
    });
    it('should display a select field', () => {
      component.firstOperandQuestionType =
        QuestionFieldType.State || QuestionFieldType.Select;
      fixture.detectChanges();
      expect(component.displayOperatorType).toBe('select');
    });
    it('should display a multiselect field', () => {
      component.firstOperandQuestionType = QuestionFieldType.MultiSelect;
      fixture.detectChanges();
      expect(component.displayOperatorType).toBe('multiselect');
    });
    it('should display a checklist field', () => {
      component.firstOperandQuestionType = QuestionFieldType.CheckList;
      fixture.detectChanges();
      expect(component.displayOperatorType).toBe('checklist');
    });
    it('should display a number field', () => {
      component.firstOperandQuestionType =
        QuestionFieldType.Number ||
        QuestionFieldType.Phone ||
        QuestionFieldType.CreditCard ||
        QuestionFieldType.Currency ||
        QuestionFieldType.Zip;
      fixture.detectChanges();
      expect(component.displayOperatorType).toBe('number');
    });
    it('should display a string field by default', () => {
      component.firstOperandQuestionType = QuestionFieldType.ShortText;
      fixture.detectChanges();
      expect(component.displayOperatorType).toBe('string');
    });
  });

  describe('Set the operator list', () => {
    it('should set the operator list as textGroup', () => {
      const questionType =
        QuestionFieldType.ShortText ||
        QuestionFieldType.URL ||
        QuestionFieldType.Email ||
        QuestionFieldType.Phone ||
        QuestionFieldType.MultiSelect ||
        QuestionFieldType.Select ||
        QuestionFieldType.CheckList;
      component.setOperatorList(questionType);
      expect(component.operatorList).toEqual(component.textGroup);
    });
    it('should set the operator list as contentGroup', () => {
      const questionType = QuestionFieldType.LongText;
      component.setOperatorList(questionType);
      expect(component.operatorList).toEqual(component.contentGroup);
    });
    it('should set the operator list as numberGroup', () => {
      const questionType =
        QuestionFieldType.Number || QuestionFieldType.Currency;
      component.setOperatorList(questionType);
      expect(component.operatorList).toEqual(component.numberGroup);
    });
    it('should set the operator list as dateGroup', () => {
      const questionType = QuestionFieldType.Date;
      component.setOperatorList(questionType);
      expect(component.operatorList).toEqual(component.dateGroup);
    });
    it('should set the operator list as selectGroup', () => {
      const questionType = QuestionFieldType.AddressLine;
      component.setOperatorList(questionType);
      expect(component.operatorList).toEqual(component.selectGroup);
    });
    it('should set the operator list as textGroup by default', () => {
      const questionType = QuestionFieldType.City;
      component.setOperatorList(questionType);
      expect(component.operatorList).toEqual(component.textGroup);
    });
  });
});
