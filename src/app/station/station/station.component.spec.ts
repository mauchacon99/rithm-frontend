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
import { QuestionFieldType, DocumentNameField } from 'src/models';
import { MatExpansionModule } from '@angular/material/expansion';
import { DocumentService } from 'src/app/core/document.service';

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
        { provide: DocumentInfoHeaderComponent, useClass: DocumentInfoHeaderComponent }
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
