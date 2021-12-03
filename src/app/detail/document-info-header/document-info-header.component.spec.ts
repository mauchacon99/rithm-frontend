import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentInfoHeaderComponent } from './document-info-header.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MatChipsModule } from '@angular/material/chips';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService, MockDocumentService, MockUserService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentService } from 'src/app/core/document.service';
import { DocumentNameField } from 'src/models';
import { UserService } from 'src/app/core/user.service';

describe('DocumentInfoHeaderComponent', () => {
  let component: DocumentInfoHeaderComponent;
  let fixture: ComponentFixture<DocumentInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentInfoHeaderComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatChipsModule
      ],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoHeaderComponent);
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
      stationOwners: [
        {
          rithmId: '123',
          firstName: 'Dev',
          lastName: 'User',
          email: 'workeruser@inpivota.com'
        },
      ],
      workers: [],
      questions: [],
      instructions: 'General instructions'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display/hide the document info drawer in station', () => {
    const drawerItem = 'documentInfo';
    const isStation = false;
    const rithmId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    const expectedData = {
      rithmId: rithmId,
      isStation: isStation,
      userLoginIsOwner: true
    };
    const toggleDrawerSpy = spyOn(TestBed.inject(SidenavDrawerService), 'toggleDrawer');
    component.toggleDrawer(drawerItem);
    expect(toggleDrawerSpy).toHaveBeenCalledOnceWith(drawerItem, expectedData);
  });

  it('should get the appended fields in the document name', () => {
    const stationId = '1234-1234-123';
    const getDataFieldsDocument = spyOn(TestBed.inject(DocumentService), 'getAppendedFieldsOnDocumentName').and.callThrough();

    component.getAppendedFieldsOnDocumentName(stationId);

    expect(getDataFieldsDocument).toHaveBeenCalledOnceWith(stationId);
  });

  it('should splice one item from appended fields array in and update document name template'), () => {
    const currentIndex = 0;
    const appendedFields: DocumentNameField[] = [
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

    const documentNameTemplateSpy = spyOn(TestBed.inject(StationService), 'updateDocumentStationNameFields').and.callThrough();
    component.removeAppendedFieldFromDocumentName(currentIndex);
    expect(documentNameTemplateSpy).toHaveBeenCalledWith(appendedFields.splice(currentIndex, 2));
  };

  it('should splice two item from appended fields array in and update document name template'), () => {
    const currentIndex = 1;
    const appendedFields: DocumentNameField[] = [
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

    const documentNameTemplateSpy = spyOn(TestBed.inject(StationService), 'updateDocumentStationNameFields').and.callThrough();
    component.removeAppendedFieldFromDocumentName(currentIndex);
    expect(documentNameTemplateSpy).toHaveBeenCalledWith(appendedFields.splice(currentIndex - 1, 2));
  };

  it('should test method get userLoginIsOwner and return boolean', () => {
    const valueExpected = component.userLoginIsOwner;
    expect(valueExpected).toBe(true);
  });
});
