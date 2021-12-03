import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { ConnectedStationPaneComponent } from 'src/app/detail/connected-station-pane/connected-station-pane.component';
import { DetailDrawerComponent } from 'src/app/detail/detail-drawer/detail-drawer.component';
import { DocumentInfoHeaderComponent } from 'src/app/detail/document-info-header/document-info-header.component';
import { DocumentTemplateComponent } from 'src/app/document/document-template/document-template.component';
import { StationInfoHeaderComponent } from 'src/app/detail/station-info-header/station-info-header.component';
import { SubHeaderComponent } from 'src/app/detail/sub-header/sub-header.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockDocumentService, MockErrorService, MockStationService } from 'src/mocks';
import { ToolbarComponent } from 'src/app/station/toolbar/toolbar.component';
import { StationComponent } from './station.component';
import { StationTemplateComponent } from 'src/app/station/station-template/station-template.component';
import { StationService } from 'src/app/core/station.service';
import { Question, QuestionFieldType, DocumentNameField } from 'src/models';
import { MatExpansionModule } from '@angular/material/expansion';
import { DocumentService } from 'src/app/core/document.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockPopupService } from 'src/mocks/mock-popup-service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('StationComponent', () => {
  let component: StationComponent;
  let fixture: ComponentFixture<StationComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationComponent,
        MockComponent(StationInfoHeaderComponent),
        MockComponent(SubHeaderComponent),
        MockComponent(DetailDrawerComponent),
        MockComponent(ConnectedStationPaneComponent),
        MockComponent(StationInfoHeaderComponent),
        MockComponent(DocumentInfoHeaderComponent),
        MockComponent(DocumentTemplateComponent),
        MockComponent(LoadingIndicatorComponent),
        MockComponent(ToolbarComponent),
        MockComponent(StationTemplateComponent)
      ],
      imports: [
        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        RouterTestingModule.withRoutes(
          [{ path: 'dashboard', component: MockComponent(DashboardComponent) }]
        ),
        MatSidenavModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatExpansionModule
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentInfoHeaderComponent, useClass: DocumentInfoHeaderComponent },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationComponent);
    component = fixture.componentInstance;
    component.stationInformation = {
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      name: 'Dry Goods & Liquids',
      instructions: '',
      nextStations: [{
        name: 'Development',
        rithmId: '741-258-963'
      }],
      previousStations: [{
        name: 'Station-1',
        rithmId: '963-258-741'
      }, {
        name: 'Station-2',
        rithmId: '951-753-987'
      }],
      stationOwners: [{
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isWorker: true,
        isOwner: false
      }, {
        rithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isWorker: true,
        isOwner: false
      }],
      workers: [{
        rithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com',
        isWorker: true,
        isOwner: false
      }, {
        rithmId: '',
        firstName: 'Supervisor',
        lastName: 'User',
        email: 'supervisoruser@inpivota.com',
        isWorker: true,
        isOwner: false
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should add a question', () => {
    const fieldType: QuestionFieldType = QuestionFieldType.ShortText;
    expect(component.stationInformation.questions.length === 4).toBeFalse();
    component.addQuestion(fieldType);
    expect(component.stationInformation.questions.length === 4).toBeTrue();
  });

  it('should move previous field from private/all expansion panel to the template area', () => {
    const previousField: Question = {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'Label #1',
      questionType: QuestionFieldType.ShortText,
      isReadOnly: false,
      isRequired: false,
      isPrivate: false,
      children: [],
      originalStationRithmId: '3j4k-3h2j-hj4j'
    };
    component.movePreviousFieldToTemplate(previousField);
    fixture.detectChanges();
    expect(component.stationInformation.questions).toHaveSize(1);
  });

  it('should open confirmation popup when canceling', async () => {
    const dataToConfirmPopup = {
      title: 'Are you sure?',
      message: 'Your changes will be lost and you will return to the dashboard.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
      important: true,
    };
    const popUpConfirmSpy = spyOn(TestBed.inject(PopupService), 'confirm').and.callThrough();
    await component.cancelStation();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataToConfirmPopup);
  });

  it('should show popup confirm when cancel button is clicked', () => {
    const methodCalled = spyOn(component, 'cancelStation');
    const btnCancel = fixture.debugElement.nativeElement.querySelector('#station-cancel');
    expect(btnCancel).toBeTruthy();
    btnCancel.click();
    expect(methodCalled).toHaveBeenCalled();
  });

  it('should return to dashboard after confirming to cancel changes', async () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    await component.cancelStation();
    expect(routerSpy).toHaveBeenCalledOnceWith('dashboard');
  });

  it('should return success when update station general instruction', () => {
    const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    const generalInstructions = 'New Instructions for current Station';
    component.stationForm.controls.generalInstructions.setValue(generalInstructions);
    fixture.detectChanges();
    const updateGeneralInstructionSpy = spyOn(TestBed.inject(StationService), 'updateStationGeneralInstructions').and.callThrough();
    component.updateStationGeneralInstructions();
    expect(updateGeneralInstructionSpy).toHaveBeenCalledOnceWith(stationId, generalInstructions);
  });

  it('should get previous and following stations', () => {
    component.stationRithmId = component.stationInformation.rithmId;
    const prevAndFollowStations = spyOn(TestBed.inject(StationService), 'getPreviousAndFollowingStations').and.callThrough();
    component.getPreviousAndFollowingStations();
    expect(prevAndFollowStations).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  describe('ChildDocumentInfoHeader', () => {
    let childDocumentInfoHeader: DocumentInfoHeaderComponent;
    let childDocumentInfoHeaderFixture: ComponentFixture<DocumentInfoHeaderComponent>;

    beforeEach(() => {
      childDocumentInfoHeaderFixture = TestBed.createComponent(DocumentInfoHeaderComponent);
      childDocumentInfoHeader = childDocumentInfoHeaderFixture.componentInstance;
    });

    it('should update the station document name template', async () => {
      childDocumentInfoHeader.documentAppendedFields = [
        {
          prompt: 'Address',
          rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
        },
        {
          prompt: '/',
          rithmId: ''
        },
        {
          prompt: 'Which is best?',
          rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
        },
      ];
      component.documentNameTemplate = childDocumentInfoHeader;
      const stationRithmId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
      const documentAppendedFields: DocumentNameField[] = childDocumentInfoHeader.documentAppendedFields;
      const updateTemplateSpy = spyOn(TestBed.inject(StationService),'updateDocumentNameTemplate').and.callThrough();
      component.updateDocumentNameTemplate();
      expect(updateTemplateSpy).toHaveBeenCalledOnceWith(stationRithmId, documentAppendedFields);
    });
  });
});
