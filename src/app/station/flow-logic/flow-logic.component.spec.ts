import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FlowLogicComponent } from './flow-logic.component';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ConnectedStationInfo,
  OperandType,
  OperatorType,
  QuestionFieldType,
  Rule,
  RuleType,
  FlowLogicRule,
  TriggerType,
  Power,
  ActionType,
} from 'src/models';
import { RuleModalComponent } from '../rule-modal/rule-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { StationService } from 'src/app/core/station.service';
import {
  MockErrorService,
  MockStationService,
  MockDocumentService,
  MockPopupService,
  MockSplitService,
  MockUserService,
} from 'src/mocks';

import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { DocumentService } from 'src/app/core/document.service';
import { of, throwError } from 'rxjs';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';
import { NumberFieldComponent } from 'src/app/shared/fields/number-field/number-field.component';
import { DateFieldComponent } from 'src/app/shared/fields/date-field/date-field.component';
import { RuleEquation } from 'src/models/rule-equation';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';

import { MatDialogHarness } from '@angular/material/dialog/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContainerActionsComponent } from './actions/container-actions/container-actions.component';

const formBuilder = new FormBuilder();

describe('FlowLogicComponent', () => {
  let component: FlowLogicComponent;
  let fixture: ComponentFixture<FlowLogicComponent>;
  let loader: HarnessLoader;
  const rithmId = 'C2D2C042-272D-43D9-96C4-BA791612273F';
  const nextStations: ConnectedStationInfo[] = [
    {
      rithmId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
      name: 'Untitled Station',
    },
  ];
  const localFlowLogicRule = [
    {
      stationRithmId: rithmId,
      destinationStationRithmID: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
      flowRule: {
        ruleType: RuleType.And,
        equations: [
          {
            leftOperand: {
              type: OperandType.Field,
              questionType: QuestionFieldType.ShortText,
              value: 'birthday',
              text: 'test',
            },
            operatorType: OperatorType.Before,
            rightOperand: {
              type: OperandType.Date,
              questionType: QuestionFieldType.ShortText,
              value: '5/27/1982',
              text: 'test',
            },
          },
        ],
        subRules: [
          {
            ruleType: RuleType.Or,
            equations: [
              {
                leftOperand: {
                  type: OperandType.Field,
                  questionType: QuestionFieldType.ShortText,
                  value: 'birthday',
                  text: 'test',
                },
                operatorType: OperatorType.Before,
                rightOperand: {
                  type: OperandType.Date,
                  questionType: QuestionFieldType.ShortText,
                  value: '5/27/1982',
                  text: 'test',
                },
              },
            ],
            subRules: [],
          },
        ],
      },
    },
  ];
  const powerRemove: Power[] = [
    {
      rithmId: '3j4k-3h2j-hj4j',
      triggers: [
        {
          rithmId: '3j4k-3h2j-hj5h',
          type: TriggerType.ManualFlow,
          source: 'Source Trigger #1',
          value: 'Value Trigger #1',
        },
      ],
      actions: [
        {
          rithmId: '3j4k-3h2j-ft5h',
          type: ActionType.CreateDocument,
          target: 'Target Action #1',
          data: 'Data Action #1',
          resultMapping: 'Result Action #1',
          header: 'Header Action #1',
        },
      ],
      stationRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
      flowToStationRithmIds: [
        '73d47261-1932-4fcf-82bd-159eb1a72422',
        '73d47261-1932-4fcf-82bd-159eb1a7242g',
      ],
      name: 'Power Test #1',
      condition: 'Condition Test #1',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        MatStepperModule,
        MatSelectModule,
        MatSnackBarModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatDatepickerModule,
      ],
      declarations: [
        FlowLogicComponent,
        RuleModalComponent,
        MockComponent(LoadingIndicatorComponent),
        MockComponent(TextFieldComponent),
        MockComponent(NumberFieldComponent),
        MockComponent(DateFieldComponent),
        MockComponent(ContainerActionsComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: SplitService, useClass: MockSplitService },
        { provide: UserService, useClass: MockUserService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowLogicComponent);
    component = fixture.componentInstance;
    component.nextStations = nextStations;
    component.rithmId = rithmId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Old view block', () => {
    beforeEach(() => {
      component.flowLogicLoading = false;
      component.ruleLoading = false;
      component.flowRuleError = false;
      component.ruleError = false;
      component.flowLogicView = false;
      fixture.detectChanges();
    });

    it('should call the method that returns the logical flow rules of a station.', () => {
      component.rithmId = rithmId;
      const getStationFlowLogicRuleSpy = spyOn(
        TestBed.inject(DocumentService),
        'getStationFlowLogicRule'
      ).and.callThrough();
      component.ngOnInit();
      expect(getStationFlowLogicRuleSpy).toHaveBeenCalledWith(rithmId);
    });

    it('should show error message when request for logical flow rules of a station fails.', () => {
      spyOn(
        TestBed.inject(DocumentService),
        'getStationFlowLogicRule'
      ).and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const displayErrorSpy = spyOn(
        TestBed.inject(ErrorService),
        'displayError'
      ).and.callThrough();
      component.ngOnInit();
      expect(displayErrorSpy).toHaveBeenCalled();
    });

    it('should not display the red message when there are rules in each station.', () => {
      component.flowLogicRules = [
        {
          stationRithmId: rithmId,
          destinationStationRithmID: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
          flowRule: {
            ruleType: RuleType.And,
            equations: [
              {
                leftOperand: {
                  type: OperandType.Field,
                  questionType: QuestionFieldType.ShortText,
                  value: 'birthday',
                  text: 'test',
                },
                operatorType: OperatorType.Before,
                rightOperand: {
                  type: OperandType.Date,
                  questionType: QuestionFieldType.ShortText,
                  value: '5/27/1982',
                  text: 'test',
                },
              },
            ],
            subRules: [],
          },
        },
      ];
      fixture.detectChanges();
      const messageNotRules = fixture.debugElement.nativeElement.querySelector(
        '#there-are-not-rules-0'
      );
      expect(messageNotRules).toBeFalsy();
    });

    it('should display the red message when there are not rules in each station.', () => {
      component.flowLogicRules = [localFlowLogicRule[0]];
      component.flowLogicRules[0].flowRule.equations = [];
      component.flowLogicRules[0].flowRule.subRules = [];
      fixture.detectChanges();
      const messageNotRules = fixture.debugElement.nativeElement.querySelector(
        '#there-are-not-rules-0'
      );
      expect(messageNotRules).toBeTruthy();
    });

    it('should activate the loading in flow logic station', () => {
      component.flowLogicLoading = true;
      fixture.detectChanges();
      const flowLogicLoading = fixture.debugElement.nativeElement.querySelector(
        '#flow-logic-loading'
      );
      expect(component.flowLogicLoading).toBeTrue();
      expect(flowLogicLoading).toBeTruthy();
    });

    it('should show error if petition rules fails', () => {
      const splitService = TestBed.inject(SplitService);
      component.flowLogicView = false;
      fixture.detectChanges();
      spyOn(
        TestBed.inject(DocumentService),
        'getStationFlowLogicRule'
      ).and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      spyOn(splitService, 'getFlowLogicTreatment').and.returnValue('off');
      component.ngOnInit();
      fixture.detectChanges();
      const reviewError = fixture.debugElement.nativeElement.querySelector(
        '#flow-logic-rules-error'
      );
      expect(component.flowRuleError).toBeTrue();
      expect(reviewError).toBeTruthy();
    });

    it('Should return a default flowRuleObject for the current station if not exists', async () => {
      const defaultRule: Rule = {
        ruleType: RuleType.And,
        equations: [],
        subRules: [],
      };

      component.flowLogicRules = localFlowLogicRule;
      fixture.detectChanges();

      const ruleObject = component.getStationFlowRules(
        '4157-a818-34904ac2-50ffb37fdfbc'
      );

      expect(ruleObject).toEqual(defaultRule);
    });

    it('Should return an flowRuleObject for the current station if exists', async () => {
      component.flowLogicRules = [
        {
          stationRithmId: rithmId,
          destinationStationRithmID: '4157-a818-34904ac2-6bdd-50ffb37fdfbc',
          flowRule: {
            ruleType: RuleType.And,
            equations: [
              {
                leftOperand: {
                  type: OperandType.String,
                  questionType: QuestionFieldType.ShortText,
                  value: '',
                  text: 'test',
                },
                operatorType: OperatorType.EqualTo,
                rightOperand: {
                  type: OperandType.String,
                  questionType: QuestionFieldType.ShortText,
                  value: '',
                  text: 'test',
                },
              },
            ],
            subRules: [
              {
                ruleType: RuleType.Or,
                equations: [],
                subRules: [],
              },
            ],
          },
        },
      ];
      fixture.detectChanges();

      const ruleObject = component.getStationFlowRules(
        '4157-a818-34904ac2-6bdd-50ffb37fdfbc'
      );

      expect(ruleObject).toEqual(component.flowLogicRules[0].flowRule);
    });

    it('should call the method that updates logical flow rules for each station', () => {
      component.flowLogicRules = [
        {
          stationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
          destinationStationRithmID: '63d47261-1932-4fcf-82bd-159eb1a7243g',
          flowRule: {
            ruleType: RuleType.Or,
            equations: [
              {
                leftOperand: {
                  type: OperandType.Number,
                  questionType: QuestionFieldType.ShortText,
                  value: '102',
                  text: 'test',
                },
                operatorType: OperatorType.GreaterOrEqual,
                rightOperand: {
                  type: OperandType.Number,
                  questionType: QuestionFieldType.ShortText,
                  value: '101',
                  text: 'test',
                },
              },
            ],
            subRules: [],
          },
        },
      ];
      const updateStationFlowLogicRuleSpy = spyOn(
        TestBed.inject(DocumentService),
        'updateStationFlowLogicRule'
      ).and.callThrough();
      component['updateStationFlowLogicRule']();
      expect(updateStationFlowLogicRuleSpy).toHaveBeenCalledWith(
        component.flowLogicRules
      );
    });

    it('should show error message when updates logical flow rules for each station', () => {
      spyOn(
        TestBed.inject(DocumentService),
        'updateStationFlowLogicRule'
      ).and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const displayErrorSpy = spyOn(
        TestBed.inject(ErrorService),
        'displayError'
      ).and.callThrough();
      component['updateStationFlowLogicRule']();
      expect(displayErrorSpy).toHaveBeenCalled();
    });

    it('should open the modal when clicking on edit-rule-button-all to edit the existing rule', () => {
      component.flowLogicRules = [
        {
          stationRithmId: rithmId,
          destinationStationRithmID: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
          flowRule: {
            ruleType: RuleType.And,
            equations: [
              {
                leftOperand: {
                  type: OperandType.Field,
                  questionType: QuestionFieldType.ShortText,
                  value: 'birthday',
                  text: 'test',
                },
                operatorType: OperatorType.Before,
                rightOperand: {
                  type: OperandType.Date,
                  questionType: QuestionFieldType.ShortText,
                  value: '5/27/1982',
                  text: 'test',
                },
              },
            ],
            subRules: [],
          },
        },
      ];
      fixture.detectChanges();

      const spyFunc = spyOn(component, 'openModal').and.callThrough();
      const index = 0;
      const stationRithmId = component.nextStations[0].rithmId;
      const editRuleBtnAll = fixture.nativeElement.querySelector(
        `#edit-rule-button-all-${stationRithmId}-${index}`
      );

      expect(editRuleBtnAll).toBeTruthy();
      editRuleBtnAll.click();
      expect(spyFunc).toHaveBeenCalled();
    });

    it('should open the modal when clicking on edit-rule-button-any to edit the existing rule', () => {
      component.flowLogicRules = [
        {
          stationRithmId: rithmId,
          destinationStationRithmID: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
          flowRule: {
            ruleType: RuleType.And,
            equations: [],
            subRules: [
              {
                ruleType: RuleType.Or,
                equations: [
                  {
                    leftOperand: {
                      type: OperandType.Field,
                      questionType: QuestionFieldType.ShortText,
                      value: 'birthday',
                      text: 'test',
                    },
                    operatorType: OperatorType.Before,
                    rightOperand: {
                      type: OperandType.Date,
                      questionType: QuestionFieldType.ShortText,
                      value: '5/27/1982',
                      text: 'test',
                    },
                  },
                ],
                subRules: [],
              },
            ],
          },
        },
      ];
      fixture.detectChanges();

      const spyFunc = spyOn(component, 'openModal').and.callThrough();
      const index = 0;
      const stationRithmId = component.nextStations[0].rithmId;
      const editRuleBtnAny = fixture.nativeElement.querySelector(
        `#edit-rule-button-any-${stationRithmId}-${index}`
      );

      expect(editRuleBtnAny).toBeTruthy();
      editRuleBtnAny.click();
      expect(spyFunc).toHaveBeenCalled();
    });

    it('should call the method to delete a rule from a connected station when clicking the delete button in the ALL section', () => {
      component.flowLogicLoadingByRuleType = null;
      component.flowLogicRules = [
        {
          stationRithmId: rithmId,
          destinationStationRithmID: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
          flowRule: {
            ruleType: RuleType.And,
            equations: [
              {
                leftOperand: {
                  type: OperandType.Field,
                  questionType: QuestionFieldType.ShortText,
                  value: 'birthday',
                  text: 'test',
                },
                operatorType: OperatorType.Before,
                rightOperand: {
                  type: OperandType.Date,
                  questionType: QuestionFieldType.ShortText,
                  value: '5/27/1982',
                  text: 'test',
                },
              },
            ],
            subRules: [],
          },
        },
      ];
      fixture.detectChanges();
      const deleteRuleFromStationFlowLogicSpy = spyOn(
        component,
        'deleteRuleFromStationFlowLogic'
      );
      const { 0: station } = nextStations;
      const btnDelete = fixture.nativeElement.querySelector(
        `#delete-rule-button-all-${station.rithmId}-0`
      );

      expect(btnDelete).toBeTruthy();
      btnDelete.click();

      expect(deleteRuleFromStationFlowLogicSpy).toHaveBeenCalled();
    });

    it('should call the method to delete the rule of type ALL from the array ', async () => {
      component.flowLogicRules = localFlowLogicRule;
      component.flowLogicLoadingByRuleType = null;
      spyOn(TestBed.inject(PopupService), 'confirm').and.returnValue(
        Promise.resolve(true)
      );

      const spyService = spyOn(
        TestBed.inject(DocumentService),
        'deleteRuleFromStationFlowLogic'
      ).and.callThrough();

      const { 0: stationRules } = nextStations;
      const index = 0;
      await component.deleteRuleFromStationFlowLogic(
        index,
        'all',
        stationRules.rithmId
      );
      component.flowLogicLoadingByRuleType = `${stationRules.rithmId}-all`;

      const subStationFlowLogicRule = component.flowLogicRules.find(
        (station) => station.destinationStationRithmID === stationRules.rithmId
      );
      expect(subStationFlowLogicRule).toBeTruthy();
      expect(component.flowLogicLoadingByRuleType).toBeTruthy();
      expect(stationRules.rithmId).toEqual(
        <string>subStationFlowLogicRule?.destinationStationRithmID
      );

      expect(subStationFlowLogicRule?.flowRule.equations).toBeTruthy();

      subStationFlowLogicRule?.flowRule.equations.splice(index, 1);

      expect(spyService).toHaveBeenCalledOnceWith([
        <FlowLogicRule>subStationFlowLogicRule,
      ]);
    });

    it('should call the method to delete the rule of type ANY from the array ', async () => {
      component.flowLogicRules = localFlowLogicRule;
      component.flowLogicLoadingByRuleType = null;
      spyOn(TestBed.inject(PopupService), 'confirm').and.returnValue(
        Promise.resolve(true)
      );

      const spyService = spyOn(
        TestBed.inject(DocumentService),
        'deleteRuleFromStationFlowLogic'
      ).and.callThrough();

      const { 0: stationRules } = nextStations;
      const index = 0;
      await component.deleteRuleFromStationFlowLogic(
        index,
        'any',
        stationRules.rithmId
      );
      component.flowLogicLoadingByRuleType = `${stationRules.rithmId}-any`;
      const subStationFlowLogicRule = component.flowLogicRules.find(
        (station) => station.destinationStationRithmID === stationRules.rithmId
      );
      expect(subStationFlowLogicRule).toBeTruthy();

      expect(stationRules.rithmId).toEqual(
        <string>subStationFlowLogicRule?.destinationStationRithmID
      );

      expect(subStationFlowLogicRule?.flowRule.subRules).toBeTruthy();

      subStationFlowLogicRule?.flowRule.subRules.splice(index, 1);

      expect(spyService).toHaveBeenCalledOnceWith([
        <FlowLogicRule>subStationFlowLogicRule,
      ]);
    });

    it('should call the method to delete a rule from a connected station when clicking the delete button in the ANY section', () => {
      component.flowLogicLoadingByRuleType = null;
      component.flowLogicRules = [
        {
          stationRithmId: rithmId,
          destinationStationRithmID: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
          flowRule: {
            ruleType: RuleType.And,
            equations: [],
            subRules: [
              {
                ruleType: RuleType.And,
                equations: [
                  {
                    leftOperand: {
                      type: OperandType.Field,
                      questionType: QuestionFieldType.ShortText,
                      value: 'birthday',
                      text: 'test',
                    },
                    operatorType: OperatorType.Before,
                    rightOperand: {
                      type: OperandType.Date,
                      questionType: QuestionFieldType.ShortText,
                      value: '5/27/1982',
                      text: 'test',
                    },
                  },
                ],
                subRules: [],
              },
            ],
          },
        },
      ];
      fixture.detectChanges();
      const deleteRuleFromStationFlowLogicSpy = spyOn(
        component,
        'deleteRuleFromStationFlowLogic'
      );
      const { 0: station } = nextStations;
      const btnDelete = fixture.nativeElement.querySelector(
        `#delete-rule-button-any-${station.rithmId}-0`
      );

      expect(btnDelete).toBeTruthy();
      btnDelete.click();

      expect(deleteRuleFromStationFlowLogicSpy).toHaveBeenCalled();
    });

    it('should show error message when delete logical flow rules for each station', async () => {
      component.flowLogicRules = localFlowLogicRule;
      spyOn(TestBed.inject(PopupService), 'confirm').and.returnValue(
        Promise.resolve(true)
      );
      spyOn(
        TestBed.inject(DocumentService),
        'deleteRuleFromStationFlowLogic'
      ).and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const displayErrorSpy = spyOn(
        TestBed.inject(ErrorService),
        'displayError'
      ).and.callThrough();
      const { 0: station } = nextStations;
      await component.deleteRuleFromStationFlowLogic(0, 'any', station.rithmId);
      expect(displayErrorSpy).toHaveBeenCalled();
      expect(component.flowRuleError).toBeTruthy();
      expect(component.flowLogicLoading).toBeFalsy();
      expect(component.flowLogicLoadingByRuleType).toBeNull();
    });

    it('should open confirmation popup when call the method that deletes the rule', async () => {
      const dataToConfirmPopup = {
        title: 'Remove Rule',
        message: `Are you sure to remove the selected rule from this station?`,
        okButtonText: 'Remove',
      };
      const popUpConfirmSpy = spyOn(
        TestBed.inject(PopupService),
        'confirm'
      ).and.callThrough();
      const { 0: station } = nextStations;
      await component.deleteRuleFromStationFlowLogic(0, 'any', station.rithmId);
      expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataToConfirmPopup);
    });

    it('should activate the loading in saved rules of flow logic', () => {
      component.ruleLoading = true;
      fixture.detectChanges();
      const ruleLoading =
        fixture.debugElement.nativeElement.querySelector('#rule-loading');
      expect(component.ruleLoading).toBeTrue();
      expect(ruleLoading).toBeTruthy();
    });

    it('should show error message when request for saved rules of flow logic fails.', () => {
      component.ruleError = true;
      fixture.detectChanges();
      const ruleError =
        fixture.debugElement.nativeElement.querySelector('#rules-error');
      expect(component.ruleError).toBeTrue();
      expect(ruleError).toBeTruthy();
    });

    describe('Loading rules ', () => {
      beforeEach(() => {
        component.flowLogicLoading = false;
        component.flowRuleError = false;
        component.flowLogicRules = localFlowLogicRule;
        fixture.detectChanges();
      });

      it('should not be to show flow-logic-loading-rules', () => {
        component.flowLogicLoadingByRuleType = null;
        fixture.detectChanges();
        const loadingRules = fixture.debugElement.nativeElement.querySelector(
          '#flow-logic-loading-rules'
        );
        expect(loadingRules).toBeNull();
      });

      it('should be to show flow-logic-loading-rules type ANY', () => {
        const { 0: stationRules } = nextStations;
        component.flowLogicLoadingByRuleType = `${stationRules.rithmId}-any`;
        fixture.detectChanges();
        const loadingRules = fixture.debugElement.nativeElement.querySelector(
          '#flow-logic-loading-rules'
        );
        expect(loadingRules).toBeTruthy();
      });

      it('should be to show flow-logic-loading-rules type ALL', () => {
        const { 0: stationRules } = nextStations;
        component.flowLogicLoadingByRuleType = `${stationRules.rithmId}-all`;
        fixture.detectChanges();
        const loadingRules = fixture.debugElement.nativeElement.querySelector(
          '#flow-logic-loading-rules'
        );
        expect(loadingRules).toBeTruthy();
      });
    });

    describe('Translate operators', () => {
      it('should translate the operator GreaterThan', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.GreaterThan
        );
        expect(translatorResponse).toEqual('is greater than');
      });

      it('should translate the operator LesserThan', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.LesserThan
        );
        expect(translatorResponse).toEqual('is less than');
      });

      it('should translate the operator GreaterOrEqual', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.GreaterOrEqual
        );
        expect(translatorResponse).toEqual('is greater than or equal to');
      });

      it('should translate the operator LesserOrEqual', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.LesserOrEqual
        );
        expect(translatorResponse).toEqual('is lesser than or equal to');
      });

      it('should translate the operator EqualTo', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.EqualTo
        );
        expect(translatorResponse).toEqual('is');
      });

      it('should translate the operator NotEqualTo', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.NotEqualTo
        );
        expect(translatorResponse).toEqual('is not');
      });

      it('should translate the operator Before', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.Before
        );
        expect(translatorResponse).toEqual('before');
      });

      it('should translate the operator After', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.After
        );
        expect(translatorResponse).toEqual('after');
      });

      it('should translate the operator Contains', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.Contains
        );
        expect(translatorResponse).toEqual('contains');
      });

      it('should translate the operator NotContains', () => {
        const translatorResponse = component.translateOperator(
          OperatorType.NotContains
        );
        expect(translatorResponse).toEqual('does not contains');
      });

      it('should translate the operator On', () => {
        const translatorResponse = component.translateOperator(OperatorType.On);
        expect(translatorResponse).toEqual('on');
      });
    });

    describe('New rule modal afterClosed', () => {
      const ruleToAdd: RuleEquation = {
        leftOperand: {
          type: OperandType.String,
          questionType: QuestionFieldType.ShortText,
          value: '',
          text: 'test',
        },
        operatorType: OperatorType.EqualTo,
        rightOperand: {
          type: OperandType.String,
          questionType: QuestionFieldType.ShortText,
          value: '',
          text: 'test',
        },
      };

      beforeEach(() => {
        fixture = TestBed.createComponent(FlowLogicComponent);
        component = fixture.componentInstance;
        component.rithmId = rithmId;
        component.flowLogicRules = [
          {
            stationRithmId: rithmId,
            destinationStationRithmID: '4157-a818-34904ac2-6bdd-50ffb37fdfbc',
            flowRule: {
              ruleType: RuleType.And,
              equations: [],
              subRules: [],
            },
          },
        ];
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
      });

      it('should add a new flowLogicRule with equations if station doesnt exists', async () => {
        const dialogRef = spyOn(component.dialog, 'open').and.returnValue({
          afterClosed: () => of(ruleToAdd),
        } as MatDialogRef<typeof RuleModalComponent>);
        await component.openModal(
          'all',
          '34904ac2-6bdd-4157-a818-50ffb37fdfbc'
        );
        expect(dialogRef).toHaveBeenCalled();
        expect(component.flowLogicRules).toHaveSize(2);
      });

      it('should update a flowLogicRule with equations if station exists', async () => {
        const dialogRef = spyOn(component.dialog, 'open').and.returnValue({
          afterClosed: () => of(ruleToAdd),
        } as MatDialogRef<typeof RuleModalComponent>);
        await component.openModal(
          'all',
          '4157-a818-34904ac2-6bdd-50ffb37fdfbc'
        );
        expect(dialogRef).toHaveBeenCalled();
        expect(component.flowLogicRules).toHaveSize(1);
      });

      it('should add a new flowLogicRule with subrules if station doesnt exists', async () => {
        const dialogRef = spyOn(component.dialog, 'open').and.returnValue({
          afterClosed: () => of(ruleToAdd),
        } as MatDialogRef<typeof RuleModalComponent>);
        await component.openModal(
          'any',
          '34904ac2-6bdd-4157-a818-50ffb37fdfbc'
        );
        expect(dialogRef).toHaveBeenCalled();
        expect(component.flowLogicRules).toHaveSize(2);
      });

      it('should update a flowLogicRule with subrules if it exists', async () => {
        const dialogRef = spyOn(component.dialog, 'open').and.returnValue({
          afterClosed: () => of(ruleToAdd),
        } as MatDialogRef<typeof RuleModalComponent>);
        await component.openModal(
          'any',
          '4157-a818-34904ac2-6bdd-50ffb37fdfbc'
        );
        expect(dialogRef).toHaveBeenCalled();
        expect(component.flowLogicRules).toHaveSize(1);
      });

      it('should close the modal when it is opened to create a new rule', async () => {
        component.openModal('any', '4157-a818-34904ac2-6bdd-50ffb37fdfbc');
        let dialogs = await loader.getAllHarnesses(MatDialogHarness);

        expect(dialogs.length).toBe(1);
        await dialogs[0].close();

        dialogs = await loader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toBe(1);

        await dialogs[0].close();
        dialogs = await loader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toBe(1);
      });

      it('should close the modal when it is opened to edit a rule', async () => {
        const ruleEq: RuleEquation = {
          leftOperand: {
            type: OperandType.String,
            questionType: QuestionFieldType.ShortText,
            value: '',
            text: 'test',
          },
          operatorType: OperatorType.EqualTo,
          rightOperand: {
            type: OperandType.String,
            questionType: QuestionFieldType.ShortText,
            value: '',
            text: 'test',
          },
        };
        component.openModal(
          'and',
          '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
          ruleEq
        );
        let dialogs = await loader.getAllHarnesses(MatDialogHarness);

        expect(dialogs.length).toBe(1);
        await dialogs[0].close();

        dialogs = await loader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toBe(1);

        await dialogs[0].close();
        dialogs = await loader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toBe(1);
      });
    });

    describe('New rule modal', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(FlowLogicComponent);
        component = fixture.componentInstance;
        component.nextStations = nextStations;
        component.rithmId = rithmId;
        component.flowLogicLoading = false;
        component.ruleLoading = false;
        fixture.detectChanges();
      });

      it('should to call MatDialog service', async () => {
        const ruleType = 'and';
        const connectedStationId = '34904ac2-6bdd-4157-a818-50ffb37fdfbc';
        const expectDataModal = {
          panelClass: ['w-5/6', 'sm:w-4/5'],
          maxWidth: '1024px',
          data: {
            stationId: rithmId,
            editRule: null,
          },
          disableClose: true,
        };
        const dialogSpy = spyOn(
          TestBed.inject(MatDialog),
          'open'
        ).and.callThrough();
        await component.openModal(ruleType, connectedStationId);
        expect(dialogSpy).toHaveBeenCalledOnceWith(
          RuleModalComponent,
          expectDataModal
        );
      });

      it('should to call method openModal after clicked in button with id: all-new-rule-stationId', () => {
        const spyFunc = spyOn(component, 'openModal').and.callThrough();
        const btnOpenModal = fixture.nativeElement.querySelector(
          `#all-new-rule-${nextStations[0].rithmId}`
        );
        expect(btnOpenModal).toBeTruthy();
        btnOpenModal.click();
        expect(spyFunc).toHaveBeenCalled();
      });

      it('should to call method openModal after clicked in button with id: any-new-rule-stationId', () => {
        const spyFunc = spyOn(component, 'openModal').and.callThrough();
        const btnOpenModal = fixture.nativeElement.querySelector(
          `#any-new-rule-${nextStations[0].rithmId}`
        );
        expect(btnOpenModal).toBeTruthy();
        btnOpenModal.click();
        expect(spyFunc).toHaveBeenCalled();
      });
    });
  });

  it('should call the method that get powers of the station.', () => {
    component.flowLogicView = true;
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'getStationPowers'
    ).and.callThrough();
    component.ngOnChanges();
    expect(spyService).toHaveBeenCalled();
  });

  it('should detect when the getStationPowers method fails.', () => {
    component.flowLogicView = true;
    spyOn(TestBed.inject(DocumentService), 'getStationPowers').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnChanges();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call the method that will be deleted powers of the station.', () => {
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'deleteStationPowers'
    ).and.callThrough();
    component.deleteStationPowers(powerRemove[0]);
    expect(spyService).toHaveBeenCalled();
  });

  it('should detect when the deleteStationPowers method fails.', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'deleteStationPowers'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.deleteStationPowers(powerRemove[0]);
    expect(spyError).toHaveBeenCalled();
  });
  it('should activate the loading in the powers of station', () => {
    component.flowLogicView = true;
    component.powersLoading = true;
    fixture.detectChanges();
    const powersLoading = fixture.debugElement.nativeElement.querySelector(
      '#component-power-loading'
    );
    expect(component.powersLoading).toBeTrue();
    expect(powersLoading).toBeTruthy();
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;

    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
    });

    it('should call split service and treatments', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const spyGetFlowLogicTreatment = spyOn(
        splitService,
        'getFlowLogicTreatment'
      ).and.callThrough();

      splitService.sdkReady$.next();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(spyGetFlowLogicTreatment).toHaveBeenCalled();
      expect(component.flowLogicView).toBeTrue();
    });

    it('should catch split error ', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      splitService.sdkReady$.error('error');
      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(errorService).toHaveBeenCalled();
      expect(component.flowLogicView).toBeFalse();
    });
  });

  it('should call the method that returns all stations.', () => {
    const prevAndNextStations = spyOn(
      TestBed.inject(StationService),
      'getPreviousAndNextStations'
    ).and.callThrough();
    component.getPreviousAndNextStations();
    expect(prevAndNextStations).toHaveBeenCalledOnceWith(component.rithmId);
  });

  it('should show error message when request for get all stations fails', () => {
    spyOn(
      TestBed.inject(StationService),
      'getPreviousAndNextStations'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const displayErrorSpy = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.getPreviousAndNextStations();
    expect(displayErrorSpy).toHaveBeenCalled();
  });

  it('should call the method that add or remove the triggers in the power progress.', () => {
    const prevAndNextStations = spyOn(
      TestBed.inject(StationService),
      'getPreviousAndNextStations'
    ).and.callThrough();
    component.getPreviousAndNextStations();
    expect(prevAndNextStations).toHaveBeenCalledOnceWith(component.rithmId);
  });

});
