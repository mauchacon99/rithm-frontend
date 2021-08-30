import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { TextFieldComponent } from 'src/app/detail/text-field/text-field.component';
import { QuestionFieldType } from 'src/models';
import { StationFieldComponent } from '../station-field/station-field.component';

import { StationTemplateComponent } from './station-template.component';

const testStationFields = [
      {
        prompt: 'Instructions',
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
        prompt: 'Label',
        instructions: '',
        questionType: {
          rithmId: '',
          typeString: QuestionFieldType.ShortText,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: false,
        isPrivate: false
      },
      {
        prompt: 'Fake question 7',
        instructions: '',
        questionType: {
          rithmId: '',
          typeString: QuestionFieldType.Number,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: true,
        isPrivate: false
      }
    ];

describe('StationTemplateComponent', () => {
  let component: StationTemplateComponent;
  let fixture: ComponentFixture<StationTemplateComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationTemplateComponent,
        MockComponent(TextFieldComponent),
        MockComponent(StationFieldComponent)
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should indicate if a field can be moved up', () => {
    component.fields = testStationFields;
    expect(component.canFieldMoveUp(0)).toBe(false);
    expect(component.canFieldMoveUp(1)).toBe(true);
    expect(component.canFieldMoveUp(2)).toBe(true);
  });

  it('should indicate if a field can be moved down', () => {
    component.fields = testStationFields;
    expect(component.canFieldMoveDown(0)).toBe(true);
    expect(component.canFieldMoveDown(1)).toBe(true);
    expect(component.canFieldMoveDown(2)).toBe(false);
  });

  it('should move a field up and down', () => {
    component.fields = testStationFields;
    component.move('up', 2);
    expect(component.fields[2].prompt === 'Label').toBeTrue();

    component.move('down', 1);
    expect(component.fields[2].prompt === 'Fake question 7').toBeTrue();
  });

  it('should remove a field', () => {
    component.fields = testStationFields;
    component.remove(2);
    expect(component.fields.length).toEqual(2);
  });
});
