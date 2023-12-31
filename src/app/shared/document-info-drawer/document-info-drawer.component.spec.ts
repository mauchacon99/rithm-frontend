import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockErrorService,
  MockStationService,
  MockUserService,
  MockDocumentService,
  MockPopupService,
  MockOrganizationService,
} from 'src/mocks';
import { DocumentInfoDrawerComponent } from './document-info-drawer.component';
import { StationService } from 'src/app/core/station.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from 'src/app/core/user.service';
import { DocumentService } from 'src/app/core/document.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DialogOptions } from 'src/models';
import { PopupService } from 'src/app/core/popup.service';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConnectedStationsModalComponent } from 'src/app/document/connected-stations-modal/connected-stations-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { LocationModalComponent } from 'src/app/document/folder/location-modal/location-modal.component';
import { UserListModalComponent } from 'src/app/document/user-list-modal/user-list-modal.component';
import { OrganizationService } from 'src/app/core/organization.service';
import { MatRadioModule } from '@angular/material/radio';

describe('DocumentInfoDrawerComponent', () => {
  let component: DocumentInfoDrawerComponent;
  let fixture: ComponentFixture<DocumentInfoDrawerComponent>;
  let sideNavService: SidenavDrawerService;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
  const documentId = 'E204F369-386F-4E41';
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentInfoDrawerComponent,
        UserListModalComponent,
        ConnectedStationsModalComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: FormGroup, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: OrganizationService, useClass: MockOrganizationService },
      ],
      imports: [
        MatCheckboxModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        MatSelectModule,
        FormsModule,
        RouterTestingModule,
        MatDialogModule,
        MatTabsModule,
        MatRadioModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoDrawerComponent);
    component = fixture.componentInstance;
    sideNavService = TestBed.inject(SidenavDrawerService);
    component.documentRithmId = documentId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the editable status of the document in the station', async () => {
    const newStatus = true;
    component.stationRithmId = stationId;
    const updateGenerationStatusSpy = spyOn(
      TestBed.inject(StationService),
      'updateStatusDocumentEditable'
    ).and.callThrough();

    await component.updateStatusDocumentEditable(newStatus);

    expect(updateGenerationStatusSpy).toHaveBeenCalledOnceWith(
      stationId,
      newStatus
    );
  });

  it('should get the current editable status of the document', async () => {
    component.stationRithmId = stationId;
    const getGenerationStatusSpy = spyOn(
      TestBed.inject(StationService),
      'getStatusDocumentEditable'
    ).and.callThrough();
    await component.getStatusDocumentEditable();

    expect(getGenerationStatusSpy).toHaveBeenCalledOnceWith(stationId);
  });

  it('should get document last updated date', () => {
    const getLastUpdatedSpy = spyOn(
      TestBed.inject(DocumentService),
      'getLastUpdated'
    ).and.callThrough();

    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
    });

    expect(getLastUpdatedSpy).toHaveBeenCalledOnceWith(documentId);
  });

  it('should get held time in station for document', () => {
    const getDocumentTimeInStationSpy = spyOn(
      TestBed.inject(DocumentService),
      'getDocumentTimeInStation'
    ).and.callThrough();

    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
      stationRithmId: stationId,
    });

    expect(getDocumentTimeInStationSpy).toHaveBeenCalledOnceWith(
      documentId,
      stationId
    );
  });

  it('should return the user assigned to the document', () => {
    const getAssignedUserSpy = spyOn(
      TestBed.inject(DocumentService),
      'getAssignedUserToDocument'
    ).and.callThrough();
    component.stationRithmId = stationId;
    component['getAssignedUserToDocument']();

    expect(getAssignedUserSpy).toHaveBeenCalledOnceWith(
      documentId,
      stationId,
      true
    );
  });

  it('should show loading-last-update while get data last updated', () => {
    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
    });
    fixture.detectChanges();
    expect(component.lastUpdatedLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#loading-last-update'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should delete a document', async () => {
    const deleteDocumentSpy = spyOn(
      TestBed.inject(DocumentService),
      'deleteDocument'
    ).and.callThrough();
    spyOn(TestBed.inject(SidenavDrawerService), 'closeDrawer');
    await component.deleteDocument();

    expect(deleteDocumentSpy).toHaveBeenCalledOnceWith(documentId);
  });

  it('should open a confirm dialog to delete the document', async () => {
    const dialogExpectData: DialogOptions = {
      title: 'Are you sure?',
      message: 'The document will be deleted.',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    };
    const popupSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    spyOn(TestBed.inject(SidenavDrawerService), 'closeDrawer');
    await component.deleteDocument();

    expect(popupSpy).toHaveBeenCalledOnceWith(dialogExpectData);
  });

  it('should call the confirm dialog when clicking the delete button of document', fakeAsync(() => {
    component.isUserAdminOrOwner = true;
    fixture.detectChanges();
    const deleteDocumentSpy = spyOn(component, 'deleteDocument');
    const buttonDelete =
      fixture.debugElement.nativeElement.querySelector('button.priority');
    expect(buttonDelete).toBeTruthy();
    buttonDelete.click();
    tick();
    expect(deleteDocumentSpy).toHaveBeenCalledOnceWith();
  }));

  it('should show loading-indicators while get held time in station', () => {
    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
      stationRithmId: stationId,
    });
    fixture.detectChanges();
    expect(component.timeInStationLoading).toBeTrue();
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#loading-time-in-station'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should show assigned-user-loading while get assigned user of document', () => {
    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
      stationRithmId: stationId,
    });
    fixture.detectChanges();
    expect(component.assignedUserLoading).toBeTrue();
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#assigned-user-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should call the service to unassign a user to document', () => {
    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
      stationRithmId: stationId,
    });
    const unassignSpy = spyOn(
      TestBed.inject(DocumentService),
      'unassignUserToDocument'
    ).and.callThrough();
    component['unassignUserToDocument']();
    expect(unassignSpy).toHaveBeenCalledOnceWith(
      component.documentRithmId,
      component.stationRithmId
    );
  });

  it('should show error message when request for assigned user fails', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getAssignedUserToDocument'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
      stationRithmId: stationId,
    });
    fixture.detectChanges();
    expect(component.userErrorAssigned).toBeTrue();
    const errorComponent = fixture.debugElement.nativeElement.querySelector(
      '#assigned-user-error'
    );
    expect(errorComponent).toBeTruthy();
  });

  it('should show popup dialog to unassigned user', async () => {
    const dialogExpectData: DialogOptions = {
      title: 'Unassign User',
      message: 'This action cannot be undone',
      okButtonText: 'Unassign',
      cancelButtonText: 'Cancel',
      important: true,
    };
    const popupSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.unassignUser();
    expect(popupSpy).toHaveBeenCalledOnceWith(dialogExpectData);
  });

  it('should catch error to document service', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'unassignUserToDocument'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
      stationRithmId: stationId,
    });
    component['unassignUserToDocument']();
    expect(spyError).toHaveBeenCalled();
  });

  it('should show error message when request for unassigned user fails', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'unassignUserToDocument'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
      stationRithmId: stationId,
    });
    component['unassignUserToDocument']();
    fixture.detectChanges();
    expect(component.userErrorUnassigned).toBeTrue();
    const errorComponent = fixture.debugElement.nativeElement.querySelector(
      '#unassigned-user-error'
    );
    expect(errorComponent).toBeTruthy();
  });

  it('should to call method openModalMoveDocument after clicked in button', () => {
    component.isStation = false;
    component.isUserAdminOrOwner = true;
    fixture.detectChanges();
    const openModalMoveDocumentSpy = spyOn(
      component,
      'openModalMoveDocument'
    ).and.callThrough();
    spyOn(TestBed.inject(SidenavDrawerService), 'closeDrawer');
    const btnMoveDocument = fixture.nativeElement.querySelector(
      '#move-document-modal'
    );
    expect(btnMoveDocument).toBeTruthy();
    btnMoveDocument.click();
    expect(openModalMoveDocumentSpy).toHaveBeenCalled();
  });

  it('should to call the modal to move the document', () => {
    component.documentRithmId = documentId;
    component.stationRithmId = stationId;
    component.documentAssignedUser = [];

    const expectDataModal = {
      data: {
        documentRithmId: documentId,
        stationRithmId: stationId,
        assignedUser: component.documentAssignedUser.length,
      },
    };
    const dialogSpy = spyOn(
      TestBed.inject(MatDialog),
      'open'
    ).and.callThrough();
    spyOn(TestBed.inject(SidenavDrawerService), 'closeDrawer');

    component.openModalMoveDocument();
    expect(dialogSpy).toHaveBeenCalledOnceWith(
      ConnectedStationsModalComponent,
      expectDataModal
    );
  });

  it('should to call the modal the location', () => {
    component.stationRithmId = stationId;
    const expectDataModal = {
      minWidth: '550px',
      minHeight: '450px',
      data: {
        stationRithmId: stationId,
        documentRithmId: documentId,
      },
    };
    const dialogSpy = spyOn(
      TestBed.inject(MatDialog),
      'open'
    ).and.callThrough();
    component.openModalLocation();
    expect(dialogSpy).toHaveBeenCalledOnceWith(
      LocationModalComponent,
      expectDataModal
    );
  });

  it('should to call method openModalLocation after clicked in arrow location section', () => {
    component.isStation = false;
    component.isUserAdminOrOwner = true;
    fixture.detectChanges();
    const openModalLocationSpy = spyOn(
      component,
      'openModalLocation'
    ).and.callThrough();
    const ArrowLocationSection = fixture.nativeElement.querySelector(
      '#open-modal-Location'
    );
    expect(ArrowLocationSection).toBeTruthy();
    ArrowLocationSection.click();
    expect(openModalLocationSpy).toHaveBeenCalled();
  });

  it('should call the service to get the current Stations', () => {
    component.stationRithmId = stationId;
    const spyMethod = spyOn(
      TestBed.inject(DocumentService),
      'getCurrentStations'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalledOnceWith(component.documentRithmId);
  });

  it('should call the errorService if the request getCurrentStations fails', () => {
    component.stationRithmId = stationId;
    const currentStationsEventSpy = spyOn(
      TestBed.inject(DocumentService),
      'getCurrentStations'
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
    expect(currentStationsEventSpy).toHaveBeenCalledWith(
      component.documentRithmId
    );
    expect(spyError).toHaveBeenCalled();
  });

  it('should to call method openModalUserListModal after clicked in on the assignUserSection', () => {
    component.isStation = false;
    component.documentAssignedUser = [];
    fixture.detectChanges();
    const openUserListModalSpy = spyOn(component, 'openUserListModal');
    const assignUserSection = fixture.debugElement.nativeElement.querySelector(
      '#open-modal-user-list'
    ) as HTMLButtonElement;
    expect(assignUserSection).toBeTruthy();
    assignUserSection.click();
    expect(openUserListModalSpy).toHaveBeenCalled();
  });

  it('should to call the modal the user list', () => {
    component.stationRithmId = stationId;
    fixture.detectChanges();
    const expectDataModal = {
      minWidth: '550px',
      minHeight: '450px',
      data: stationId,
    };
    const dialogSpy = spyOn(
      TestBed.inject(MatDialog),
      'open'
    ).and.callThrough();
    component.openUserListModal();
    expect(dialogSpy).toHaveBeenCalledOnceWith(
      UserListModalComponent,
      expectDataModal
    );
  });
});
