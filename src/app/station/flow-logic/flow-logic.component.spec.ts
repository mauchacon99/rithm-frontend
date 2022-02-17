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
  Rule,
  RuleType,
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
      destinationStationRithmId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
      flowRule: {
        ruleType: RuleType.And,
        equations: [
          {
            leftOperand: {
              type: OperandType.Field,
              value: 'birthday',
            },
            operatorType: OperatorType.Before,
            rightOperand: {
              type: OperandType.Date,
              value: '5/27/1982',
            },
          },
        ],
        subRules: [
          {
            leftOperand: {
              type: OperandType.Number,
              value: '102',
            },
            operatorType: OperatorType.GreaterOrEqual,
            rightOperand: {
              type: OperandType.Number,
              value: '101',
            },
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
      fixture.detectChanges();
      const spyFunc = spyOn(component, 'openModal').and.callThrough();
      const btnOpenModal = fixture.nativeElement.querySelector('#all-new-rule');
      expect(btnOpenModal).toBeTruthy();
      btnOpenModal.click();
      expect(spyFunc).toHaveBeenCalled();
    });

    it('should to call method openModal after clicked in button with id: any-new-rule', () => {
      component.flowLogicLoading = false;
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
    component.flowRuleError = false;
    component.flowLogicRules = flowLogicRule;
    fixture.detectChanges();
    const messageNotRules = fixture.debugElement.nativeElement.querySelector(
      '#there-are-not-rules-0'
    );
    expect(messageNotRules).toBeFalsy();
  });

  it('should display the red message when there are not rules in each station.', () => {
    component.flowLogicLoading = false;
    component.flowRuleError = false;
    component.flowLogicRules = [
      {
        stationRithmId: rithmId,
        destinationStationRithmId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
        flowRule: {
          ruleType: RuleType.And,
          equations: [],
          subRules: [],
        },
      },
    ];
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
        value: '',
      },
      operatorType: OperatorType.EqualTo,
      rightOperand: {
        type: OperandType.String,
        value: '',
      },
    };
    beforeEach(() => {
      fixture = TestBed.createComponent(FlowLogicComponent);
      component = fixture.componentInstance;
      component.rithmId = rithmId;
      component.flowLogicRules = [
        {
          stationRithmId: rithmId,
          destinationStationRithmId: '4157-a818-34904ac2-6bdd-50ffb37fdfbc',
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
      component.flowLogicRules[0].destinationStationRithmId =
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
      component.flowLogicRules[0].destinationStationRithmId =
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
        destinationStationRithmId: '4157-a818-34904ac2-6bdd-50ffb37fdfbc',
        flowRule: {
          ruleType: RuleType.And,
          equations: [
            {
              leftOperand: {
                type: OperandType.String,
                value: '',
              },
              operatorType: OperatorType.EqualTo,
              rightOperand: {
                type: OperandType.String,
                value: '',
              },
            },
          ],
          subRules: [],
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
        destinationStationRithmId: '4157-a818-34904ac2-6bdd-50ffb37fdfbc',
        flowRule: {
          ruleType: RuleType.And,
          equations: [
            {
              leftOperand: {
                type: OperandType.String,
                value: '',
              },
              operatorType: OperatorType.EqualTo,
              rightOperand: {
                type: OperandType.String,
                value: '',
              },
            },
          ],
          subRules: [],
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
        destinationStationRithmId: '63d47261-1932-4fcf-82bd-159eb1a7243g',
        flowRule: {
          ruleType: RuleType.Or,
          equations: [
            {
              leftOperand: {
                type: OperandType.Number,
                value: '102',
              },
              operatorType: OperatorType.GreaterOrEqual,
              rightOperand: {
                type: OperandType.Number,
                value: '101',
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
    component.flowLogicRules = flowLogicRule;
    fixture.detectChanges();

    const spyFunc = spyOn(component, 'openModal').and.callThrough();
    const index = 0;
    const stationRithmId = component.nextStations[0].rithmId;
    const editRuleBtnAll = fixture.nativeElement.querySelector(
      `#edit-rule-button-all-${index + stationRithmId}`
    );

    expect(editRuleBtnAll).toBeTruthy();
    editRuleBtnAll.click();
    expect(spyFunc).toHaveBeenCalled();
  });

  it('should open the modal when clicking on edit-rule-button-any to edit the existing rule', () => {
    component.flowLogicLoading = false;
    component.flowRuleError = false;
    component.flowLogicRules = flowLogicRule;
    fixture.detectChanges();

    const spyFunc = spyOn(component, 'openModal').and.callThrough();
    const index = 0;
    const stationRithmId = component.nextStations[0].rithmId;
    const editRuleBtnAny = fixture.nativeElement.querySelector(
      `#edit-rule-button-any-${index + stationRithmId}`
    );

    expect(editRuleBtnAny).toBeTruthy();
    editRuleBtnAny.click();
    expect(spyFunc).toHaveBeenCalled();
  });

  it('should call the method to delete a rule from a connected station when clicking the delete button in the ALL section', () => {
    component.flowLogicLoading = false;
    component.flowRuleError = false;
    component.flowLogicRules = flowLogicRule;
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

  it('should call the method to delete a rule from a connected station when clicking the delete button in the ANY section', () => {
    component.flowLogicLoading = false;
    component.flowRuleError = false;
    component.flowLogicRules = [
      {
        stationRithmId: rithmId,
        destinationStationRithmId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
        flowRule: {
          ruleType: RuleType.And,
          equations: [],
          subRules: [
            {
              leftOperand: {
                type: OperandType.Field,
                value: 'birthday',
              },
              operatorType: OperatorType.Before,
              rightOperand: {
                type: OperandType.Date,
                value: '5/27/1982',
              },
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

  it('should open confirmation popup when call the method that deletes the rule', () => {
    const dataToConfirmPopup = {
      title: 'Remove Rule',
      message: `Are you sure to remove the selected rule from this station?`,
      okButtonText: 'Remove',
    };
    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    component.deleteRuleFromStationFlowLogic();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataToConfirmPopup);
  });
});
