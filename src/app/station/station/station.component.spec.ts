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
import { BuildDrawerComponent } from 'src/app/station/build-drawer/build-drawer.component';
import { SubHeaderComponent } from 'src/app/shared/sub-header/sub-header.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import {
  MockDocumentService,
  MockErrorService,
  MockStationService,
  MockSplitService,
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
import { FlowLogicComponent } from 'src/app/station/flow-logic/flow-logic.component';
import { MatDividerModule } from '@angular/material/divider';
import { GridsterModule } from 'angular-gridster2';
import { displayGrids } from 'angular-gridster2/lib/gridsterConfig.interface';
import { InputFrameWidgetComponent } from 'src/app/shared/station-document-widgets/input-frame-widget/input-frame-widget/input-frame-widget.component';
import { SplitService } from 'src/app/core/split.service';

describe('StationComponent', () => {
  let component: StationComponent;
  let fixture: ComponentFixture<StationComponent>;
  let stationInject: StationService;
  const formBuilder = new FormBuilder();
  const question: Question = {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Label #1',
    questionType: QuestionFieldType.ShortText,
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    children: [],
    originalStationRithmId: '3j4k-3h2j-hj4j',
  };
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
        MockComponent(InputFrameWidgetComponent),
        MockComponent(BuildDrawerComponent),
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
        MatDividerModule,
        GridsterModule,
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
        { provide: SplitService, useClass: MockSplitService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationComponent);
    stationInject = TestBed.inject(StationService);
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
      isChained: false,
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
    const previousField = question;
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
    const spyUpdateFlowButtonText = spyOn(
      TestBed.inject(StationService),
      'updateFlowButtonText'
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
    expect(spyUpdateFlowButtonText).toHaveBeenCalled();
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

  it('should show error message when get previous and next stations', () => {
    spyOn(
      TestBed.inject(StationService),
      'getPreviousAndNextStations'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const displayErrorSpy = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.getPreviousAndNextStations();
    expect(displayErrorSpy).toHaveBeenCalled();
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

  it('should evaluate in questions when a possible answer will be empty', () => {
    const fieldType: QuestionFieldType = QuestionFieldType.CheckList;
    component.addQuestion(fieldType);
    expect(component.stationInformation.questions[0].children).toHaveSize(0);
  });

  it('should listen the station question when exists', () => {
    component.stationInformation.questions = [question];
    fixture.detectChanges();
    stationInject.stationQuestion$.next(question);
    const prevQuestion = component.stationInformation.questions.find(
      (field) => field.rithmId === question.rithmId
    );
    expect(prevQuestion).toBeTruthy();
  });

  it('should listen the station question when there are possible answers', () => {
    component.stationInformation.questions = [
      {
        rithmId: '3j4k-3h2j-hj6j',
        prompt: 'Label #1',
        questionType: QuestionFieldType.ShortText,
        isReadOnly: false,
        isRequired: false,
        isPrivate: false,
        children: [],
        originalStationRithmId: '3j4k-3h2j-hj4j',
        possibleAnswers: [
          {
            rithmId: '3j4k-3h2j-hj41',
            text: 'Option 1',
            default: false,
          },
        ],
      },
    ];
    fixture.detectChanges();
    stationInject.stationQuestion$.next(question);
    const prevQuestion = component.stationInformation.questions.find(
      (field) => field.rithmId === question.rithmId
    );
    expect(prevQuestion).toBeFalsy();
  });

  it('should update text of flow button', () => {
    const flowButtonName = '';
    expect(flowButtonName).toBe('');
    stationInject.flowButtonText$.next('Flow');
    expect(flowButtonName).toBe('');
    expect(component.stationInformation.flowButton).toBe('Flow');
  });

  it('should call the method that change tabs to Flow Logic tab.', () => {
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

  it('should call the method that change tabs to Contain tab.', () => {
    const tabsIndex = {
      index: 0,
    } as MatTabChangeEvent;
    const spyTabsChange = spyOn(
      component,
      'tabSelectedChanged'
    ).and.callThrough();
    component.tabSelectedChanged(tabsIndex);
    expect(component.isFlowLogicTab).toBeFalsy();
    expect(spyTabsChange).toHaveBeenCalledWith(tabsIndex);
  });

  it('should call the method that returns flow logic rules when is updated.', () => {
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
              text: 'test',
            },
            operatorType: OperatorType.Before,
            rightOperand: {
              type: OperandType.Date,
              questionType: QuestionFieldType.ShortText,
              value: '5/27/1982',
              text: 'test',
            },
          },
        ],
        subRules: [],
      },
    };
    component.pendingFlowLogicRules = [stationFlowLogic];
    const flowLogicStation = component.pendingFlowLogicRules.findIndex(
      (flowRule) =>
        flowRule.destinationStationRithmID ===
          stationFlowLogic.destinationStationRithmID &&
        flowRule.stationRithmId === stationFlowLogic.stationRithmId
    );
    const spyNewRulesStation = spyOn(
      component,
      'addFlowLogicRule'
    ).and.callThrough();
    component.addFlowLogicRule(stationFlowLogic);
    expect(flowLogicStation).toBeGreaterThanOrEqual(0);
    expect(spyNewRulesStation).toHaveBeenCalledWith(stationFlowLogic);
  });

  it('should call the method that returns new flow logic rules when is added.', () => {
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
              text: 'test',
            },
            operatorType: OperatorType.Before,
            rightOperand: {
              type: OperandType.Date,
              questionType: QuestionFieldType.ShortText,
              value: '5/27/1982',
              text: 'test',
            },
          },
        ],
        subRules: [],
      },
    };
    const flowLogicStation = component.pendingFlowLogicRules.findIndex(
      (flowRule) =>
        flowRule.destinationStationRithmID ===
          stationFlowLogic.destinationStationRithmID &&
        flowRule.stationRithmId === stationFlowLogic.stationRithmId
    );
    const spyNewRulesStation = spyOn(
      component,
      'addFlowLogicRule'
    ).and.callThrough();
    component.addFlowLogicRule(stationFlowLogic);
    expect(flowLogicStation).toBeLessThanOrEqual(-1);
    expect(spyNewRulesStation).toHaveBeenCalledWith(stationFlowLogic);
  });

  it('should call the method that add new rules and flow logic is null', () => {
    const spyNewRulesStation = spyOn(
      component,
      'addFlowLogicRule'
    ).and.callThrough();
    component.addFlowLogicRule(null);
    expect(spyNewRulesStation).toHaveBeenCalledWith(null);
    expect(component.pendingFlowLogicRules.length).toEqual(0);
  });

  it('should saved the flow logic rules in current station', () => {
    component.isFlowLogicTab = true;
    component.childFlowLogic = { ruleLoading: true } as FlowLogicComponent;
    const spySavedFlowLogicRules = spyOn(
      TestBed.inject(DocumentService),
      'saveStationFlowLogic'
    ).and.callThrough();
    component.saveFlowLogicRules();
    expect(spySavedFlowLogicRules).toHaveBeenCalled();
  });

  it('should show error message when saved flow logic rules in current station', () => {
    component.childFlowLogic = { ruleError: true } as FlowLogicComponent;
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

  it('should show layout-mode-button and layoutMode active when you click on it in station edition', () => {
    component.editMode = true;
    component.viewNewStation = true;
    component.layoutMode = false;
    fixture.detectChanges();

    const btnLayout = fixture.debugElement.nativeElement.querySelector(
      '#button-mode-layout'
    );
    expect(btnLayout).toBeTruthy();
    btnLayout.click();
    expect(component.layoutMode).toBeTrue();
  });

  it('should show setting mode when click in button Setting', () => {
    component.viewNewStation = true;
    component.editMode = true;
    fixture.detectChanges();
    const btnSetting = fixture.nativeElement.querySelector(
      '#button-mode-setting'
    );
    expect(btnSetting).toBeTruthy();
    btnSetting.click();
    expect(component.settingMode).toBeTruthy();
    expect(component.layoutMode).toBeFalsy();
  });

  it('should hide the drawer on the left if it is open when you click the Settings button', () => {
    component.viewNewStation = true;
    component.editMode = true;
    component.isOpenDrawerLeft = true;
    fixture.detectChanges();
    const btnSetting = fixture.nativeElement.querySelector(
      '#button-mode-setting'
    );
    expect(btnSetting).toBeTruthy();
    btnSetting.click();
    expect(component.isOpenDrawerLeft).toBeFalsy();
  });

  it('should show layout mode when click in button Layout', () => {
    component.viewNewStation = true;
    component.editMode = true;
    fixture.detectChanges();
    const btnLayout = fixture.nativeElement.querySelector(
      '#button-mode-layout'
    );
    expect(btnLayout).toBeTruthy();
    btnLayout.click();
    expect(component.layoutMode).toBeTruthy();
    expect(component.settingMode).toBeFalsy();
  });

  it('should call the function that changes to layout mode in edit mode', () => {
    const modeConfig = 'layout';
    const displayGrid = 'always';
    component.viewNewStation = true;
    component.editMode = true;
    fixture.detectChanges();

    const spyGridMode = spyOn(component, 'setGridMode').and.callThrough();
    component.setGridMode(modeConfig);
    expect(spyGridMode).toHaveBeenCalledWith(modeConfig);
    expect(component.options.displayGrid).toEqual(<displayGrids>displayGrid);
    expect(component.options.resizable?.enabled).toBeTrue();
    expect(component.options.draggable?.enabled).toBeTrue();
  });

  it('should call the function that changes to setting mode and should hidden drawer-left', () => {
    const modeConfig = 'setting';
    component.viewNewStation = true;
    component.editMode = true;
    component.isOpenDrawerLeft = true;
    fixture.detectChanges();
    const spyGridMode = spyOn(component, 'setGridMode').and.callThrough();
    component.setGridMode(modeConfig);
    expect(spyGridMode).toHaveBeenCalledWith(modeConfig);
    expect(component.isOpenDrawerLeft).toBeFalsy();
  });

  it('should call the function that changes to preview mode and should hidden drawer-left', () => {
    const modeConfig = 'preview';
    component.viewNewStation = true;
    component.editMode = true;
    component.isOpenDrawerLeft = true;
    fixture.detectChanges();
    const spyGridMode = spyOn(component, 'setGridMode').and.callThrough();
    component.setGridMode(modeConfig);
    expect(spyGridMode).toHaveBeenCalledWith(modeConfig);
    expect(component.isOpenDrawerLeft).toBeFalsy();
  });

  it('should call the function that changes to setting mode in edit mode', () => {
    const modeConfig = 'setting';
    const displayGrid = 'none';
    component.viewNewStation = true;
    component.editMode = true;
    fixture.detectChanges();

    const spyGridMode = spyOn(component, 'setGridMode').and.callThrough();
    component.setGridMode(modeConfig);
    expect(spyGridMode).toHaveBeenCalledWith(modeConfig);
    expect(component.options.displayGrid).toEqual(<displayGrids>displayGrid);
    expect(component.options.resizable?.enabled).toBeFalsy();
    expect(component.options.draggable?.enabled).toBeFalsy();
  });

  it('should call the function changedOptions that make changes in grid', () => {
    const spyChangedOptions = spyOn(
      component,
      'changedOptions'
    ).and.callThrough();
    component.changedOptions();
    expect(spyChangedOptions).toHaveBeenCalled();
  });

  it('should change the edit mode and layout config', () => {
    component.viewNewStation = true;
    component.editMode = true;
    fixture.detectChanges();

    const spyEditMode = spyOn(component, 'setEditMode').and.callThrough();
    component.setEditMode();
    expect(spyEditMode).toHaveBeenCalled();
    expect(component.editMode).toBeFalsy();
  });

  it('should open confirmation popup when canceling button', async () => {
    const dataToConfirmPopup = {
      title: 'Cancel?',
      message: '\nUnsaved changes will be lost.',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      important: true,
    };
    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.cancelStationChanges();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataToConfirmPopup);
    expect(component.editMode).toBeFalsy();
  });

  it('should call the function that return data about current station', () => {
    const spyStationInfo = spyOn(
      TestBed.inject(StationService),
      'getStationInfo'
    ).and.callThrough();
    component['getStationInfo'](component.stationRithmId);
    expect(spyStationInfo).toHaveBeenCalled();
  });

  it('should show error message when return data about current station', () => {
    spyOn(TestBed.inject(StationService), 'getStationInfo').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const displayErrorSpy = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component['getStationInfo'](component.stationRithmId);
    expect(displayErrorSpy).toHaveBeenCalled();
  });

  it('should change the edit mode and set grid mode', () => {
    component.viewNewStation = true;
    component.editMode = false;
    fixture.detectChanges();
    const spyGridMode = spyOn(component, 'setGridMode').and.callThrough();
    const spyEditMode = spyOn(component, 'setEditMode').and.callThrough();

    component.setEditMode();
    expect(spyEditMode).toHaveBeenCalled();
    expect(spyGridMode).toHaveBeenCalledWith('layout');
    expect(component.editMode).toBeTrue();
  });

  it('should change setting config after canceling', () => {
    component.viewNewStation = true;
    component.editMode = true;
    fixture.detectChanges();

    const spySaveChange = spyOn(
      component,
      'saveStationChanges'
    ).and.callThrough();
    component.saveStationChanges();
    expect(spySaveChange).toHaveBeenCalled();
    expect(component.editMode).toBeFalsy();
  });

  it('should remove widgets with the trash icon in the editToolbar', () => {
    component.viewNewStation = true;
    component.editMode = true;
    const modeConfig = 'layout';
    component.setGridMode(modeConfig);
    fixture.detectChanges();

    const btnTrashIcon = fixture.debugElement.nativeElement.querySelector(
      '#button-remove-widget'
    );
    expect(btnTrashIcon).toBeTruthy();
    const spyRemove = spyOn(component, 'removeWidgets').and.callThrough();
    btnTrashIcon.click();
    expect(spyRemove).toHaveBeenCalled();
    expect(component.inputFrameWidgetItems.length).toBeLessThanOrEqual(0);
  });

  it('should open drawer left when click in button toggle-left-drawer  ', () => {
    component.viewNewStation = true;
    component.editMode = true;
    component.isOpenDrawerLeft = false;
    fixture.detectChanges();
    const btnToggleLeftDrawer =
      fixture.debugElement.nativeElement.querySelector(
        '#button-toggle-left-drawer'
      );
    expect(btnToggleLeftDrawer).toBeTruthy();
    const spyToggleLeftDrawer = spyOn(
      component,
      'toggleLeftDrawer'
    ).and.callThrough();
    btnToggleLeftDrawer.click();
    expect(spyToggleLeftDrawer).toHaveBeenCalled();
    expect(component.isOpenDrawerLeft).toBeTruthy();
  });

  it('should call the function that switches setGridMode  in the toggleDrawer function if is modeSetting is true', () => {
    component.settingMode = true;
    const spyGridMode = spyOn(component, 'setGridMode').and.callThrough();
    const spyToggleLeftDrawer = spyOn(
      component,
      'toggleLeftDrawer'
    ).and.callThrough();
    component.toggleLeftDrawer();
    component.setGridMode('layout');
    expect(spyToggleLeftDrawer).toHaveBeenCalled();
    expect(spyGridMode).toHaveBeenCalledWith('layout');
  });

  it('should add a new input frame widget to the array of input frames', () => {
    expect(component.inputFrameWidgetItems).toHaveSize(0);
    component.addInputFrame();
    expect(component.inputFrameWidgetItems).toHaveSize(1);
  });

  it('should add more than one input frame with different id', () => {
    expect(component.inputFrameWidgetItems).toHaveSize(0);

    component.addInputFrame();
    expect(component.inputFrameWidgetItems.length).toBe(1);

    component.addInputFrame();
    expect(component.inputFrameWidgetItems.length).toBe(2);

    expect(component.inputFrameWidgetItems[0].id).not.toEqual(
      component.inputFrameWidgetItems[1].id
    );
  });
});
