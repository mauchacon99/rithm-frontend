import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { throwError, of } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { Question, QuestionFieldType, Station } from 'src/models';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { DataLinkFieldComponent } from './data-link-field.component';
import { MatDividerModule } from '@angular/material/divider';

describe('DataLinkFieldComponent', () => {
  let component: DataLinkFieldComponent;
  let fixture: ComponentFixture<DataLinkFieldComponent>;
  const formBuilder = new FormBuilder();
  const FIELD: Question = {
    rithmId: '1j3k-2h2j-hj2j',
    prompt: 'Fake data link',
    questionType: QuestionFieldType.DataLink,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  };

  const STATIONS: Station = {
    rithmId: '1j3k-2h2j-hj2j',
    name: 'Fake data link',
    instructions: 'Fake data link',
  };

  const fn = () => {
    /**/
  };
  const errorMessage = {
    invalidForm: {
      valid: false,
      message: 'Data link field form is invalid',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DataLinkFieldComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatAutocompleteModule,
        MatDividerModule,
        MatSelectModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLinkFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELD;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register function with the `onTouched` event', () => {
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  it('should register function with the `registerOnChange` event', () => {
    const spyGridMode = spyOn(component, 'registerOnChange').and.callThrough();
    component.registerOnChange(fn);
    expect(spyGridMode).toHaveBeenCalledWith(fn);
  });

  it('should return validation errors when form is invalid', () => {
    component.dataLinkFieldForm.setErrors({ valid: false });
    const error = component.validate();
    expect(error).toEqual(errorMessage);
  });

  it('should test method get fieldValue', () => {
    component.field.questionType = QuestionFieldType.State;
    spyOnProperty(component, 'fieldValue').and.callThrough();
    const valueExpected = component.field.value;
    expect(valueExpected).not.toBe('');
  });

  it('should call the method that returns all stations.', () => {
    const getAllStations = spyOn(
      TestBed.inject(StationService),
      'getAllStations'
    ).and.callThrough();

    component.ngOnInit();
    expect(getAllStations).toHaveBeenCalled();
  });

  it('should show error message when request for get all stations fails', () => {
    spyOn(TestBed.inject(StationService), 'getAllStations').and.returnValue(
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

  it('should call the method that returns station questions.', () => {
    component.stations = [STATIONS];
    const getStationQuestions = spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.callThrough();
    component.getStationQuestions('Fake data link');
    expect(getStationQuestions).toHaveBeenCalledOnceWith(
      component.stations[0].rithmId
    );
  });

  it('should show error message when request for get station questions fails', () => {
    component.stations = [STATIONS];
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
    component.getStationQuestions('Fake data link');
    expect(spyError).toHaveBeenCalled();
  });

  it('should change the name of Label MatchingValue to : not question found', () => {
    component.stations = [STATIONS];
    component.questionLoading = true;
    spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.returnValue(of([]));
    component.getStationQuestions('Fake data link');
    expect(component.matchingValueLabel).toEqual('Not Questions Found');
    expect(component.questionLoading).toBeFalsy();
  });

  it('should change the name of Label DisplayFields to : not question found', () => {
    component.stations = [STATIONS];
    component.questionLoading = true;
    spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.returnValue(of([]));
    component.getStationQuestions('Fake data link');
    expect(component.displayFieldsLabel).toEqual('Not Questions Found');
    expect(component.questionLoading).toBeFalsy();
  });
});
