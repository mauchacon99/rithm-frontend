import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MockComponent } from 'ng-mocks';
import { StationService } from 'src/app/core/station.service';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';
import {
  MockStationService,
  MockPopupService,
  MockErrorService,
} from 'src/mocks';
import { QuestionFieldType, DialogOptions } from 'src/models';
import { StationFieldComponent } from './station-field.component';
import { PopupService } from 'src/app/core/popup.service';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';

describe('StationFieldComponent', () => {
  let component: StationFieldComponent;
  let fixture: ComponentFixture<StationFieldComponent>;
  let loader: HarnessLoader;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationFieldComponent, MockComponent(TextFieldComponent)],
      imports: [MatCheckboxModule, ReactiveFormsModule],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationFieldComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.field = {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'prompt',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: false,
      isPrivate: false,
      children: [],
      originalStationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c4',
    };
    component.stationRithmId = '3813442c-82c6-4035-893a-86fa9deca7c4';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove a field from the array of options', () => {
    component.options = [
      {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'prompt 1',
        questionType: QuestionFieldType.LongText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      },
      {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Prompt 2',
        questionType: QuestionFieldType.LongText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      },
    ];
    expect(component.options.length).toBe(2);
    component.removeOption(1);
    expect(component.options.length).toBe(1);
  });

  it('should add an option to the options array', () => {
    component.options = [];
    component.addOption(QuestionFieldType.Select);
    expect(component.options.length).toBe(1);
  });

  it('should set isRequired', async () => {
    const checkbox = await loader.getHarness<MatCheckboxHarness>(
      MatCheckboxHarness.with({
        name: component.field.rithmId,
      })
    );

    component.field.isRequired = true;
    expect(await checkbox.isChecked()).toBeTruthy();

    await checkbox.uncheck();

    expect(await checkbox.isChecked()).toBeFalsy();
    expect(component.field.isRequired).toBeFalse();

    await checkbox.check();

    expect(await checkbox.isChecked()).toBeTruthy();
    expect(component.field.isRequired).toBeTrue();
  });

  // TODO: Add tests for this describe; this doesn't do anything
  xdescribe('label field', () => {
    beforeEach(() => {
      component.field = {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Label',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      };
      component.ngOnInit();
      fixture.detectChanges();
    });
  });

  describe('handle field options', () => {
    beforeEach(() => {
      component.field = {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Label',
        questionType: QuestionFieldType.Select,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      };
      component.ngOnInit();
      fixture.detectChanges();
    });

    it("should automatically add an option to the array if there aren't answers", () => {
      component.field.possibleAnswers = [];
      const addOptionSpy = spyOn(component, 'addOption').and.callThrough();
      expect(addOptionSpy).toHaveBeenCalled;
      expect(component.options.length).toBeGreaterThan(0);
    });

    it('should automatically fill the options if there are possibleAnswers', () => {
      component.field.possibleAnswers = [
        {
          default: false,
          rithmId: '03BCE692-C347-484D-8EB3-3A2716F80BAF',
          text: 'Light Armor',
        },
      ];
      expect(component.options.length).toBeGreaterThan(0);
    });
  });

  it('should open a confirmation pop up on click of delete station option.', async () => {
    const dialogExpectData: DialogOptions = {
      title: 'Remove Option',
      message: `Are you sure you want to remove this option?`,
      okButtonText: 'Remove',
      cancelButtonText: 'Close',
      important: true,
    };
    const popupSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.removeField();
    expect(popupSpy).toHaveBeenCalledOnceWith(dialogExpectData);
  });
  it('should emit remove option.', async () => {
    const removeOption = spyOn(component.remove, 'emit');
    spyOn(TestBed.inject(PopupService), 'confirm').and.returnValue(
      Promise.resolve(true)
    );
    await component.removeField();
    expect(removeOption).toHaveBeenCalled();
  });

  it('should call the method that returns all stations.', () => {
    const getAllStations = spyOn(
      TestBed.inject(StationService),
      'getAllStationsOptimized'
    ).and.callThrough();

    component['getAllStations']();
    expect(getAllStations).toHaveBeenCalled();
  });

  it('should show error message when request for get all stations fails', () => {
    spyOn(
      TestBed.inject(StationService),
      'getAllStationsOptimized'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component['getAllStations']();
    expect(spyError).toHaveBeenCalled();
  });
});
