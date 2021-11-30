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
import { MockUserService } from 'src/mocks/mock-user-service';
import { UserService } from 'src/app/core/user.service';
import { PopupService } from '../../core/popup.service';
import { MockPopupService } from '../../../mocks/mock-popup-service';
import { SidenavDrawerService } from '../../core/sidenav-drawer.service';
import { Router } from '@angular/router';

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
        { provide: UserService, useClass: MockUserService },
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

  it('should validate the form controls initial value', () => {
    const form = component.stationForm.controls;

    const expectFormFirst = ['stationTemplateForm'];

    expect(Object.keys(form)).toEqual(expectFormFirst);
    expect(form['stationTemplateForm'].value).toBe('');
  });

  it('should get previous and following stations', () => {
    component.stationRithmId = component.stationInformation.rithmId;
    const prevAndFollowStations = spyOn(TestBed.inject(StationService), 'getPreviousAndFollowingStations').and.callThrough();
    component.getPreviousAndFollowingStations();
    expect(prevAndFollowStations).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should call methods in the init life cycle', () => {
    const spySideNav = spyOn(TestBed.inject(SidenavDrawerService), 'setDrawer');
    const spyGetParams = spyOn(TestBed.inject(Router), 'navigateByUrl');
    const spyMethodPrevAndFollowStation = spyOn(component, 'getPreviousAndFollowingStations');

    component.ngOnInit();

    expect(spySideNav).toHaveBeenCalled();
    expect(spyGetParams).toHaveBeenCalledOnceWith('dashboard');
    expect(spyMethodPrevAndFollowStation).toHaveBeenCalled();
  });
});
