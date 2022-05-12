import { DocumentService } from './../../../core/document.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSelectModule } from '@angular/material/select';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ConditionsComponent } from './conditions.component';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';
import { NumberFieldComponent } from 'src/app/shared/fields/number-field/number-field.component';
import { DateFieldComponent } from 'src/app/shared/fields/date-field/date-field.component';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockDocumentService,
  MockErrorService,
  MockStationService,
} from 'src/mocks';
import {
  OperandType,
  OperatorType,
  Question,
  QuestionFieldType,
} from 'src/models';

describe('ConditionsComponent', () => {
  let component: ConditionsComponent;
  let fixture: ComponentFixture<ConditionsComponent>;
  let selectLoader: HarnessLoader;
  const questionFake: Question = {
    prompt: 'Example question#1',
    rithmId: '3j4k-3h2j-hj4j',
    questionType: QuestionFieldType.Number,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConditionsComponent,
        MockComponent(TextFieldComponent),
        MockComponent(NumberFieldComponent),
        MockComponent(DateFieldComponent),
      ],
      imports: [MatSelectModule, NoopAnimationsModule],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsComponent);
    component = fixture.componentInstance;
    selectLoader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message when request for questions of a station fails.', () => {
    spyOn(
      TestBed.inject(StationService),
      'getStationPreviousQuestions'
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

  it('should set the operator list as operator options when adding the field type question', () => {
    expect(component.operatorList).toHaveSize(0);
    component.setFirstOperandInformation(questionFake);
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

  it('should set the first operand type and first operand text when calling setOperatorList', () => {
    const question: Question = questionFake;
    expect(component.firstOperandQuestionType).toBeUndefined();
    component.setFirstOperandInformation(question);
    expect(component.firstOperandQuestionType).toEqual(OperandType.Number);
    expect(component.firstOperand.value).toBe('3j4k-3h2j-hj4j');
  });

  xit('should call resetQuestionFieldComponent to refresh component field', async () => {
    component.openFormCondition = true;
    const setOperatorListSpy = spyOn(
      component,
      'resetQuestionFieldComponent'
    ).and.callThrough();
    component.setOperatorList(QuestionFieldType.ShortText);
    fixture.detectChanges();
    const matSelect = await selectLoader.getAllHarnesses(MatSelectHarness);
    await matSelect[1].clickOptions();
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
    component.currentStationQuestions = expectedResponse;
    spyOnProperty(component, 'secondOperandQuestionList').and.returnValue(
      expectedResponse
    );
    const valueExpected = component.secondOperandQuestionList;
    expect(valueExpected).toBe(expectedResponse);
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

  it('should show form add condition', () => {
    component.openFormCondition = true;
    fixture.detectChanges();
    const formCondition = fixture.debugElement.nativeElement.querySelector(
      '#add-condition-form'
    );
    expect(formCondition).toBeTruthy();
  });

  it('should reset the object second of operand.', () => {
    const secondOperandEmpty = {
      type: OperandType.String,
      questionType: QuestionFieldType.ShortText,
      value: '',
      text: '',
    };
    component.switchConditionPreviousFields = true;
    component.secondOperand = {
      type: OperandType.String,
      questionType: QuestionFieldType.ShortText,
      value: 'fake',
      text: 'fake-example',
    };

    fixture.detectChanges();
    component.resetValuesSecondOperand();

    expect(component.secondOperand).toEqual(secondOperandEmpty);
    expect(component.switchConditionPreviousFields).toBeFalsy();
  });

  it('should call method to reset ValuesSecondOperand when button is clicked.', () => {
    component.openFormCondition = true;
    component.operatorSelected = {
      text: 'fake-data',
      value: OperatorType.GreaterThan,
    };
    fixture.detectChanges();
    const spyResetValuesSecondOperand = spyOn(
      component,
      'resetValuesSecondOperand'
    ).and.callThrough();
    const buttonSwitchCondition = fixture.nativeElement.querySelector(
      '#button-switch-condition'
    );
    expect(buttonSwitchCondition).toBeTruthy();
    buttonSwitchCondition.click();
    expect(spyResetValuesSecondOperand).toHaveBeenCalled();
  });

  it('should display the section of the second operand.', () => {
    component.openFormCondition = true;
    component.operatorSelected = {
      text: 'fake-data',
      value: OperatorType.GreaterThan,
    };
    fixture.detectChanges();

    const secondOperandSection = fixture.nativeElement.querySelector(
      '#second-operand-section'
    );
    expect(secondOperandSection).toBeTruthy();
  });

  describe('Control buttons condition', () => {
    it('should disabled button save ', () => {
      component.openFormCondition = true;
      component.secondOperand = {
        type: OperandType.String,
        questionType: QuestionFieldType.ShortText,
        value: '',
        text: '',
      };
      fixture.detectChanges();
      const selectOperatorSelected =
        fixture.nativeElement.querySelector('#condition-save');
      expect(selectOperatorSelected).toBeTruthy();
      expect(selectOperatorSelected.disabled).toBeTrue();
    });
    it('should allow to enable the save button when the second section of the operand is not empty.', () => {
      component.openFormCondition = true;
      component.secondOperand = {
        type: OperandType.String,
        questionType: QuestionFieldType.ShortText,
        value: 'fake-data',
        text: 'fake-data',
      };
      fixture.detectChanges();
      const spySetEquationContent = spyOn(
        component,
        'setEquationContent'
      ).and.callThrough();
      const selectOperatorSelected =
        fixture.nativeElement.querySelector('#condition-save');
      expect(selectOperatorSelected).toBeTruthy();
      expect(selectOperatorSelected.disabled).toBeFalsy();
      selectOperatorSelected.click();
      expect(spySetEquationContent).toHaveBeenCalled();
    });
    it('should cancel the save of form add condition.', () => {
      component.openFormCondition = true;
      const spyCloseForm = spyOn(component, 'closeForm').and.callThrough();
      const spyResetValues = spyOn(component, 'resetValues').and.callThrough();
      fixture.detectChanges();
      const btnConditionCancel =
        fixture.nativeElement.querySelector('#condition-cancel');
      expect(btnConditionCancel).toBeTruthy();
      btnConditionCancel.click();
      expect(spyCloseForm).toHaveBeenCalled();
      expect(spyResetValues).toHaveBeenCalled();
      expect(component.openFormCondition).toBeFalsy();
    });
  });

  it('should hide the section of the second operand.', () => {
    component.openFormCondition = true;
    component.operatorSelected = null;
    fixture.detectChanges();

    const secondOperandSection = fixture.nativeElement.querySelector(
      '#second-operand-section'
    );
    expect(secondOperandSection).toBeNull();
  });
});
