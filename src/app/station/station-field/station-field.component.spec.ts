import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MockComponent } from 'ng-mocks';
import { StationService } from 'src/app/core/station.service';
import { TextFieldComponent } from 'src/app/detail/text-field/text-field.component';
import { MockStationService } from 'src/mocks';
import { QuestionFieldType } from 'src/models';
import { StationFieldComponent } from './station-field.component';

describe('StationFieldComponent', () => {
  let component: StationFieldComponent;
  let fixture: ComponentFixture<StationFieldComponent>;
  let loader: HarnessLoader;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationFieldComponent,
        MockComponent(TextFieldComponent)
      ],
      imports: [
        MatCheckboxModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationFieldComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.field = {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'prompt',
      instructions: 'instructions',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: false,
      isPrivate: false,
      children: [],
    };
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
        instructions: '',
        questionType: QuestionFieldType.LongText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      },
      {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Prompt 2',
        instructions: '',
        questionType: QuestionFieldType.LongText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      }
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
    const checkbox = await loader.getHarness<MatCheckboxHarness>(MatCheckboxHarness.with({
      name: component.field.rithmId
    }));

    component.field.isRequired = true;
    expect(await checkbox.isChecked()).toBeTruthy();

    await checkbox.uncheck();

    expect(await checkbox.isChecked()).toBeFalsy();
    expect(component.field.isRequired).toBeFalse();

    await checkbox.check();

    expect(await checkbox.isChecked()).toBeTruthy();
    expect(component.field.isRequired).toBeTrue();

  });

  describe('label field', () => {
    beforeEach(() => {
      component.field = {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Label',
        instructions: '',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      };
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should require a label', () => {
      const label = component.stationFieldForm.controls[component.field.questionType];
      expect(label.valid).toBeFalse();
      expect(label.hasError('required')).toBeTrue();
      expect(component.stationFieldForm.valid).toBeFalse();
    });
  });

  describe('handle field options', () => {
    beforeEach(() => {
      component.field = {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Label',
        instructions: '',
        questionType: QuestionFieldType.Select,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      };
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('option should be required', () => {
      const option = component.stationFieldForm.controls['optionField'];
      expect(option.valid).toBeFalse();
      expect(option.hasError('required')).toBeTrue();
      expect(component.stationFieldForm.valid).toBeFalse();
    });

    it('should automatically add an option to the array', () => {
      expect(component.options.length).toBeGreaterThan(0);
    });
  });

});
