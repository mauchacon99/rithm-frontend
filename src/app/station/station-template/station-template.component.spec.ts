import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { StationService } from 'src/app/core/station.service';
import { TextFieldComponent } from 'src/app/detail/text-field/text-field.component';
import { MockStationService } from 'src/mocks';
import { Question, QuestionFieldType } from 'src/models';
import { StationFieldComponent } from '../station-field/station-field.component';
import { StationTemplateComponent } from './station-template.component';

const testStationFields = [
      {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Instructions',
        instructions: '',
        questionType: QuestionFieldType.LongText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      },
      {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Label',
        instructions: '',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      },
      {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Fake question 7',
        instructions: '',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
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
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationTemplateComponent);
    component = fixture.componentInstance;
    component.fields = [...testStationFields];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should indicate if a field can be moved up', () => {
    expect(component.canFieldMoveUp(0)).toBe(false);
    expect(component.canFieldMoveUp(1)).toBe(true);
    expect(component.canFieldMoveUp(2)).toBe(true);
  });

  it('should indicate if a field can be moved down', () => {
    expect(component.canFieldMoveDown(0)).toBe(true);
    expect(component.canFieldMoveDown(1)).toBe(true);
    expect(component.canFieldMoveDown(2)).toBe(false);
  });

  it('should move a field up and down', () => {
    component.move('up', 2);
    expect(component.fields[2].prompt === 'Label').toBeTrue();

    component.move('down', 1);
    expect(component.fields[2].prompt === 'Fake question 7').toBeTrue();
  });

  it('should remove a field', () => {
    component.remove(2, testStationFields[2]);
    expect(component.fields.length).toEqual(2);
  });

  it('should move a field from the template to previous fields', () => {
    const testMoved: Question = {
      rithmId: '3j5k-3h2j-hj5j',
      prompt: 'Fake question 7',
      instructions: '',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: true,
      isPrivate: true,
      moved: 'private',
      children: [],
    };
    const movingQuestionSpy = spyOn(TestBed.inject(StationService), 'movingQuestion');
    component.movingQuestion(testMoved);
    expect(movingQuestionSpy).toHaveBeenCalledOnceWith(testMoved);
  });

});
