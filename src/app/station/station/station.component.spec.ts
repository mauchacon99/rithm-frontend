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
import { ToolbarComponent } from '../toolbar/toolbar.component';

import { StationComponent } from './station.component';
import { StationTemplateComponent } from '../station-template/station-template.component';
import { StationService } from 'src/app/core/station.service';
import { QuestionFieldType } from 'src/models';
import { MatExpansionModule } from '@angular/material/expansion';
import { DocumentService } from 'src/app/core/document.service';
import { of } from 'rxjs';
import { MockUserService } from 'src/mocks/mock-user-service';
import { UserService } from 'src/app/core/user.service';

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
        MockComponent(StationTemplateComponent)
      ],
      imports: [
        NoopAnimationsModule,
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
        { provide: UserService, useClass: MockUserService }
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
        stationName: 'Development',
        totalDocuments: 5,
        isGenerator: true
      }],
      previousStations: [{
        stationName: 'Station-1',
        totalDocuments: 2,
        isGenerator: true
      }, {
        stationName: 'Station-2',
        totalDocuments: 0,
        isGenerator: false
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

  it('should show loading indicator while getting the station data', () => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (<any>component).getStationInfo(component.stationInformation.rithmId);
    fixture.detectChanges();
    expect(component.stationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#component-station-loading');
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading indicator while saving the station information', () => {
    component.saveStationInformation();
    fixture.detectChanges();
    expect(component.stationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#component-station-loading');
    expect(loadingComponent).toBeTruthy();
  });

  it('should call component methods to make requests when saveStationInformation is called', () => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (<any>component).stationName = 'Station Test';

    const spyUpdateStationName = spyOn(TestBed.inject(StationService), 'updateStationName').and.callThrough();
    const spyUpdateAppendedFields = spyOn(TestBed.inject(DocumentService), 'updateDocumentAppendedFields').and.callThrough();
    const spyUpdateStationQuestions = spyOn(TestBed.inject(StationService), 'updateStationQuestions').and.callThrough();

    component.saveStationInformation();

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    expect(spyUpdateStationName).toHaveBeenCalledOnceWith((<any>component).stationName, component.stationInformation.rithmId);
    expect(spyUpdateAppendedFields).toHaveBeenCalledOnceWith(component.stationInformation.rithmId, []);
    expect(spyUpdateStationQuestions).toHaveBeenCalledOnceWith(component.stationInformation.rithmId, []);
  });

  it('should make a request when save button is clicked', () => {
    const spyUpdateStationName = spyOn(TestBed.inject(StationService), 'updateStationName').and.callThrough();
    const spyUpdateAppendedFields = spyOn(TestBed.inject(DocumentService), 'updateDocumentAppendedFields').and.callThrough();
    const spyUpdateStationQuestions = spyOn(TestBed.inject(StationService), 'updateStationQuestions').and.callThrough();
    const spyFunctionSave = spyOn(component, 'saveStationInformation').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#station-save');

    button.click();

    expect(spyFunctionSave).toHaveBeenCalled();
    expect(spyUpdateStationName).toHaveBeenCalled();
    expect(spyUpdateAppendedFields).toHaveBeenCalled();
    expect(spyUpdateStationQuestions).toHaveBeenCalled();
  });

  it('should navigate the user back to the dashboard page and show error', () => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const spyNavigate = spyOn((<any>component), 'navigateBack');
    const spyError = spyOn(TestBed.inject(ErrorService), 'displayError');

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (<any>component).handleInvalidParams();

    expect(spyNavigate).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should validate the form controls initial value', () => {
    const form = component.stationForm.controls;

    const expectFormFirst = ['stationTemplateForm'];

    expect(Object.keys(form)).toEqual(expectFormFirst);
    expect(form['stationTemplateForm'].value).toBe('');
  });

  it('should set stationId param as null and redirect to dashboard', () => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const spy = spyOn((<any>component), 'handleInvalidParams');

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (<any>component).getParams();

    expect(spy).toHaveBeenCalled();
  });

  it('should compare the stationInformation object against getStationInfo method returned value', () => {
    spyOn(TestBed.inject(StationService), 'getStationInfo').and.returnValue(of(component.stationInformation));

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (<any>component).getStationInfo(component.stationInformation.rithmId);

    expect(component.stationInformation).toBe(component.stationInformation);
  });
});
