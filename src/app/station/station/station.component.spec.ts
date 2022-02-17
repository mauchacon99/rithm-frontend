import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { ConnectedStationPaneComponent } from 'src/app/shared/connected-station-pane/connected-station-pane.component';
import { DetailDrawerComponent } from 'src/app/shared/detail-drawer/detail-drawer.component';
import { DocumentInfoHeaderComponent } from 'src/app/shared/document-info-header/document-info-header.component';
import { DocumentTemplateComponent } from 'src/app/document/document-template/document-template.component';
import { StationInfoHeaderComponent } from 'src/app/shared/station-info-header/station-info-header.component';
import { SubHeaderComponent } from 'src/app/shared/sub-header/sub-header.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import {
  MockDocumentService,
  MockErrorService,
  MockStationService,
} from 'src/mocks';
import { ToolbarComponent } from 'src/app/station/toolbar/toolbar.component';
import { StationComponent } from './station.component';
import { StationTemplateComponent } from 'src/app/station/station-template/station-template.component';
import { StationService } from 'src/app/core/station.service';
import {
  FlowLogicRule,
  OperandType,
  OperatorType,
  Question,
  QuestionFieldType,
  RuleType,
} from 'src/models';
import { MatExpansionModule } from '@angular/material/expansion';
import { MockUserService } from 'src/mocks/mock-user-service';
import { UserService } from 'src/app/core/user.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockPopupService } from 'src/mocks/mock-popup-service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DocumentService } from 'src/app/core/document.service';
import { throwError } from 'rxjs';

describe('StationComponent', () => {
  let component: StationComponent;
  let fixture: ComponentFixture<StationComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationComponent,
        MockComponent(SubHeaderComponent),
        MockComponent(DetailDrawerComponent),
        MockComponent(ConnectedStationPaneComponent),
        MockComponent(StationInfoHeaderComponent),
        MockComponent(DocumentInfoHeaderComponent),
        MockComponent(DocumentTemplateComponent),
        MockComponent(LoadingIndicatorComponent),
        MockComponent(ToolbarComponent),
        MockComponent(StationTemplateComponent),
      ],
      imports: [
        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: MockComponent(DashboardComponent) },
        ]),
        MatSidenavModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatExpansionModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: UserService, useClass: MockUserService },
        {
          provide: DocumentInfoHeaderComponent,
          useClass: DocumentInfoHeaderComponent,
        },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationComponent);
    component = fixture.componentInstance;
    component.stationInformation = {
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      name: 'Dry Goods & Liquids',
      instructions: '',
      nextStations: [
        {
          name: 'Development',
          rithmId: '741-258-963',
        },
      ],
      previousStations: [
        {
          name: 'Station-1',
          rithmId: '963-258-741',
        },
        {
          name: 'Station-2',
          rithmId: '951-753-987',
        },
      ],
      stationOwners: [
        {
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
        {
          rithmId: '',
          firstName: 'Worker',
          lastName: 'User',
          email: 'workeruser@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
      ],
      workers: [
        {
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
        {
          rithmId: '',
          firstName: 'Supervisor',
          lastName: 'User',
          email: 'supervisoruser@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
      ],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2,
      allowPreviousButton: false,
      allowAllOrgWorkers: false,
      allowExternalWorkers: true,
      flowButton: 'Flow',
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
      originalStationRithmId: '3j4k-3h2j-hj4j',
    };
    component.movePreviousFieldToTemplate(previousField);
    fixture.detectChanges();
    expect(component.stationInformation.questions).toHaveSize(1);
  });

  it('should call service methods to update data when save button is clicked ', () => {
    component.stationForm.get('stationTemplateForm')?.markAsTouched();
    component.stationForm.get('stationTemplateForm')?.markAsDirty();
    const spyUpdateStationName = spyOn(
      TestBed.inject(StationService),
      'updateStationName'
    ).and.callThrough();
    const spyUpdateNameTemplate = spyOn(
      TestBed.inject(StationService),
      'updateDocumentNameTemplate'
    ).and.callThrough();
    const spyUpdateGeneralInstructions = spyOn(
      TestBed.inject(StationService),
      'updateStationGeneralInstructions'
    ).and.callThrough();
    const spyUpdateStationQuestions = spyOn(
      TestBed.inject(StationService),
      'updateStationQuestions'
    ).and.callThrough();
    const spyFunctionSave = spyOn(
      component,
      'saveStationInformation'
    ).and.callThrough();
    const button =
      fixture.debugElement.nativeElement.querySelector('#station-save');

    fixture.detectChanges();
    button.click();

    expect(spyFunctionSave).toHaveBeenCalled();
    expect(spyUpdateStationName).toHaveBeenCalled();
    expect(spyUpdateNameTemplate).toHaveBeenCalled();
    expect(spyUpdateGeneralInstructions).toHaveBeenCalled();
    expect(spyUpdateStationQuestions).toHaveBeenCalled();
  });

  it('should validate the form controls initial value', () => {
    const form = component.stationForm.controls;
    const expectFormFirst = ['stationTemplateForm', 'generalInstructions'];

    expect(Object.keys(form)).toEqual(expectFormFirst);
    expect(form['stationTemplateForm'].value).toBe('');
    expect(form['generalInstructions'].value).toBe('');
  });

  it('should open confirmation popup when canceling', async () => {
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
    await component.cancelStation();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataToConfirmPopup);
  });

  it('should show popup confirm when cancel button is clicked', () => {
    const methodCalled = spyOn(component, 'cancelStation');
    const btnCancel =
      fixture.debugElement.nativeElement.querySelector('#station-cancel');
    expect(btnCancel).toBeTruthy();
    btnCancel.click();
    expect(methodCalled).toHaveBeenCalled();
  });

  it('should return to dashboard after confirming to cancel changes', async () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    await component.cancelStation();
    expect(routerSpy).toHaveBeenCalledOnceWith('dashboard');
  });

  it('should get previous and next stations', () => {
    component.stationRithmId = component.stationInformation.rithmId;
    const prevAndNextStations = spyOn(
      TestBed.inject(StationService),
      'getPreviousAndNextStations'
    ).and.callThrough();
    component.getPreviousAndNextStations();
    expect(prevAndNextStations).toHaveBeenCalledOnceWith(
      component.stationRithmId
    );
  });

  it('should call sidenav service in the init life cycle', () => {
    const spySideNav = spyOn(TestBed.inject(SidenavDrawerService), 'setDrawer');

    component.ngOnInit();

    expect(spySideNav).toHaveBeenCalled();
  });

  it('should redirect to dashboard if param stationId is empty in the init life cycle', () => {
    const spyGetParams = spyOn(TestBed.inject(Router), 'navigateByUrl');

    component.ngOnInit();

    expect(spyGetParams).toHaveBeenCalledOnceWith('dashboard');
  });

  it('should get previous and next stations on page load', () => {
    const spyMethodPrevAndNextStation = spyOn(
      component,
      'getPreviousAndNextStations'
    );

    component.ngOnInit();

    expect(spyMethodPrevAndNextStation).toHaveBeenCalled();
  });

  it('should populate the question children if it is an addressLine question type', () => {
    const fieldType: QuestionFieldType = QuestionFieldType.AddressLine;
    component.addQuestion(fieldType);
    expect(component.stationInformation.questions[0].children).toHaveSize(5);
  });

  it('should call the method that detect change tabs.', () => {
    const tabsIndex = {
      index: 1,
    } as MatTabChangeEvent;
    const spyTabsChange = spyOn(
      component,
      'tabSelectedChanged'
    ).and.callThrough();
    component.tabSelectedChanged(tabsIndex);
    expect(component.isFlowLogicTab).toBeTrue();
    expect(spyTabsChange).toHaveBeenCalledWith(tabsIndex);
  });

  it('should call the method that returns new flow logic rules.', () => {
    const stationFlowLogic: FlowLogicRule = {
      stationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
      destinationStationRithmID: '73d47261-1932-4fcf-82bd-159eb1a7243f',
      flowRule: {
        ruleType: RuleType.Or,
        equations: [
          {
            leftOperand: {
              type: OperandType.Field,
              questionType: QuestionFieldType.ShortText,
              value: 'birthday',
              text:'test'
            },
            operatorType: OperatorType.Before,
            rightOperand: {
              type: OperandType.Date,
              questionType: QuestionFieldType.ShortText,
              value: '5/27/1982',
              text:'test'
            },
          },
        ],
        subRules: [],
      },
    };
    const spyNewRulesStation = spyOn(
      component,
      'addFlowLogicRule'
    ).and.callThrough();
    component.addFlowLogicRule(stationFlowLogic);
    expect(spyNewRulesStation).toHaveBeenCalledWith(stationFlowLogic);
  });

  it('should saved the flow logic rules in current station', () => {
    component.isFlowLogicTab = true;
    const spySavedFlowLogicRules = spyOn(
      TestBed.inject(DocumentService),
      'saveStationFlowLogic'
    ).and.callThrough();
    component.saveFlowLogicRules();
    expect(spySavedFlowLogicRules).toHaveBeenCalled();
  });

  it('should show error message when saved flow logic rules in current station', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'saveStationFlowLogic'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const displayErrorSpy = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.saveFlowLogicRules();
    expect(displayErrorSpy).toHaveBeenCalled();
  });
});
