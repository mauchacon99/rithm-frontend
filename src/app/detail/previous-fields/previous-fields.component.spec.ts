import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { StationService } from 'src/app/core/station.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockErrorService, MockPopupService, MockStationService } from 'src/mocks';
import { DialogOptions, QuestionFieldType } from 'src/models';
import { PreviousFieldsComponent } from './previous-fields.component';

describe('PreviousFieldsComponent', () => {
  let component: PreviousFieldsComponent;
  let fixture: ComponentFixture<PreviousFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousFieldsComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        MatCardModule
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousFieldsComponent);
    component = fixture.componentInstance;
    component.questions = [
      {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Label #1',
        instructions: '',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      },
      {
        rithmId: '3j4k-3h2j-hj2j',
        prompt: 'Label #2',
        instructions: '',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a confirm popup to move the previous question to template area', async () => {
    component.isLoading = false;
    const popupServiceSpy = spyOn(TestBed.inject(PopupService), 'confirm').and.callThrough();
    expect(component.isLoading).toBe(false);
    fixture.whenStable().then(()=> {
      const popupData: DialogOptions = {
        title: 'Move field?',
        message: 'Are you sure you want to move this field into the template area?',
        okButtonText: 'Confirm',
        cancelButtonText: 'Close'
      };
      const previousQuestionCard = fixture.debugElement.query(By.css('mat-card.padding-card'));
      expect(previousQuestionCard).toBeTruthy();
      previousQuestionCard.triggerEventHandler('click', component.openPreviousFieldModal());
      expect(popupServiceSpy).toHaveBeenCalledWith(popupData);
    });
   });


});
