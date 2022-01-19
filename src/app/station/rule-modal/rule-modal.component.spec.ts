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
import { MockErrorService, MockStationService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { QuestionFieldType } from 'src/models';

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
        MatSnackBarModule,
        MatInputModule,
        FormsModule,
      ],
      declarations: [
        RuleModalComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
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

  it('should call the method that returns the questions of a station.', () => {
    component.stationRithmId = stationId;
    const getStationQuestions = spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.callThrough();
    component.ngOnInit();
    expect(getStationQuestions).toHaveBeenCalledWith(stationId, true);
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
    component.firstOperand = valueStationQuestion;
    fixture.detectChanges();
    expect(btnNextInStep1.disabled).toBeFalsy();
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
    component.stationRithmId = stationId;
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
    const option = 'is not';
    expect(btnNextInStep2.disabled).toBeTrue();
    component.operator = option;
    fixture.detectChanges();
    expect(btnNextInStep2.disabled).toBeFalse();
  });

  it('should show step 2 completed', () => {
    const stepperComponent = fixture.debugElement.query(
      By.directive(MatStepper)
    )?.componentInstance;
    const step2 = stepperComponent.steps.toArray()[1];
    expect(step2.completed).toBeFalse();
    component.operator = 'is not';
    fixture.detectChanges();
    expect(step2.completed).toBeTrue();
  });

  it('should activate the next button in step 3', () => {
    const btnNextInStep3 =
      fixture.debugElement.nativeElement.querySelector('#next-step-3');
    const option = 'Fieldset #2';
    expect(btnNextInStep3.disabled).toBeTrue();
    component.secondOperand = option;
    fixture.detectChanges();
    expect(btnNextInStep3.disabled).toBeFalse();
  });

  it('should show step 3 completed', () => {
    const stepperComponent = fixture.debugElement.query(
      By.directive(MatStepper)
    )?.componentInstance;
    const step3 = stepperComponent.steps.toArray()[2];
    expect(step3.completed).toBeFalse();
    component.secondOperand = 'Fieldset #2';
    fixture.detectChanges();
    expect(step3.completed).toBeTrue();
  });

  it('should set the operator group as operator options when adding the field type question', () => {
    expect(component.operatorGroup).toHaveSize(0);
    component.setOperatorGroup(QuestionFieldType.ShortText);
    expect(component.operatorGroup.length > 0).toBeTrue();
  });
});
