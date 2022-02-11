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
} from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
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
        data: rithmId,
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
    component.flowLogicRules = [
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
});
