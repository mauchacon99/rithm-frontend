import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { QuestionFieldType } from 'src/models';

import { ContainerActionsComponent } from './container-actions.component';

fdescribe('ContainerComponent', () => {
  let component: ContainerActionsComponent;
  let fixture: ComponentFixture<ContainerActionsComponent>;
  let formGroup: FormGroup;
  let conditionType: AbstractControl;
  let stationsControl: AbstractControl;
  let conditionSharedValues: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ContainerActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerActionsComponent);
    component = fixture.componentInstance;
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
    // typeControl = formGroup.controls['conditionType'];
    // typeControl.setValue('create');
    stationsControl = formGroup.controls['conditionStations'];
    stationsControl.setValue(component.stations);
    // sharedValuesControl = formGroup.controls['conditionSharedValues'];
    // sharedValuesControl.setValue([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove an specific station from selectedStations', () => {
    expect(stationsControl.value).toHaveSize(3);
    component.removeStation('2');
    expect(stationsControl.value).toHaveSize(2);
    }
  );

  // it('should clear the form when calling removeStation', () => {
  //   const option: MatSelectChange = {
  //     value: 'archive',
  //   }
  //   component.clearForm('archive');
  //   }
  // );

});
