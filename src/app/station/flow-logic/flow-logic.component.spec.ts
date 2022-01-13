import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlowLogicComponent } from './flow-logic.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ConnectedStationInfo,
  FlowLogicRule,
  OperandType,
  OperatorType,
  RuleType,
} from 'src/models';
import { RuleModalComponent } from '../rule-modal/rule-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MatSelectModule } from '@angular/material/select';
import { of, throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
      ],
      declarations: [FlowLogicComponent, RuleModalComponent],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
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
    it('should to call MatDialog service', async () => {
      const expectDataModal = {
        panelClass: ['w-5/6', 'sm:w-4/5'],
        maxWidth: '1024px',
        data: rithmId,
      };
      const dialogSpy = spyOn(
        TestBed.inject(MatDialog),
        'open'
      ).and.callThrough();
      await component.openModal();
      expect(dialogSpy).toHaveBeenCalledOnceWith(
        RuleModalComponent,
        expectDataModal
      );
    });

    it('should to call method openModal after clicked in button with id: all-new-rule', () => {
      const spyFunc = spyOn(component, 'openModal').and.callThrough();
      const btnOpenModal = fixture.nativeElement.querySelector('#all-new-rule');
      expect(btnOpenModal).toBeTruthy();
      btnOpenModal.click();
      expect(spyFunc).toHaveBeenCalled();
    });

    it('should to call method openModal after clicked in button with id: any-new-rule', () => {
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
      TestBed.inject(StationService),
      'getStationFlowLogicRule'
    ).and.callThrough();
    component.ngOnInit();
    expect(getStationFlowLogicRuleSpy).toHaveBeenCalledWith(rithmId);
  });

  it('should show error message when request for logical flow rules of a station fails.', () => {
    spyOn(
      TestBed.inject(StationService),
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

  it('should not show the display message when there are rules.', () => {
    const expectStationFlowLogic: FlowLogicRule = {
      stationRithmId: rithmId,
      destinationStationRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
      flowRules: [
        {
          ruleType: RuleType.Or,
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
        },
      ],
    };
    spyOn(
      TestBed.inject(StationService),
      'getStationFlowLogicRule'
    ).and.returnValue(of(expectStationFlowLogic));
    component.ngOnInit();
    fixture.detectChanges();
    const messageNotRules =
      fixture.debugElement.nativeElement.querySelector('#there-not-rules');
    expect(messageNotRules).toBeFalsy();
  });

  it('should show the display message when there are not rules.', () => {
    const expectStationFlowLogic: FlowLogicRule = {
      stationRithmId: rithmId,
      destinationStationRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
      flowRules: [],
    };
    const messageNotRulesDefault =
      fixture.debugElement.nativeElement.querySelector('#there-not-rules');
    expect(messageNotRulesDefault).toBeTruthy();
    spyOn(
      TestBed.inject(StationService),
      'getStationFlowLogicRule'
    ).and.returnValue(of(expectStationFlowLogic));
    component.ngOnInit();
    fixture.detectChanges();
    const messageNotRules =
      fixture.debugElement.nativeElement.querySelector('#there-not-rules');
    expect(messageNotRules).toBeTruthy();
  });
});
