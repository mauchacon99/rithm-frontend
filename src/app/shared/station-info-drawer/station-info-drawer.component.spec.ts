import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { StationInfoDrawerComponent } from './station-info-drawer.component';
import { StationService } from 'src/app/core/station.service';
import {
  MockErrorService,
  MockMapService,
  MockPopupService,
  MockStationService,
  MockUserService,
  MockDocumentService,
} from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/core/user.service';
import { MockComponent } from 'ng-mocks';
import { RosterComponent } from 'src/app/shared/roster/roster.component';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { PopupService } from 'src/app/core/popup.service';
import { DialogOptions, DocumentGenerationStatus } from 'src/models';
import { MapService } from 'src/app/map/map.service';
import { DocumentService } from 'src/app/core/document.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DocumentComponent } from 'src/app/document/document/document.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;
  let stationInject: StationService;
  const formBuilder = new FormBuilder();
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoDrawerComponent,
        MockComponent(RosterComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatButtonModule,
        MatRadioModule,
        RouterTestingModule.withRoutes([
          { path: 'document', component: MockComponent(DocumentComponent) },
          { path: 'document/:id', component: MockComponent(DocumentComponent) },
        ]),
        MatTabsModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDialogModule,
        FormsModule,
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: MapService, useClass: MockMapService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoDrawerComponent);
    component = fixture.componentInstance;
    component.selectedTabIndex = 0;
    component.stationInformation = {
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      name: 'Dry Goods & Liquids',
      instructions: '',
      nextStations: [],
      previousStations: [],
      stationOwners: [],
      workers: [],
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
    component.stationRithmId = stationId;
    stationInject = TestBed.inject(StationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get station last updated date', () => {
    const getLastUpdatedSpy = spyOn(
      TestBed.inject(StationService),
      'getLastUpdated'
    ).and.callThrough();

    component.getLastUpdated();

    expect(getLastUpdatedSpy).toHaveBeenCalledOnceWith(stationId);
  });

  it('should call the service to update the allowPreviousButton status in station', () => {
    component.statusAllowPreviousButton = false;
    const spyMethod = spyOn(
      TestBed.inject(StationService),
      'updateAllowPreviousButton'
    ).and.callThrough();

    component.updateAllowPreviousButton();
    expect(spyMethod).toHaveBeenCalledOnceWith(
      component.stationRithmId,
      component.statusAllowPreviousButton
    );
  });

  it('should catch an error when updating the status allow-previous-button fails', () => {
    spyOn(
      TestBed.inject(StationService),
      'updateAllowPreviousButton'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.updateAllowPreviousButton();
    expect(spyError).toHaveBeenCalled();
  });

  it('should delete a station', async () => {
    const deleteStationSpy = spyOn(
      TestBed.inject(StationService),
      'deleteStation'
    ).and.callThrough();
    await component.deleteStation();

    expect(deleteStationSpy).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should update station document generation status', () => {
    const updateGenerationStatusSpy = spyOn(
      TestBed.inject(StationService),
      'updateStationDocumentGenerationStatus'
    ).and.callThrough();

    const newStatus = DocumentGenerationStatus.Manual;

    component.updateStationDocumentGenerationStatus(stationId, newStatus);

    expect(updateGenerationStatusSpy).toHaveBeenCalledOnceWith(
      stationId,
      newStatus
    );
  });

  it('should update the component data', () => {
    const refreshDataComponent = spyOn(
      TestBed.inject(StationService),
      'getStationInfo'
    ).and.callThrough();
    component.getStationInfo();
    expect(refreshDataComponent).toHaveBeenCalledOnceWith(
      component.stationRithmId
    );
  });

  it('should show loading-indicators while get data component', () => {
    component.getStationInfo();
    fixture.detectChanges();
    expect(component.stationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#loading-drawer-component'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while get lasted data update', () => {
    component.getLastUpdated();
    fixture.detectChanges();
    expect(component.stationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#loading-drawer-component'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should show none-status-loading while get data the status station document', () => {
    component.stationLoading = false;
    component.selectedTabIndex = 1;
    component.getStationDocumentGenerationStatus();
    spyOn(TestBed.inject(UserService), 'isStationOwner').and.returnValue(true);
    fixture.detectChanges();
    expect(component.docGenLoading).toBe(true);

    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#none-status-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should show manual-status-loading while get data the status station document', () => {
    component.stationLoading = false;
    component.selectedTabIndex = 1;
    component.getStationDocumentGenerationStatus();
    spyOn(TestBed.inject(UserService), 'isStationOwner').and.returnValue(true);
    fixture.detectChanges();
    expect(component.docGenLoading).toBe(true);

    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#manual-status-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should show none-status-loading while update data the status station document', () => {
    component.stationLoading = false;
    component.selectedTabIndex = 1;
    const newStatus = DocumentGenerationStatus.Manual;
    component.updateStationDocumentGenerationStatus(
      component.stationRithmId,
      newStatus
    );
    spyOn(TestBed.inject(UserService), 'isStationOwner').and.returnValue(true);
    fixture.detectChanges();
    expect(component.docGenLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#none-status-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should show manual-status-loading while update data the status station document', () => {
    component.stationLoading = false;
    component.selectedTabIndex = 1;
    const newStatus = DocumentGenerationStatus.Manual;
    component.updateStationDocumentGenerationStatus(
      component.stationRithmId,
      newStatus
    );
    spyOn(TestBed.inject(UserService), 'isStationOwner').and.returnValue(true);
    fixture.detectChanges();
    expect(component.docGenLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#manual-status-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should refresher data info drawer component after this execute event refresher the dialog', () => {
    const eventRefresher = true;
    const spyRefresh = spyOn(component, 'getStationInfo').and.callThrough();
    component.refreshInfoDrawer(eventRefresher);
    expect(spyRefresh).toHaveBeenCalledOnceWith();
  });

  xit('should show the delete-station-button on the station information', () => {
    component.stationLoading = false;
    component.selectedTabIndex = 0;
    Object.defineProperty(component, 'displayDeleteStationButton', {
      value: true,
    });
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.nativeElement.querySelector(
      '#delete-station-button'
    );
    expect(deleteButton).toBeTruthy();
  });

  it('should not show the delete-station-button on the station information if the user is a worker', () => {
    component.stationLoading = false;
    component.editMode = false;
    spyOnProperty(component, 'isWorker').and.returnValue(true);
    expect(component.editMode).toBeFalse();
    const deleteButton = fixture.debugElement.nativeElement.querySelector(
      '#delete-station-button'
    );
    expect(deleteButton).toBeFalsy();
  });

  it('should determine if the user is an admin or station owner', () => {
    spyOn(TestBed.inject(UserService), 'isStationOwner').and.returnValue(true);
    const valueExpected = component.isUserAdminOrOwner;
    expect(valueExpected).toBeTrue();
  });

  it('should create a document', async () => {
    const createDocumentSpy = spyOn(
      TestBed.inject(DocumentService),
      'createNewDocument'
    ).and.callThrough();

    await component.createNewDocument();
    expect(createDocumentSpy).toHaveBeenCalledOnceWith(
      '',
      0,
      component.stationRithmId
    );
  });

  it('should catch an error if creating the document fails', async () => {
    spyOn(TestBed.inject(DocumentService), 'createNewDocument').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    await component.createNewDocument();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call the service to assign a user to a document', () => {
    const userExpect = '123-957';
    const newDocumentExpect = '852-789-654-782';
    const spyPetition = spyOn(
      TestBed.inject(DocumentService),
      'assignUserToDocument'
    ).and.callThrough();
    component.assignUserToDocument(userExpect, newDocumentExpect);
    expect(spyPetition).toHaveBeenCalledOnceWith(
      userExpect,
      component.stationRithmId,
      newDocumentExpect
    );
  });

  it('should catch error and executed error service when assign a user.', () => {
    const userExpect = '123-957';
    const newDocumentExpect = '852-789-654-782';
    spyOn(
      TestBed.inject(DocumentService),
      'assignUserToDocument'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.assignUserToDocument(userExpect, newDocumentExpect);
    expect(spyError).toHaveBeenCalled();
  });

  it('should call the method createNewDocument when new-document button is clicked', fakeAsync(() => {
    component.selectedTabIndex = 1;
    component.stationLoading = false;
    component.stationDocumentGenerationStatus = DocumentGenerationStatus.Manual;
    Object.defineProperty(component, 'isUserAdminOrOwner', { value: true });
    fixture.detectChanges();

    const createDocumentSpy = spyOn(component, 'createNewDocument');
    const btnNewDoc =
      fixture.debugElement.nativeElement.querySelector('#new-document');
    expect(btnNewDoc).toBeTruthy();
    btnNewDoc.click();
    tick();
    expect(createDocumentSpy).toHaveBeenCalledOnceWith();
  }));

  it('should open a confirm dialog to create a document', async () => {
    const dialogExpectData: DialogOptions = {
      title: 'Are you sure?',
      message:
        'After the document is created you will be redirected to the document page.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    };
    const popupSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();

    await component.createNewDocument();
    expect(popupSpy).toHaveBeenCalledOnceWith(dialogExpectData);
  });

  it('should show loading-indicators while creating a new document is underway', async () => {
    component.stationLoading = false;
    component.selectedTabIndex = 1;
    component.stationDocumentGenerationStatus = DocumentGenerationStatus.Manual;
    Object.defineProperty(component, 'isUserAdminOrOwner', { value: true });
    await component.createNewDocument();
    fixture.detectChanges();
    expect(component.docCreationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#creating-document-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should redirect to the document if you have assigned a user to the document successfully', () => {
    const userExpect = '123-957';
    const newDocumentExpect = '852-789-654-782';
    const expectData: unknown = [];
    spyOn(
      TestBed.inject(DocumentService),
      'assignUserToDocument'
    ).and.returnValue(of(expectData));

    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    component.assignUserToDocument(userExpect, newDocumentExpect);

    expect(routerSpy).toHaveBeenCalledWith([`/document/${newDocumentExpect}`], {
      queryParams: {
        documentId: newDocumentExpect,
        stationId: component.stationRithmId,
      },
    });
  });

  it('should update the allow external workers status for the station roster', () => {
    component.allowExternal = true;
    const updateAllowExternalSpy = spyOn(
      TestBed.inject(StationService),
      'updateAllowExternalWorkers'
    ).and.callThrough();
    component.updateAllowExternalWorkers();
    expect(updateAllowExternalSpy).toHaveBeenCalledOnceWith(
      stationId,
      component.allowExternal
    );
  });

  it('should catch an error if updating the allow external workers status fails', () => {
    spyOn(
      TestBed.inject(StationService),
      'updateAllowExternalWorkers'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.updateAllowExternalWorkers();
    expect(spyError).toHaveBeenCalled();
  });

  it('should update the allowAllOrgWorkers status in station', () => {
    component.allowAllOrgWorkers = true;
    const spyMethod = spyOn(
      TestBed.inject(StationService),
      'updateAllowAllOrgWorkers'
    ).and.callThrough();
    component.updateAllOrgWorkersStation();
    expect(spyMethod).toHaveBeenCalledOnceWith(
      stationId,
      component.allowAllOrgWorkers
    );
  });

  it('should catch an error when updating the allowAllOrgWorkers status fails', () => {
    spyOn(
      TestBed.inject(StationService),
      'updateAllowAllOrgWorkers'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.updateAllOrgWorkersStation();
    expect(spyError).toHaveBeenCalled();
  });

  it('should show loading-indicator-allow-external when calling updateAllowExternalWorkers', () => {
    component.stationLoading = false;
    component.selectedTabIndex = 2;
    component.updateAllowExternalWorkers();
    fixture.detectChanges();
    expect(component.allowExternalLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#loading-indicator-allow-external'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicator-allow-org-workers while update field allowAllOrgWorkers', () => {
    component.stationLoading = false;
    component.selectedTabIndex = 2;
    component.updateAllOrgWorkersStation();
    fixture.detectChanges();
    expect(component.allowAllOrgLoading).toBe(true);
    const loadingAllOrgWorker =
      fixture.debugElement.nativeElement.querySelector(
        '#loading-indicator-allow-org-workers'
      );
    expect(loadingAllOrgWorker).toBeTruthy();
  });

  it('should update text of flow button', () => {
    const spyFlowButton = spyOn(
      TestBed.inject(StationService),
      'updatedFlowButtonText'
    ).and.callThrough();

    expect(component.flowButtonName).toBe('');
    stationInject.flowButtonText$.next('Flow');
    expect(component.flowButtonName).toBe('');
    component.updateFlowButtonName();

    expect(spyFlowButton).toHaveBeenCalledOnceWith(component.flowButtonName);
  });

  it('should navigate to the station on the map', () => {
    const mapService = TestBed.inject(MapService);
    const routerNavigateSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.goToStationOnMap();
    expect(routerNavigateSpy).toHaveBeenCalledWith([`/map`]);
    expect(mapService.centerStationRithmId$.value).toBe(stationId);
    expect(mapService.viewStationButtonClick$.value).toBeTrue();
  });

  it('should show view on the map station button', () => {
    component.selectedTabIndex = 0;
    component.stationLoading = false;
    component.openedFromMap = false;
    component.stationDocumentGenerationStatus = DocumentGenerationStatus.Manual;
    Object.defineProperty(component, 'isUserAdminOrOwner', { value: true });
    fixture.detectChanges();

    const goToStationOnMapSpy = spyOn(component, 'goToStationOnMap');
    const viewOnMapButton = fixture.debugElement.nativeElement.querySelector(
      '#view-on-map-station-button'
    );
    expect(viewOnMapButton).toBeTruthy();
    viewOnMapButton.click();
    expect(goToStationOnMapSpy).toHaveBeenCalled();
  });

  it('should show status-allow-previous-loading when calling updateAllowPreviousButton', () => {
    component.stationLoading = false;
    component.updateAllowPreviousButton();
    fixture.detectChanges();
    expect(component.statusAllowPreviousLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#status-allow-previous-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should not show status-allow-previous-loading', () => {
    component.stationLoading = false;
    expect(component.statusAllowPreviousLoading).toBe(false);
    fixture.detectChanges();
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#status-allow-previous-loading'
    );
    expect(loadingComponent).toBeNull();
  });

  it('should change name on settings button', () => {
    component.stationRithmId = stationId;
    component.flowButtonName = 'New button name';
    const updateButtonNameSpy = spyOn(
      TestBed.inject(StationService),
      'updateFlowButtonText'
    ).and.callThrough();

    component.saveButtonSettings();

    expect(updateButtonNameSpy).toHaveBeenCalledWith(
      component.stationRithmId,
      component.flowButtonName
    );
  });

  it('should display error message on change settings button', () => {
    component.stationRithmId = stationId;
    component.flowButtonName = 'New button name';
    const updateButtonNameSpy = spyOn(
      TestBed.inject(StationService),
      'updateFlowButtonText'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.saveButtonSettings();

    expect(updateButtonNameSpy).toHaveBeenCalledWith(
      component.stationRithmId,
      component.flowButtonName
    );
    expect(spyError).toHaveBeenCalled();
  });
});
