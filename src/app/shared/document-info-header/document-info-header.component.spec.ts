import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentInfoHeaderComponent } from './document-info-header.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MatChipsModule } from '@angular/material/chips';
import { StationService } from 'src/app/core/station.service';
import {
  MockErrorService,
  MockStationService,
  MockDocumentService,
  MockUserService,
} from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentService } from 'src/app/core/document.service';
import { DocumentName, DocumentNameField } from 'src/models';
import { UserService } from 'src/app/core/user.service';

describe('DocumentInfoHeaderComponent', () => {
  let component: DocumentInfoHeaderComponent;
  let fixture: ComponentFixture<DocumentInfoHeaderComponent>;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentInfoHeaderComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatChipsModule,
      ],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: UserService, useClass: MockUserService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: FormBuilder, useValue: formBuilder },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoHeaderComponent);
    component = fixture.componentInstance;
    component.documentInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      documentRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C-23211',
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
          email: 'workeruser@inpivota.com',
        },
      ],
      workers: [],
      questions: [],
      instructions: 'General instructions',
    };
    formGroup = component.documentNameForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display/hide the document info drawer in station', () => {
    const drawerItem = 'documentInfo';
    const isStation = false;
    const stationRithmId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    const documentRithmId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C-23211';
    const expectedData = {
      stationRithmId: stationRithmId,
      isStation: isStation,
      isUserAdminOrOwner: true,
      documentRithmId: documentRithmId,
    };
    const toggleDrawerSpy = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );
    component.toggleDrawer(drawerItem);
    expect(toggleDrawerSpy).toHaveBeenCalledOnceWith(drawerItem, expectedData);
  });

  it('should get the appended fields in the document name', () => {
    const stationId = '1234-1234-123';
    const getDataFieldsDocument = spyOn(
      TestBed.inject(StationService),
      'getDocumentNameTemplate'
    ).and.callThrough();

    component.getAppendedFieldsOnDocumentName(stationId);

    expect(getDataFieldsDocument).toHaveBeenCalledOnceWith(stationId);
  });

  it(
    'should splice one item from appended fields array in and update document name template'
  ),
    () => {
      const currentIndex = 0;
      const appendedFields: DocumentNameField[] = [
        {
          prompt: 'Address',
          questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
        },
        {
          prompt: '/',
          questionRithmId: '',
        },
        {
          prompt: 'Which is best?',
          questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
        },
      ];

      const documentNameTemplateSpy = spyOn(
        TestBed.inject(StationService),
        'updateDocumentStationNameFields'
      ).and.callThrough();
      component.removeAppendedFieldFromDocumentName(currentIndex);
      expect(documentNameTemplateSpy).toHaveBeenCalledWith(
        appendedFields.splice(currentIndex, 2)
      );
    };

  it(
    'should splice two item from appended fields array in and update document name template'
  ),
    () => {
      const currentIndex = 1;
      const appendedFields: DocumentNameField[] = [
        {
          prompt: 'Address',
          questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
        },
        {
          prompt: '/',
          questionRithmId: '',
        },
        {
          prompt: 'Which is best?',
          questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
        },
      ];

      const documentNameTemplateSpy = spyOn(
        TestBed.inject(StationService),
        'updateDocumentStationNameFields'
      ).and.callThrough();
      component.removeAppendedFieldFromDocumentName(currentIndex);
      expect(documentNameTemplateSpy).toHaveBeenCalledWith(
        appendedFields.splice(currentIndex - 1, 2)
      );
    };

  it('should return the station document name editable status', () => {
    const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    const editableName = spyOn(
      TestBed.inject(StationService),
      'getStatusDocumentEditable'
    ).and.callThrough();
    component.ngOnInit();
    expect(editableName).toHaveBeenCalledOnceWith(stationId);
  });

  it('should test method get userLoginIsOwner and return boolean', () => {
    const valueExpected = component.isUserAdminOrOwner;
    expect(valueExpected).toBe(true);
  });

  it('should update the name in document info drawer', () => {
    formGroup.controls['name'].setValue('Document Name');
    component.appendedDocumentName = 'Appended Name';

    const updateDocumentNameSpy = spyOn(
      TestBed.inject(DocumentService),
      'updateDocumentNameBS'
    );
    component.updateDocumentNameBS();
    const documentName: DocumentName = {
      baseName: formGroup.controls['name'].value,
      appendedName: component.appendedDocumentName,
    };
    expect(updateDocumentNameSpy).toHaveBeenCalledOnceWith(documentName);
  });

  it('should disable info-drawer-button once the info-drawer is opened', () => {
    spyOnProperty(
      TestBed.inject(SidenavDrawerService),
      'isDrawerOpen'
    ).and.returnValue(true);
    component.isDocumentNameEditable = true;
    fixture.detectChanges();
    expect(component.isDrawerOpen).toBeTrue();
    const infoButton = fixture.debugElement.nativeElement.querySelector(
      '#info-drawer-button-document'
    );
    expect(infoButton.disabled).toBeTruthy();
  });

  it('should enable info-drawer-button once the info-drawer is closed', () => {
    spyOnProperty(
      TestBed.inject(SidenavDrawerService),
      'isDrawerOpen'
    ).and.returnValue(false);
    component.isDocumentNameEditable = true;
    fixture.detectChanges();
    expect(component.isDrawerOpen).toBeFalse();
    const infoButton = fixture.debugElement.nativeElement.querySelector(
      '#info-drawer-button-document'
    );
    expect(infoButton.disabled).toBeFalsy();
  });

  it('should call and return document id if show document component', () => {
    const spyDocument = spyOnProperty(
      component,
      'documentRithmId'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyDocument).toHaveBeenCalled();
  });
});
