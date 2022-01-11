import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RuleModalComponent } from './rule-modal.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MatSelectModule } from '@angular/material/select';

describe('RuleModalComponent', () => {
  let component: RuleModalComponent;
  let fixture: ComponentFixture<RuleModalComponent>;
  const DIALOG_TEST_DATA = '34904ac2-6bdd-4157-a818-50ffb37fdfbc';
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatStepperModule,
        NoopAnimationsModule,
        MatSelectModule,
      ],
      declarations: [RuleModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be stationRithmId to equal MAT_DIALOG_DATA', () => {
    expect(component.stationRithmId).toEqual(DIALOG_TEST_DATA);
  });

  it('should call the method that returns the logical flow rules of a station', () => {
    component.stationRithmId = stationId;
    const getStationFlowLogicRuleSpy = spyOn(
      TestBed.inject(StationService),
      'getStationFlowLogicRule'
    ).and.callThrough();
    component.ngOnInit();
    expect(getStationFlowLogicRuleSpy).toHaveBeenCalledWith(stationId);
  });
});
