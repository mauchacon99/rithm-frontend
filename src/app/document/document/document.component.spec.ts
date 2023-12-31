import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { ConnectedStationPaneComponent } from 'src/app/shared/connected-station-pane/connected-station-pane.component';
import { DocumentInfoHeaderComponent } from 'src/app/shared/document-info-header/document-info-header.component';
import { DocumentTemplateComponent } from 'src/app/document/document-template/document-template.component';
import { StationInfoHeaderComponent } from 'src/app/shared/station-info-header/station-info-header.component';
import { SubHeaderComponent } from 'src/app/shared/sub-header/sub-header.component';
import { DocumentComponent } from './document.component';
import {
  MockDocumentService,
  MockErrorService,
  MockPopupService,
  MockSplitService,
  MockStationService,
  MockUserService,
} from 'src/mocks';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailDrawerComponent } from 'src/app/shared/detail-drawer/detail-drawer.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupService } from 'src/app/core/popup.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FrameType,
  MoveDocument,
  QuestionFieldType,
  StationRosterMember,
} from 'src/models';
import { of, throwError } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserService } from 'src/app/core/user.service';
import { MapComponent } from 'src/app/map/map/map.component';
import { StationService } from 'src/app/core/station.service';
import { SplitService } from 'src/app/core/split.service';

describe('DocumentComponent', () => {
  let component: DocumentComponent;
  let fixture: ComponentFixture<DocumentComponent>;
  const formBuilder = new FormBuilder();
  const user: StationRosterMember = {
    rithmId: '123132132',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@demo.com',
    isWorker: true,
    isOwner: false,
  };

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
          { path: 'Map', component: MockComponent(MapComponent) },
          { path: 'dashboard', component: MockComponent(DashboardComponent) },
        ]),
        MatSidenavModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatExpansionModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: UserService, useClass: MockUserService },
        { provide: StationService, useClass: MockStationService },
        { provide: SplitService, useClass: MockSplitService },
        {
          provide: ActivatedRoute,
          useValue: {
            // eslint-disable-next-line rxjs/finnish
            queryParams: of({
              stationId: '4fb462ec-0772-49dc-8cfb-3849d70ad168',
              documentId: 'f74147da-fd64-4244-b533-081990118e95',
            }),
          },
        },
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
      currentAssignedUser: user,
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
      isChained: false,
    };
    component.previousStations = [
      {
        rithmId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
        name: 'Previous Station',
      },
      {
        rithmId: '44904ac2-6bdd-4157-a818-50ffb37fdfbd',
        name: 'Previous Station #2',
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open confirmation popup when canceling button', async () => {
    const dataToConfirmPopup = {
      title: 'Are you sure?',
      message: 'Your changes will be lost and you will return to the map.',
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
    fixture.detectChanges();
    const btnFlow =
      fixture.debugElement.nativeElement.querySelector('#document-flow');
    const btnSave =
      fixture.debugElement.nativeElement.querySelector('#document-save');
    expect(btnSave).toBeTruthy();
    expect(btnFlow).toBeTruthy();
    btnSave.click();
    btnFlow.click();
    expect(component.documentForm.touched).toBeTruthy();
    expect(btnFlow.disabled).toBeFalsy();
    expect(btnSave.disabled).toBeFalsy();
  });

  it('should called saveAnswers service when saving document changes', () => {
    const expectedAnswer = component.documentAnswer;
    const spySaveAnswerDocument = spyOn(
      TestBed.inject(DocumentService),
      'saveDocumentAnswer'
    ).and.callThrough();
    component.saveDocumentChanges();
    expect(spySaveAnswerDocument).toHaveBeenCalledOnceWith(
      component.documentInformation.documentRithmId,
      expectedAnswer
    );
  });

  it('should called UpdateDocumentName service when saving document changes', () => {
    const documentService = TestBed.inject(DocumentService);
    documentService.documentName$.next({
      baseName: 'New Document Name',
      appendedName: '',
    });
    const documentName = 'New Document Name';
    const spyUpdateDocumentName = spyOn(
      TestBed.inject(DocumentService),
      'updateDocumentName'
    ).and.callThrough();
    component.saveDocumentChanges();
    expect(spyUpdateDocumentName).toHaveBeenCalledOnceWith(
      component.documentInformation.documentRithmId,
      documentName
    );
  });

  it('should called service to save answers and then auto flow the container', async () => {
    const expectedAnswer = component.documentAnswer;
    const documentService = TestBed.inject(DocumentService);
    component.shouldFlowContainer = true;
    fixture.autoDetectChanges();

    const spySaveContainerAnswers = spyOn(
      TestBed.inject(DocumentService),
      'saveDocumentAnswer'
    ).and.returnValue(of([]));

    const spyUpdateContainerName = spyOn(
      TestBed.inject(DocumentService),
      'updateDocumentName'
    ).and.returnValue(of('New container Name'));

    const spySaveAutoFlowContainer = spyOn(
      TestBed.inject(DocumentService),
      'autoFlowDocument'
    ).and.returnValue(of([]));

    const dialogSpy = spyOn(TestBed.inject(PopupService), 'notify');

    documentService.documentName$.next({
      baseName: 'New Document Name',
      appendedName: '',
    });

    component.saveDocumentChanges();

    const documentName = 'New Document Name';

    expect(spySaveContainerAnswers).toHaveBeenCalledOnceWith(
      component.documentInformation.documentRithmId,
      expectedAnswer
    );

    expect(spyUpdateContainerName).toHaveBeenCalledOnceWith(
      component.documentInformation.documentRithmId,
      documentName
    );

    expect(spySaveAutoFlowContainer).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledOnceWith(
      'The container has saved and flowed successfully'
    );
  });

  describe('Document when isWidget is true', () => {
    const stationRithmIdWidget = '123-654-789';
    const documentRithmIdWidget = '321-654-987';

    it('should call method for show data in document how widget', () => {
      component.stationRithmIdWidget = stationRithmIdWidget;
      component.documentRithmIdWidget = documentRithmIdWidget;
      component.isWidget = true;
      const spyMethod = spyOn(
        TestBed.inject(DocumentService),
        'getDocumentInfo'
      ).and.callThrough();
      component.ngOnInit();
      expect(spyMethod).toHaveBeenCalledOnceWith(
        component.documentRithmIdWidget,
        component.stationRithmIdWidget
      );
    });

    it('should catch error the method and redirect to dashboard component', () => {
      component.stationRithmIdWidget = stationRithmIdWidget;
      component.documentRithmIdWidget = documentRithmIdWidget;
      component.isWidget = true;
      spyOn(TestBed.inject(DocumentService), 'getDocumentInfo').and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      component.ngOnInit();
      const templateDocument = fixture.debugElement.nativeElement.querySelector(
        '#document-info-template'
      );
      expect(templateDocument).toBeFalsy();
    });

    it('should return document list in widget when click in cancel button', async () => {
      const expectSpyMethod = spyOn(component.returnDocumentsWidget, 'emit');
      spyOn(TestBed.inject(PopupService), 'confirm').and.returnValue(
        Promise.resolve(true)
      );
      component.isWidget = true;
      fixture.detectChanges();
      await component.cancelDocument();
      expect(expectSpyMethod).toHaveBeenCalled();
    });

    it('should disable buttons save and flow when is not admin or owner worker', () => {
      component.footerExpanded = true;
      component.documentInformation.stationOwners = [
        {
          email: 'rithmadmin@inpivota.com',
          firstName: 'admin',
          isAssigned: false,
          lastName: 'user',
          rithmId: 'B5702D6F-0C35-4EB2-9062-C895E22EAEEF',
        },
      ];
      component.isWidget = true;
      component.documentLoading = false;
      fixture.detectChanges();
      const btnFlow =
        fixture.elementRef.nativeElement.querySelector('#document-flow');
      const btnSave =
        fixture.elementRef.nativeElement.querySelector('#document-save');
      expect(btnFlow.disabled).toBeTrue();
      expect(btnSave.disabled).toBeTrue();
      expect(component.isUserAdminOrOwner).toBeFalse();
    });
  });

  it('should move flow document to a previous stations', async () => {
    const stationId = component.documentInformation.stationRithmId;
    const documentId = component.documentInformation.documentRithmId;
    const previousStations: string[] = component.previousStations.map(
      (item) => item.rithmId
    );

    const dataExpect: MoveDocument = {
      fromStationRithmId: stationId,
      toStationRithmIds: previousStations,
      documentRithmId: documentId,
    };
    component['stationId'] = stationId;
    component['documentId'] = documentId;

    const spyMethod = spyOn(
      TestBed.inject(DocumentService),
      'flowDocumentToPreviousStation'
    ).and.callThrough();
    await component.flowDocumentToPreviousStation();
    expect(spyMethod).toHaveBeenCalledOnceWith(dataExpect);
  });

  it('should catch an error when moving document to previous station fails', async () => {
    spyOn(
      TestBed.inject(DocumentService),
      'flowDocumentToPreviousStation'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    await component.flowDocumentToPreviousStation();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call and emit widgetReloadListDocuments', () => {
    const spyEmit = spyOn(component.returnDocumentsWidget, 'emit');
    component.widgetReloadListDocuments(true, false);
    expect(spyEmit).toHaveBeenCalledOnceWith({
      isReturnListDocuments: true,
      isReloadListDocuments: false,
      stationFlow: [],
    });
  });

  it('should get text of flow button', () => {
    const spyFlowButton = spyOn(
      TestBed.inject(StationService),
      'getFlowButtonText'
    ).and.callThrough();
    expect(component.flowButtonName).toBeFalsy();
    component['stationId'] = component.documentInformation.stationRithmId;
    fixture.detectChanges();
    component.getFlowButtonName();
    expect(spyFlowButton).toHaveBeenCalledOnceWith(
      component.documentInformation.stationRithmId
    );
  });

  it('should catch error when unable to get flow button text', () => {
    spyOn(TestBed.inject(StationService), 'getFlowButtonText').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.getFlowButtonName();
    expect(component.flowButtonName).toBe('Flow');
    expect(spyError).toHaveBeenCalled();
  });

  it('should get data about the document, station and get the name for the flow button', () => {
    const stationId = component.documentInformation.stationRithmId;
    const documentId = component.documentInformation.documentRithmId;
    component['stationId'] = stationId;
    component['documentId'] = documentId;

    const documentStationSpy = spyOn(
      TestBed.inject(DocumentService),
      'getDocumentInfo'
    ).and.callThrough();
    const flowBtnTextSpy = spyOn(
      TestBed.inject(StationService),
      'getFlowButtonText'
    ).and.callThrough();

    component['getDocumentStationData']();
    expect(documentStationSpy).toHaveBeenCalledOnceWith(documentId, stationId);
    component.getFlowButtonName();
    expect(flowBtnTextSpy).toHaveBeenCalledOnceWith(stationId);
  });

  it('should emit and set new user for document', () => {
    const expectDataUser = {
      email: 'bokatan.kryze@inpivota.com',
      firstName: 'Bo-Katan',
      isAssigned: true,
      lastName: 'Kryze',
      rithmId: 'a3f2e8ef-c7cc-4eaf-8833-d6385d4b35f9',
    };
    expect(component.documentInformation.currentAssignedUser).toBe(user);
    component.setNewAssignedUser(expectDataUser);
    expect(component.documentInformation.currentAssignedUser).toBe(
      expectDataUser
    );
  });

  it('should emit event for executed petition and refresh widget', async () => {
    component.isWidget = true;
    component.shouldFlowContainer = false;

    spyOn(
      TestBed.inject(DocumentService),
      'saveDocumentAnswer'
    ).and.returnValue(of([]));

    spyOn(
      TestBed.inject(DocumentService),
      'updateDocumentName'
    ).and.returnValue(of('New container Name'));

    const spyEmit = spyOn(
      component.returnDocumentsWidget,
      'emit'
    ).and.callThrough();
    const spyMethod = spyOn(
      component,
      'widgetReloadListDocuments'
    ).and.callThrough();

    await component.saveDocumentChanges();

    expect(spyMethod).toHaveBeenCalledOnceWith(false, true, [
      'rithmIdTempOnlySave',
    ]);
    expect(spyEmit).toHaveBeenCalledOnceWith({
      isReturnListDocuments: false,
      isReloadListDocuments: true,
      stationFlow: ['rithmIdTempOnlySave'],
    });
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;

    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
    });

    it('should call split service and treatments', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const spyGetStationDocumentTreatment = spyOn(
        splitService,
        'getStationDocumentTreatment'
      ).and.callThrough();

      splitService.sdkReady$.next();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(spyGetStationDocumentTreatment).toHaveBeenCalled();
      expect(component.viewNewContainer).toBeTrue();
    });

    it('should catch split error ', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      splitService.sdkReady$.error('error');
      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(errorService).toHaveBeenCalled();
      expect(component.viewNewContainer).toBeFalse();
    });
  });
  it('should get the method that get the list of frames by type', () => {
    const stationId = component.documentInformation.stationRithmId;
    const documentId = component.documentInformation.documentRithmId;

    const framesSpy = spyOn(
      TestBed.inject(DocumentService),
      'getDataLinkFrames'
    ).and.callThrough();

    component.getDataLinkFrames();
    expect(framesSpy).toHaveBeenCalledOnceWith(
      stationId,
      documentId,
      FrameType.DataLink
    );
  });

  it('should call getContainerWidgets when calling ngOnInit and is not a widget', () => {
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'getContainerWidgets'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should catch error if petition to return get container widgets fails', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getContainerWidgets'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });
});
