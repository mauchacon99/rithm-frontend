import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectHarness } from '@angular/material/select/testing';
import { QuestionFieldType } from 'src/models';
import { MatSelectModule } from '@angular/material/select';

import { ContainerActionsComponent } from './container-actions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ContainerComponent', () => {
  let component: ContainerActionsComponent;
  let fixture: ComponentFixture<ContainerActionsComponent>;
  let formGroup: FormGroup;
  let stationsControl: AbstractControl;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [ContainerActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerActionsComponent);
    component = fixture.componentInstance;
    component.addingAction = true;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.stations = [
      {
        rithmId: '1',
        name: 'myStation I',
        instructions: '',
      },
      {
        rithmId: '2',
        name: 'myStation II',
        instructions: '',
      },
      {
        rithmId: '3',
        name: 'myStation III',
        instructions: '',
      },
    ];
    component.currentStationFields = [
      {
        prompt: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    formGroup = component.conditionForm;
    stationsControl = formGroup.controls['conditionStations'];
    stationsControl.setValue(component.stations);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove an specific station from selectedStations', () => {
    expect(stationsControl.value).toHaveSize(3);
    component.removeStation('2');
    expect(stationsControl.value).toHaveSize(2);
  });

  it('should clear the form when calling removeStation', async () => {
    const clearFormSpy = spyOn(component, 'clearForm').and.callThrough();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    await options[1].click();
    expect(await select.getValueText()).toBe('Archive Container');
    expect(clearFormSpy).toHaveBeenCalled();
    expect(formGroup.controls.conditionType.value).toBe('archive');
    expect(formGroup.controls.conditionStations.value).toEqual([]);
    expect(formGroup.controls.conditionSharedValues.value).toEqual([]);
  });
});
