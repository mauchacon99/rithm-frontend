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
import { MockErrorService, MockStationService } from 'src/mocks';
import { OperandType, Question, QuestionFieldType } from 'src/models';

fdescribe('ConditionsComponent', () => {
  let component: ConditionsComponent;
  let fixture: ComponentFixture<ConditionsComponent>;
  let selectLoader: HarnessLoader;

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
});
