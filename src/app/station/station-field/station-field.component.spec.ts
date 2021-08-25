import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MockComponent } from 'ng-mocks';
import { TextFieldComponent } from 'src/app/detail/text-field/text-field.component';
import { QuestionFieldType } from 'src/models';

import { StationFieldComponent } from './station-field.component';

describe('StationFieldComponent', () => {
  let component: StationFieldComponent;
  let fixture: ComponentFixture<StationFieldComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationFieldComponent,
        MockComponent(TextFieldComponent)
      ],
      imports: [
        MatCheckboxModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationFieldComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.field = {
      prompt: 'prompt',
      instructions: 'instructions',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.Number,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: false,
      isPrivate: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove a field from the array of options', () => {
    component.options = [
      {
        prompt: 'prompt 1',
        instructions: '',
        questionType: {
          rithmId: '',
          typeString: QuestionFieldType.LongText,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: false,
        isPrivate: false
      },
      {
        prompt: 'Prompt 2',
        instructions: '',
        questionType: {
          rithmId: '',
          typeString: QuestionFieldType.LongText,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: false,
        isPrivate: false
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
      name: component.field.questionType.rithmId
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
});
