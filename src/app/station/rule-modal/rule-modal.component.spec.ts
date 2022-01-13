import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RuleModalComponent } from './rule-modal.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

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
      declarations: [RuleModalComponent],
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
    component.getStationQuestions();
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
    component.getStationQuestions();
    expect(spyError).toHaveBeenCalled();
  });
});
