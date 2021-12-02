import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
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
    fixture.detectChanges();
    component.questions = [
      {
        rithmId: '3j4k-3h2j-hj4j',
        prompt: 'Label #1',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      },
      {
        rithmId: '3j4k-3h2j-hj2j',
        prompt: 'Label #2',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
      }
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute to service popup service', () => {
    const dialogExpectData: DialogOptions = {
      title: 'Move field?',
      message: 'Are you sure you want to move this field into the template area?',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close'
    };
    const popupSpy = spyOn(TestBed.inject(PopupService), 'confirm').and.callThrough();
    component.moveFieldToTemplate(component.questions[0]);
    expect(popupSpy).toHaveBeenCalledOnceWith(dialogExpectData);
  });


  it('should clicked the card previous fields and call moveFieldToTemplate', fakeAsync(() => {
    component.isLoading = false;
    fixture.detectChanges();
    const moveFieldToTemplateSpy = spyOn(component, 'moveFieldToTemplate');
    const previousQuestionCard = fixture.debugElement.nativeElement.querySelector('#previous-field');
    expect(previousQuestionCard).toBeTruthy();
    previousQuestionCard.click();
    tick();
    expect(moveFieldToTemplateSpy).toHaveBeenCalledOnceWith(component.questions[0]);
  }));

  it('should clicked the card previous fields and call moveFieldToTemplate', fakeAsync(() => {
    component.isLoading = false;
    fixture.detectChanges();
    const moveFieldToTemplateSpy = spyOn(component, 'moveFieldToTemplate');
    const previousQuestionCard = fixture.debugElement.nativeElement.querySelector('#previous-field');
    expect(previousQuestionCard).toBeTruthy();
    previousQuestionCard.click();
    tick();
    expect(moveFieldToTemplateSpy).toHaveBeenCalledOnceWith(component.questions[0]);
  }));

});
