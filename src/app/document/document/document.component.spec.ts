import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { ConnectedStationPaneComponent } from 'src/app/detail/connected-station-pane/connected-station-pane.component';
import { DocumentInfoHeaderComponent } from 'src/app/detail/document-info-header/document-info-header.component';
import { DocumentTemplateComponent } from 'src/app/document/document-template/document-template.component';
import { StationInfoHeaderComponent } from 'src/app/detail/station-info-header/station-info-header.component';
import { SubHeaderComponent } from 'src/app/detail/sub-header/sub-header.component';
import { DocumentComponent } from './document.component';
import {
  MockDocumentService,
  MockErrorService,
  MockPopupService,
} from 'src/mocks';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailDrawerComponent } from 'src/app/detail/detail-drawer/detail-drawer.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupService } from 'src/app/core/popup.service';
import { Router } from '@angular/router';
import {
  DocumentAnswer,
  DocumentAutoFlow,
  QuestionFieldType,
} from 'src/models';
import { forkJoin, of } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';

describe('DocumentComponent', () => {
  let component: DocumentComponent;
  let fixture: ComponentFixture<DocumentComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentComponent,
        MockComponent(SubHeaderComponent),
        MockComponent(DetailDrawerComponent),
        MockComponent(ConnectedStationPaneComponent),
        MockComponent(StationInfoHeaderComponent),
        MockComponent(DocumentInfoHeaderComponent),
        MockComponent(DocumentTemplateComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: MockComponent(DashboardComponent) },
        ]),
        MatSidenavModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatExpansionModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentComponent);
    component = fixture.componentInstance;
    component.documentInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      documentRithmId: 'E204F369-386F-4E41',
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      stationInstruction: 'This is an instruction',
      stationOwners: [],
      workers: [],
      questions: [
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 1',
          questionType: QuestionFieldType.ShortText,
          isReadOnly: false,
          isRequired: false,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 2',
          questionType: QuestionFieldType.LongText,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 3',
          questionType: QuestionFieldType.URL,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 4',
          questionType: QuestionFieldType.Email,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 5',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 6',
          questionType: QuestionFieldType.Phone,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 7',
          questionType: QuestionFieldType.Currency,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 8',
          questionType: QuestionFieldType.Date,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 9',
          questionType: QuestionFieldType.Select,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          possibleAnswers: [
            {
              rithmId: '3j4k-3h2j-hj41',
              text: 'Option 1',
              default: false,
            },
            {
              rithmId: '3j4k-3h2j-hj42',
              text: 'Option 2',
              default: true,
            },
            {
              rithmId: '3j4k-3h2j-hj43',
              text: 'Option 3',
              default: false,
            },
            {
              rithmId: '3j4k-3h2j-hj44',
              text: 'Option 4',
              default: false,
            },
          ],
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 10',
          questionType: QuestionFieldType.MultiSelect,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          possibleAnswers: [
            {
              rithmId: '3j4k-3h2j-hj41',
              text: 'Option 1',
              default: false,
            },
            {
              rithmId: '3j4k-3h2j-hj42',
              text: 'Option 2',
              default: true,
            },
            {
              rithmId: '3j4k-3h2j-hj43',
              text: 'Option 3',
              default: false,
            },
            {
              rithmId: '3j4k-3h2j-hj44',
              text: 'Option 4',
              default: false,
            },
          ],
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 12',
          questionType: QuestionFieldType.CheckList,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          possibleAnswers: [
            {
              rithmId: '3j4k-3h2j-hj41',
              text: 'Option 1',
              default: false,
            },
            {
              rithmId: '3j4k-3h2j-hj42',
              text: 'Option 2',
              default: false,
            },
            {
              rithmId: '3j4k-3h2j-hj43',
              text: 'Option 3',
              default: false,
            },
            {
              rithmId: '3j4k-3h2j-hj44',
              text: 'Option 4',
              default: false,
            },
          ],
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 13',
          questionType: QuestionFieldType.Nested,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Address Line 1',
              questionType: QuestionFieldType.AddressLine,
              isReadOnly: false,
              isRequired: false,
              isPrivate: false,
              children: [],
            },
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Address Line 2',
              questionType: QuestionFieldType.AddressLine,
              isReadOnly: false,
              isRequired: false,
              isPrivate: false,
              children: [],
            },
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Fake question 1',
              questionType: QuestionFieldType.City,
              isReadOnly: false,
              isRequired: false,
              isPrivate: false,
              children: [],
            },
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Fake question 12',
              questionType: QuestionFieldType.State,
              isReadOnly: false,
              isRequired: true,
              isPrivate: false,
              possibleAnswers: [
                {
                  rithmId: '3j4k-3h2j-hj41',
                  text: 'Option 1',
                  default: false,
                },
                {
                  rithmId: '3j4k-3h2j-hj42',
                  text: 'Option 2',
                  default: false,
                },
                {
                  rithmId: '3j4k-3h2j-hj43',
                  text: 'Option 3',
                  default: false,
                },
                {
                  rithmId: '3j4k-3h2j-hj44',
                  text: 'Option 4',
                  default: false,
                },
              ],
              children: [],
            },
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Zip',
              questionType: QuestionFieldType.Zip,
              isReadOnly: false,
              isRequired: true,
              isPrivate: false,
              children: [],
            },
          ],
        },
      ],
      instructions: 'General instructions',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open confirmation popup when canceling button', async () => {
    const dataToConfirmPopup = {
      title: 'Are you sure?',
      message:
        'Your changes will be lost and you will return to the dashboard.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
      important: true,
    };
    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.cancelDocument();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataToConfirmPopup);
  });

  it('should show popup confirm when cancel button is clicked', () => {
    component.documentLoading = false;
    fixture.detectChanges();
    const methodCalled = spyOn(component, 'cancelDocument');
    const btnCancel =
      fixture.debugElement.nativeElement.querySelector('#document-cancel');
    expect(btnCancel).toBeTruthy();
    btnCancel.click();
    expect(methodCalled).toHaveBeenCalled();
  });

  it('should return to dashboard after confirming to cancel changes', async () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    await component.cancelDocument();
    expect(routerSpy).toHaveBeenCalledOnceWith('dashboard');
  });

  it('should validate the form controls initial value', () => {
    const form = component.documentForm.controls;
    const expectFormFirst = ['documentTemplateForm'];

    expect(Object.keys(form)).toEqual(expectFormFirst);
    expect(form['documentTemplateForm'].value).toBe('');
  });

  it('should disable the button if form is not valid', () => {
    component.documentLoading = false;
    component.documentForm
      .get('documentTemplateForm')
      ?.addValidators(Validators.required);
    fixture.detectChanges();
    const btnFlow =
      fixture.debugElement.nativeElement.querySelector('#document-flow');
    expect(btnFlow.disabled).toBeTruthy();
  });

  it('should show button as enabled if form is valid', () => {
    component.documentLoading = false;
    component.documentForm.controls['documentTemplateForm'].setValue('Dev');
    component.documentForm.markAsDirty();
    fixture.detectChanges();
    const btnFlow =
      fixture.debugElement.nativeElement.querySelector('#document-flow');
    expect(btnFlow.disabled).toBeFalsy();
  });

  it('should called service to save answers and auto flow the document', () => {
    const expectedAnswer = component.documentAnswer;

    const expectAutoFlow: DocumentAutoFlow = {
      stationRithmId: component.documentInformation.stationRithmId,
      documentRithmId: component.documentInformation.documentRithmId,
      testMode: false,
    };

    const spySaveAnswerDocument = spyOn(
      TestBed.inject(DocumentService),
      'saveDocumentAnswer'
    ).and.callThrough();
    const spySaveAutoFlowDocument = spyOn(
      TestBed.inject(DocumentService),
      'autoFlowDocument'
    ).and.callThrough();

    component.autoFlowDocument();

    expect(spySaveAnswerDocument).toHaveBeenCalledOnceWith(
      component.documentInformation.documentRithmId,
      expectedAnswer
    );
    expect(spySaveAutoFlowDocument).toHaveBeenCalledOnceWith(expectAutoFlow);
  });

  it('should call the method that saves the responses and the flow of the document when you click on the flow button', () => {
    component.documentLoading = false;
    component.documentForm.controls['documentTemplateForm'].setValue('Dev');
    component.documentForm.markAsDirty();
    fixture.detectChanges();
    const spyMethod = spyOn(component, 'autoFlowDocument').and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#document-flow');

    button.click();

    expect(spyMethod).toHaveBeenCalled();
  });

  it('should test method to save document answer', () => {
    const expectedAnswers: DocumentAnswer[] = [
      {
        questionRithmId: 'Dev 1',
        documentRithmId: '123-654-789',
        stationRithmId: '741-951-753',
        value: 'Answer Dev',
        file: 'dev.txt',
        filename: 'dev',
        type: QuestionFieldType.Email,
        rithmId: '789-321-456',
        questionUpdated: true,
      },
      {
        questionRithmId: 'Dev 2',
        documentRithmId: '123-654-789-856',
        stationRithmId: '741-951-753-741',
        value: 'Answer Dev2',
        file: 'dev2.txt',
        filename: 'dev2',
        type: QuestionFieldType.City,
        rithmId: '789-321-456-789',
        questionUpdated: false,
      },
    ];
    component.documentAnswer = expectedAnswers;

    const spyQuestionAnswer = spyOn(
      TestBed.inject(DocumentService),
      'saveDocumentAnswer'
    ).and.callThrough();
    component.saveDocumentAnswer();
    expect(spyQuestionAnswer).toHaveBeenCalledWith(
      component.documentInformation.documentRithmId,
      component.documentAnswer
    );
  });

  it('should call the save method when the save button is clicked', () => {
    component.documentLoading = false;
    const spyMethod = spyOn(component, 'saveDocumentAnswer').and.callThrough();
    fixture.detectChanges();
    const buttonSave =
      fixture.debugElement.nativeElement.querySelector('#document-save');
    buttonSave.click();
    expect(spyMethod).toHaveBeenCalled();
  });

  describe('navigateRouterTesting', () => {
    let router: Router;
    let routerNavigateSpy: jasmine.Spy;

    beforeEach(() => {
      router = TestBed.inject(Router);
      routerNavigateSpy = spyOn(router, 'navigateByUrl');
    });

    // TODO: spec has no expectations being called
    xit('should redirect to dashboard if petitions are successfully', () => {
      forkJoin([of(), of()]).subscribe(() => {
        expect(routerNavigateSpy).toHaveBeenCalledOnceWith('dashboard');
      });
      component.autoFlowDocument();
    });
    // TODO: spec has no expectations being called
    xit('should not redirect if some petition is wrong', () => {
      forkJoin([of(Error()), of()]).subscribe(() => {
        expect(routerNavigateSpy).not.toHaveBeenCalled();
      });
      component.autoFlowDocument();
    });
  });
});
