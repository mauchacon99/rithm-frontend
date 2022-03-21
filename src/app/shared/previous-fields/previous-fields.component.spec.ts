import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { StationService } from 'src/app/core/station.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import {
  MockDocumentService,
  MockErrorService,
  MockPopupService,
  MockStationService,
} from 'src/mocks';
import {
  CustomField,
  DialogOptions,
  Question,
  QuestionFieldType,
} from 'src/models';
import { PreviousFieldsComponent } from './previous-fields.component';

describe('PreviousFieldsComponent', () => {
  let component: PreviousFieldsComponent;
  let fixture: ComponentFixture<PreviousFieldsComponent>;
  const stationId = 'E204F369-386F-4E41';
  const documentId = 'E204F369-386F-4E41';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PreviousFieldsComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [MatCardModule, MatDialogModule, MatCheckboxModule],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
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
      },
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a confirm dialog to move the previous field to template area', async () => {
    const dialogExpectData: DialogOptions = {
      title: 'Move field?',
      message:
        'Are you sure you want to move this field into the template area?',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
    };
    const popupSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.moveFieldToTemplate(component.questions[0]);
    expect(popupSpy).toHaveBeenCalledOnceWith(dialogExpectData);
  });

  it('should move the previous field to the template area once confirm the popup', fakeAsync(() => {
    component.isLoading = false;
    fixture.detectChanges();
    const moveFieldToTemplateSpy = spyOn(component, 'moveFieldToTemplate');
    const previousQuestionCard =
      fixture.debugElement.nativeElement.querySelector('#previous-field');
    expect(previousQuestionCard).toBeTruthy();
    previousQuestionCard.click();
    tick();
    expect(moveFieldToTemplateSpy).toHaveBeenCalledOnceWith(
      component.questions[0]
    );
  }));

  it('should return document previous Questions', () => {
    const getPrivate = false;
    component.isStation = false;
    component.documentId = documentId;
    component.stationId = stationId;
    component.isPrivate = getPrivate;
    const getDocumentPreviousQuestionsSpy = spyOn(
      TestBed.inject(DocumentService),
      'getDocumentPreviousQuestions'
    ).and.callThrough();
    component.ngOnInit();
    expect(getDocumentPreviousQuestionsSpy).toHaveBeenCalledOnceWith(
      documentId,
      stationId,
      getPrivate
    );
  });

  it('should return station previous Questions', () => {
    const isPrivate = false;
    component.isStation = true;
    component.stationId = stationId;
    component.isPrivate = isPrivate;
    const getStationPreviousQuestionsSpy = spyOn(
      TestBed.inject(StationService),
      'getStationPreviousQuestions'
    ).and.callThrough();
    component.ngOnInit();
    expect(getStationPreviousQuestionsSpy).toHaveBeenCalledOnceWith(
      stationId,
      isPrivate
    );
  });

  it('should show loading indicators while getting previous questions on the document', () => {
    component.isStation = false;
    component.isPrivate = false;
    component.documentId = documentId;
    component.stationId = stationId;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#loading-previous-field-component'
    );
    expect(loading).toBeTruthy();
  });

  xit('should open the previous question modal', () => {
    const previousQuestion: Question = {
      answer: {
        questionRithmId: '',
        referAttribute: '',
        value: 'value',
      },
      children: [],
      isEncrypted: false,
      isPrivate: false,
      isReadOnly: false,
      isRequired: false,
      possibleAnswers: [],
      prompt: 'Campo Uno',
      questionType: QuestionFieldType.ShortText,
      rithmId: '703ef763-cbfb-4e7',
    };
    const dialogConfirm: DialogOptions = {
      title: `${previousQuestion.prompt}`,
      message: `${previousQuestion.answer?.value}`,
      okButtonText: 'Ok',
      cancelButtonText: 'Cancel',
    };

    const popUpSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    component.openModalPreviousQuestions(previousQuestion);
    expect(popUpSpy).toHaveBeenCalledOnceWith(dialogConfirm);
  });

  it('should call getPreviousFieldIcon and return the icon of the previous field', () => {
    const fieldType = QuestionFieldType.ShortText;
    const customField: CustomField[] = [
      {
        prompt: 'Short Text',
        icon: 'fa-solid fa-font',
        questionType: fieldType,
        dataTestId: 'add-short-text',
      },
    ];
    component.customFields = customField;
    const icon = 'fa-solid fa-font';
    const expectedIcon = component.getPreviousFieldIcon(fieldType);
    expect(expectedIcon).toBe(icon);
  });

  it('should show error message when request for get all previous questions fails', () => {
    component.isStation = true;
    component.isPrivate = false;
    component.isBuildDrawer = true;
    component.stationId = stationId;

    spyOn(
      TestBed.inject(StationService),
      'getStationPreviousQuestions'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component['getStationPreviousQuestions']();
    fixture.detectChanges();
    expect(component.questionsError).toBeTrue();
    const errorComponent = fixture.debugElement.nativeElement.querySelector(
      '#build-previous-questions-error'
    );
    expect(errorComponent).toBeTruthy();
  });

  it('should show loading indicators while getting previous questions as build-drawer', () => {
    component.isStation = true;
    component.isPrivate = false;
    component.isBuildDrawer = true;
    component.stationId = stationId;

    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#build-previous-fields-loading'
    );
    expect(loading).toBeTruthy();
  });

  it('should show build-previous-questions-empty when the array of all previous questions is empty', () => {
    component.isStation = true;
    component.isPrivate = false;
    component.isBuildDrawer = true;
    component.stationId = stationId;

    const questions: Question[] = [];
    spyOn(
      TestBed.inject(StationService),
      'getStationPreviousQuestions'
    ).and.callFake(() => of(questions));

    component['getStationPreviousQuestions']();
    fixture.detectChanges();
    const emptyMessage = fixture.debugElement.nativeElement.querySelector(
      '#build-previous-questions-empty'
    );
    expect(emptyMessage).toBeTruthy();
  });

  it('should show error message when request for get private previous questions fails', () => {
    component.isStation = true;
    component.isPrivate = true;
    component.isBuildDrawer = true;
    component.stationId = stationId;

    spyOn(
      TestBed.inject(StationService),
      'getStationPreviousQuestions'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component['getStationPreviousQuestions']();
    fixture.detectChanges();
    expect(component.questionsError).toBeTrue();
    const errorComponent = fixture.debugElement.nativeElement.querySelector(
      '#build-previous-questions-error'
    );
    expect(errorComponent).toBeTruthy();
  });

  it('should show loading indicators while getting private previous questions as build-drawer', () => {
    component.isStation = true;
    component.isPrivate = true;
    component.isBuildDrawer = true;
    component.stationId = stationId;

    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#build-previous-fields-loading'
    );
    expect(loading).toBeTruthy();
  });

  it('should show build-previous-questions-empty when the array of private previous questions is empty', () => {
    component.isStation = true;
    component.isPrivate = true;
    component.isBuildDrawer = true;
    component.stationId = stationId;

    const questions: Question[] = [];
    spyOn(
      TestBed.inject(StationService),
      'getStationPreviousQuestions'
    ).and.callFake(() => of(questions));

    component['getStationPreviousQuestions']();
    fixture.detectChanges();
    const emptyMessage = fixture.debugElement.nativeElement.querySelector(
      '#build-previous-questions-empty'
    );
    expect(emptyMessage).toBeTruthy();
  });
});
