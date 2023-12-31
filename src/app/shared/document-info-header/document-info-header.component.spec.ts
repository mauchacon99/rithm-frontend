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
import {
  DocumentName,
  DocumentStationInformation,
  StationRosterMember,
} from 'src/models';
import { UserService } from 'src/app/core/user.service';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError, of } from 'rxjs';

describe('DocumentInfoHeaderComponent', () => {
  let component: DocumentInfoHeaderComponent;
  let fixture: ComponentFixture<DocumentInfoHeaderComponent>;
  const formBuilder = new FormBuilder();
  let formGroup: FormGroup;
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
      declarations: [DocumentInfoHeaderComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatChipsModule,
        UserAvatarModule,
        RouterTestingModule,
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
      currentAssignedUser: user,
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
      workers: [
        {
          rithmId: '123',
          firstName: 'Testy',
          lastName: 'Test',
          email: 'test@test.com',
        },
      ],
      questions: [],
      instructions: 'General instructions',
      isChained: false,
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

  it('should splice one item from appended fields array in and update document name template', () => {
    const currentIndex = 0;
    const expectRemoveStartIndex = currentIndex;
    const spyProperty = spyOn(
      component.documentAppendedFields,
      'splice'
    ).and.callThrough();
    const spyService = spyOn(
      TestBed.inject(StationService),
      'updateDocumentStationNameFields'
    ).and.callThrough();

    component.removeAppendedFieldFromDocumentName(currentIndex);
    expect(spyProperty).toHaveBeenCalledWith(expectRemoveStartIndex, 2);
    expect(spyService).toHaveBeenCalledWith(component.documentAppendedFields);
  });

  it('should splice two item from appended fields array in and update document name template', () => {
    const currentIndex = 1;
    const expectRemoveStartIndex = currentIndex - 1;
    const spyProperty = spyOn(
      component.documentAppendedFields,
      'splice'
    ).and.callThrough();
    const spyService = spyOn(
      TestBed.inject(StationService),
      'updateDocumentStationNameFields'
    ).and.callThrough();

    component.removeAppendedFieldFromDocumentName(currentIndex);
    expect(spyProperty).toHaveBeenCalledWith(expectRemoveStartIndex, 2);
    expect(spyService).toHaveBeenCalledWith(component.documentAppendedFields);
  });

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

  it('should apply trim when update the name in document info drawer', () => {
    formGroup.controls['name'].setValue('          ');
    component.appendedDocumentName = 'Appended Name';
    component.updateDocumentNameBS();

    expect(formGroup.controls['name'].value).toEqual('');
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

  it('should show document the current assigned worker and button to go to document in full screen mode', () => {
    component.isWidget = true;
    fixture.detectChanges();
    const section = fixture.debugElement.nativeElement.querySelector(
      '#section-current-worker'
    );
    expect(section).toBeTruthy();
  });

  it('should redirect to document page', () => {
    component.isWidget = true;
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector(
      '#return-document-button'
    );
    expect(button).toBeTruthy();

    const navigateSpy = spyOn(component, 'goToDocument');
    button.click();
    expect(navigateSpy).toHaveBeenCalledWith();
  });

  it('should show assign-user-loading when assign user is in process', () => {
    component.assignUserToDocument();
    fixture.detectChanges();
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#assign-user-loading'
    );
    expect(loadingComponent).toBeNull();
  });
  it('should assign user to document', () => {
    component.isWidget = true;

    spyOnProperty(component, 'currentAssignedUserDocument').and.returnValue({
      rithmId: '',
      firstName: '',
      lastName: ' ',
      email: '',
      isWorker: true,
      isOwner: false,
    });
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector(
      '#start-document-button'
    );

    expect(button).toBeTruthy();
    const assignUserDocument = spyOn(component, 'assignUserToDocument');
    button.click();
    expect(assignUserDocument).toHaveBeenCalledOnceWith();
  });

  it('should executed method for assigned user in document', () => {
    component.isWidget = true;
    const userService: UserService = TestBed.inject(UserService);
    const spyMethod = spyOn(
      TestBed.inject(DocumentService),
      'assignUserToDocument'
    ).and.returnValue(of(true));
    const spyGetAssignedUser = spyOn(
      TestBed.inject(DocumentService),
      'getAssignedUserToDocument'
    ).and.callThrough();
    const spyEmit = spyOn(component.isReloadListDocuments, 'emit');
    component.assignUserToDocument();
    expect(spyMethod).toHaveBeenCalledOnceWith(
      userService.user.rithmId,
      component.stationRithmId,
      component.documentRithmId
    );
    expect(spyGetAssignedUser).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledOnceWith(true);
  });

  it('should catch error in petition to assign to user in document', () => {
    const userService: UserService = TestBed.inject(UserService);
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    const spyMethod = spyOn(
      TestBed.inject(DocumentService),
      'assignUserToDocument'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.assignUserToDocument();
    expect(spyMethod).toHaveBeenCalledOnceWith(
      userService.user.rithmId,
      component.stationRithmId,
      component.documentRithmId
    );
    expect(spyError).toHaveBeenCalled();
  });

  it('should show error under start document button', () => {
    component.isWidget = true;
    spyOnProperty(component, 'currentAssignedUserDocument').and.returnValue({
      rithmId: '',
      firstName: '',
      lastName: ' ',
      email: '',
      isWorker: true,
      isOwner: false,
    });
    spyOn(
      TestBed.inject(DocumentService),
      'assignUserToDocument'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.assignUserToDocument();
    fixture.detectChanges();
    const errorMessage =
      fixture.debugElement.nativeElement.querySelector('#assign-user-error');
    expect(component.displayAssignUserError).toBeTrue();
    expect(errorMessage).toBeTruthy();
  });

  it('should call method for render assigned User to document', () => {
    const getAssignedUserSpy = spyOn(
      TestBed.inject(DocumentService),
      'getAssignedUserToDocument'
    ).and.callThrough();
    component['getAssignedUserToDocument']();

    expect(getAssignedUserSpy).toHaveBeenCalledOnceWith(
      (component.documentInformation as DocumentStationInformation)
        .documentRithmId,
      (component.documentInformation as DocumentStationInformation)
        .stationRithmId,
      true
    );
  });

  it('should catch error in the service get user assigned', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getAssignedUserToDocument'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component['getAssignedUserToDocument']();
    expect(spyError).toHaveBeenCalled();
  });

  it('should return true if user is admin', () => {
    spyOnProperty(TestBed.inject(UserService), 'isAdmin').and.returnValue(true);
    const expectValue = component.isAdminOrWorkerOrOwner();
    expect(expectValue).toBeTrue();
  });

  it('should return true if user is not admin and id not assigned in array stationOwners but yes in workers', () => {
    component.documentInformation.stationOwners = [];
    component.documentInformation.workers = [
      {
        rithmId: '123',
        firstName: 'Dev',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
      },
    ];
    spyOnProperty(TestBed.inject(UserService), 'isAdmin').and.returnValue(
      false
    );
    const expectValue = component.isAdminOrWorkerOrOwner();
    expect(expectValue).toBeTrue();
  });

  it('should return true if user is not admin and id not assigned in array stationOwners and empty array workers', () => {
    component.documentInformation.stationOwners = [];
    component.documentInformation.workers = [];
    spyOnProperty(TestBed.inject(UserService), 'isAdmin').and.returnValue(
      false
    );
    const expectValue = component.isAdminOrWorkerOrOwner();
    expect(expectValue).toBeFalse();
  });

  it('should button disable if user not admin and not worker and not owner', () => {
    component.isWidget = true;
    component.documentInformation.stationOwners = [];
    component.documentInformation.workers = [];
    spyOnProperty(TestBed.inject(UserService), 'isAdmin').and.returnValue(
      false
    );
    const expectValue = component.isAdminOrWorkerOrOwner();
    spyOnProperty(component, 'currentAssignedUserDocument').and.returnValue({
      rithmId: '',
      firstName: '',
      lastName: ' ',
      email: '',
      isWorker: true,
      isOwner: false,
    });
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector(
      '#start-document-button'
    );
    expect(expectValue).toBeFalse();
    expect(button).toBeTruthy();
    expect(button.disabled).toBeTrue();
  });

  it('should button not disabled if user is admin', () => {
    component.isWidget = true;
    spyOnProperty(TestBed.inject(UserService), 'isAdmin').and.returnValue(true);
    const expectValue = component.isAdminOrWorkerOrOwner();
    spyOnProperty(component, 'currentAssignedUserDocument').and.returnValue({
      rithmId: '',
      firstName: '',
      lastName: ' ',
      email: '',
      isWorker: true,
      isOwner: false,
    });
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector(
      '#start-document-button'
    );
    expect(expectValue).toBeTrue();
    expect(button).toBeTruthy();
    expect(button.disabled).toBeFalse();
  });

  it('should validate if user logged is in workers', () => {
    expect(component.isUserInWorkers).toBeTrue();
    component.documentInformation.workers = [
      {
        rithmId: '372',
        firstName: 'Dev',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
      },
    ];
    fixture.detectChanges();
    expect(component.isUserInWorkers).toBeFalse();
  });
});
