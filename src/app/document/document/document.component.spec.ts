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
import { MockDocumentService, MockErrorService, MockPopupService } from 'src/mocks';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailDrawerComponent } from 'src/app/detail/detail-drawer/detail-drawer.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupService } from 'src/app/core/popup.service';
import { Router } from '@angular/router';
import { DocumentAnswer, DocumentAutoFlow, QuestionFieldType } from 'src/models';

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
        MockComponent(LoadingIndicatorComponent)
      ],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(
          [{ path: 'dashboard', component: MockComponent(DashboardComponent) }]
        ),
        MatSidenavModule,
        ReactiveFormsModule,
        MatTooltipModule
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
      .compileComponents();
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
              text: 'Option 1',
              default: false
            },
            {
              text: 'Option 2',
              default: true
            },
            {
              text: 'Option 3',
              default: false
            },
            {
              text: 'Option 4',
              default: false
            }
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
              text: 'Option 1',
              default: false
            },
            {
              text: 'Option 2',
              default: true
            },
            {
              text: 'Option 3',
              default: false
            },
            {
              text: 'Option 4',
              default: false
            }
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
              text: 'Option 1',
              default: false
            },
            {
              text: 'Option 2',
              default: false
            },
            {
              text: 'Option 3',
              default: false
            },
            {
              text: 'Option 4',
              default: false
            }
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
                  text: 'Option 1',
                  default: false
                },
                {
                  text: 'Option 2',
                  default: false
                },
                {
                  text: 'Option 3',
                  default: false
                },
                {
                  text: 'Option 4',
                  default: false
                }
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
        }
      ],
      instructions: 'General instructions'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open confirmation popup when canceling button', async () => {
    const dataToConfirmPopup = {
      title: 'Are you sure?',
      message: 'Your changes will be lost and you will return to the dashboard.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
      important: true,
    };
    const popUpConfirmSpy = spyOn(TestBed.inject(PopupService), 'confirm').and.callThrough();
    await component.cancelDocument();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataToConfirmPopup);
  });

  it('should show popup confirm when cancel button is clicked', () => {
    component.documentLoading = false;
    fixture.detectChanges();
    const methodCalled = spyOn(component, 'cancelDocument');
    const btnCancel = fixture.debugElement.nativeElement.querySelector('#document-cancel');
    expect(btnCancel).toBeTruthy();
    btnCancel.click();
    expect(methodCalled).toHaveBeenCalled();
  });

  it('should return to dashboard after confirming to cancel changes', async () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    await component.cancelDocument();
    expect(routerSpy).toHaveBeenCalledOnceWith('dashboard');
  });

  it('should test method to save document answer', () => {
    const expectedAnswers: DocumentAnswer[] = [{
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
    }];

    const spyQuestionAnswer = spyOn(TestBed.inject(DocumentService), 'saveDocumentAnswer').and.callThrough();
    component.saveDocumentAnswer(expectedAnswers);
    expect(spyQuestionAnswer).toHaveBeenCalledWith(component.documentInformation.documentRithmId, expectedAnswers);
  });

  it('should flow a document by calling the service', () => {
    const expectedData: DocumentAutoFlow = {
      stationRithmId: component.documentInformation.stationRithmId,
      documentRithmId: component.documentInformation.documentRithmId,
      testMode: true
    };

    const spySaveFlowDocument = spyOn(TestBed.inject(DocumentService), 'autoFlowDocument').and.callThrough();

    component.autoFlowDocument(expectedData);

    expect(spySaveFlowDocument).toHaveBeenCalledWith(expectedData);
  });
});
