import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersModalComponent } from './answers-modal.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { QuestionFieldType } from 'src/models';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('AnswersModalComponent', () => {
  let component: AnswersModalComponent;
  let fixture: ComponentFixture<AnswersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnswersModalComponent],
      imports: [MatDialogModule, MatCheckboxModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            /** Modal title. */
            title: 'AnswerModalTitle',
            /** Modal message type. */
            isSelectableType: true,
            /** Modal Information Content. */
            information: {
              rithmId: '',
              questionType: QuestionFieldType.City,
              prompt: 'string',
              isPrivate: false,
              isEncrypted: true,
              isReadOnly: true,
              isRequired: true,
              possibleAnswers: [
                {
                  rithmId: 'string',
                  text: 'string',
                  default: true,
                },
              ],
              answer: {
                questionRithmId: 'string',
                referAttribute: 'string',
                asArray: [
                  {
                    value: 'string',
                    isChecked: false,
                  },
                ],
                asInt: 0,
                asDecimal: 0,
                asString: 'string',
                asDate: '2021-12-14T14:10:31.030Z',
                value: 'string',
              },
              children: [],
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
