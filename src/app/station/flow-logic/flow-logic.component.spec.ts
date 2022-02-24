import { ComponentFixture, TestBed } from '@angular/core/testing';
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
} from 'src/mocks';

import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { DocumentService } from 'src/app/core/document.service';
import { of, throwError } from 'rxjs';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';
import { NumberFieldComponent } from 'src/app/shared/fields/number-field/number-field.component';
import { DateFieldComponent } from 'src/app/shared/fields/date-field/date-field.component';
import { RuleEquation } from 'src/models/rule-equation';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('FlowLogicComponent', () => {
  let component: FlowLogicComponent;
  let fixture: ComponentFixture<FlowLogicComponent>;
  const rithmId = 'C2D2C042-272D-43D9-96C4-BA791612273F';
  const nextStations: ConnectedStationInfo[] = [
    {
      rithmId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
      name: 'Untitled Station',
    },
  ];
  const flowLogicRule = [
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
      ],
      declarations: [
        FlowLogicComponent,
        RuleModalComponent,
        MockComponent(LoadingIndicatorComponent),
        MockComponent(TextFieldComponent),
        MockComponent(NumberFieldComponent),
        MockComponent(DateFieldComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService },
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

  describe('New rule modal', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(FlowLogicComponent);
      component = fixture.componentInstance;
      component.nextStations = nextStations;
      component.rithmId = rithmId;
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

    it('should to call method openModal after clicked in button with id: all-new-rule', () => {
      component.flowLogicLoading = false;
      component.ruleLoading = false;
      fixture.detectChanges();
      const spyFunc = spyOn(component, 'openModal').and.callThrough();
      const btnOpenModal = fixture.nativeElement.querySelector('#all-new-rule');
      expect(btnOpenModal).toBeTruthy();
      btnOpenModal.click();
      expect(spyFunc).toHaveBeenCalled();
    });

    it('should to call method openModal after clicked in button with id: any-new-rule', () => {
      component.flowLogicLoading = false;
      component.ruleLoading = false;
      fixture.detectChanges();
      const spyFunc = spyOn(component, 'openModal').and.callThrough();
      const btnOpenModal = fixture.nativeElement.querySelector('#any-new-rule');
      expect(btnOpenModal).toBeTruthy();
      btnOpenModal.click();
      expect(spyFunc).toHaveBeenCalled();
    });
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
    component.flowLogicLoading = false;
    component.ruleLoading = false;
    component.flowRuleError = false;
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
    component.flowLogicLoading = false;
    component.ruleLoading = false;
    component.flowRuleError = false;
    component.flowLogicRules = [flowLogicRule[0]];
    component.flowLogicRules[0].flowRule.equations = [];
    component.flowLogicRules[0].flowRule.subRules = [];
    fixture.detectChanges();
    const messageNotRules = fixture.debugElement.nativeElement.querySelector(
      '#there-are-not-rules-0'
    );
    expect(messageNotRules).toBeTruthy();
  });

  it('should activate the loading in flow logic station', () => {
    component.ruleLoading = false;
    component.flowLogicLoading = true;
    fixture.detectChanges();
    const flowLogicLoading = fixture.debugElement.nativeElement.querySelector(
      '#flow-logic-loading'
    );
    expect(component.flowLogicLoading).toBeTrue();
    expect(flowLogicLoading).toBeTruthy();
  });

  it('should show error if petition rules fails', () => {
    component.ruleLoading = false;
    component.flowLogicLoading = false;
    spyOn(
      TestBed.inject(DocumentService),
      'getStationFlowLogicRule'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    const reviewError = fixture.debugElement.nativeElement.querySelector(
      '#flow-logic-rules-error'
    );
    expect(component.flowRuleError).toBeTrue();
    expect(reviewError).toBeTruthy();
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
    });

    it('should add a new flowLogicRule with equations if station doesnt exists', async () => {
      component.flowLogicRules[0].destinationStationRithmID =
        '4157-a818-34904ac2-6bdd-50ffb37fdfbc';

      const dialogRef = spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(ruleToAdd),
      } as MatDialogRef<typeof RuleModalComponent>);
      await component.openModal('all', '34904ac2-6bdd-4157-a818-50ffb37fdfbc');
      expect(dialogRef).toHaveBeenCalled();
      expect(component.flowLogicRules).toHaveSize(2);
    });

    it('should update a flowLogicRule with equations if station exists', async () => {
      const dialogRef = spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(ruleToAdd),
      } as MatDialogRef<typeof RuleModalComponent>);
      await component.openModal('all', '4157-a818-34904ac2-6bdd-50ffb37fdfbc');
      expect(dialogRef).toHaveBeenCalled();
      expect(component.flowLogicRules).toHaveSize(1);
    });

    it('should add a new flowLogicRule with subrules if station doesnt exists', async () => {
      component.flowLogicRules[0].destinationStationRithmID =
        '4157-a818-34904ac2-6bdd-50ffb37fdfbc';
      const dialogRef = spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(ruleToAdd),
      } as MatDialogRef<typeof RuleModalComponent>);
      await component.openModal('any', '34904ac2-6bdd-4157-a818-50ffb37fdfbc');
      expect(dialogRef).toHaveBeenCalled();
      expect(component.flowLogicRules).toHaveSize(2);
    });

    it('should update a flowLogicRule with subrules if it exists', async () => {
      const dialogRef = spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(ruleToAdd),
      } as MatDialogRef<typeof RuleModalComponent>);
      await component.openModal('any', '4157-a818-34904ac2-6bdd-50ffb37fdfbc');
      expect(dialogRef).toHaveBeenCalled();
      expect(component.flowLogicRules).toHaveSize(1);
    });
  });

  it('Should return a default  flowRuleObject for the current station if not exists', async () => {
    const defaultRule: Rule = {
      ruleType: RuleType.And,
      equations: [],
      subRules: [],
    };

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
    component.flowLogicLoading = false;
    component.flowRuleError = false;
    component.ruleLoading = false;
    component.ruleError = false;
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
    component.flowLogicLoading = false;
    component.ruleLoading = false;
    component.flowRuleError = false;
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
    component.flowLogicLoading = false;
    component.ruleLoading = false;
    component.flowRuleError = false;
    component.ruleError = false;
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
    component.flowLogicRules = flowLogicRule;
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
    component.flowLogicRules = flowLogicRule;
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
    component.flowLogicLoading = false;
    component.ruleLoading = false;
    component.flowRuleError = false;
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
    component.flowLogicRules = flowLogicRule;
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
    component.flowLogicLoading = false;
    component.ruleLoading = true;
    fixture.detectChanges();
    const ruleLoading =
      fixture.debugElement.nativeElement.querySelector('#rule-loading');
    expect(component.ruleLoading).toBeTrue();
    expect(ruleLoading).toBeTruthy();
  });

  it('should show error message when request for saved rules of flow logic fails.', () => {
    component.flowLogicLoading = false;
    component.ruleError = true;
    fixture.detectChanges();
    const ruleError =
      fixture.debugElement.nativeElement.querySelector('#rules-error');
    expect(component.ruleError).toBeTrue();
    expect(ruleError).toBeTruthy();
  });
  describe('Loading rules ', () => {
    it('should not be to show flow-logic-loading-rules', () => {
      component.flowLogicLoading = false;
      component.flowRuleError = false;
      component.flowLogicRules = flowLogicRule;
      component.flowLogicLoadingByRuleType = null;
      fixture.detectChanges();
      const loadingRules = fixture.debugElement.nativeElement.querySelector(
        '#flow-logic-loading-rules'
      );
      expect(loadingRules).toBeNull();
    });

    it('should be to show flow-logic-loading-rules type ANY', () => {
      component.flowLogicLoading = false;
      component.flowRuleError = false;
      component.flowLogicRules = flowLogicRule;
      const { 0: stationRules } = nextStations;
      component.flowLogicLoadingByRuleType = `${stationRules.rithmId}-any`;
      fixture.detectChanges();
      const loadingRules = fixture.debugElement.nativeElement.querySelector(
        '#flow-logic-loading-rules'
      );
      expect(loadingRules).toBeTruthy();
    });

    it('should be to show flow-logic-loading-rules type ALL', () => {
      component.flowLogicLoading = false;
      component.flowRuleError = false;
      component.flowLogicRules = flowLogicRule;
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
      expect(translatorResponse).toEqual('Is Greater Than');
    });

    it('should translate the operator LesserThan', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.LesserThan
      );
      expect(translatorResponse).toEqual('Is Lesser Than');
    });

    it('should translate the operator GreaterOrEqual', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.GreaterOrEqual
      );
      expect(translatorResponse).toEqual('Is Greater or Equal to');
    });

    it('should translate the operator LesserOrEqual', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.LesserOrEqual
      );
      expect(translatorResponse).toEqual('Is Lesser or Equal to');
    });

    it('should translate the operator EqualTo', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.EqualTo
      );
      expect(translatorResponse).toEqual('Is Equal To');
    });

    it('should translate the operator NotEqualTo', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.NotEqualTo
      );
      expect(translatorResponse).toEqual('Is Not Equal To');
    });

    it('should translate the operator Before', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.Before
      );
      expect(translatorResponse).toEqual('Is Before');
    });

    it('should translate the operator After', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.After
      );
      expect(translatorResponse).toEqual('Is After');
    });

    it('should translate the operator Contains', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.Contains
      );
      expect(translatorResponse).toEqual('Contains');
    });

    it('should translate the operator NotContains', () => {
      const translatorResponse = component.translateOperator(
        OperatorType.NotContains
      );
      expect(translatorResponse).toEqual('Does not contains');
    });

    it('should translate the operator On', () => {
      const translatorResponse = component.translateOperator(OperatorType.On);
      expect(translatorResponse).toEqual('Is On');
    });
  });
});
