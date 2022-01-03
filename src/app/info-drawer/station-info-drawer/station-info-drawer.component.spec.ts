import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationInfoDrawerComponent } from './station-info-drawer.component';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockMapService, MockPopupService, MockStationService, MockUserService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/core/user.service';
import { MockComponent } from 'ng-mocks';
import { RosterComponent } from 'src/app/shared/roster/roster.component';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { PopupService } from 'src/app/core/popup.service';
import { DocumentGenerationStatus } from 'src/models';
import { MapService } from 'src/app/map/map.service';
import { DocumentService } from '../../core/document.service';
import { MockDocumentService } from '../../../mocks/mock-document-service';
import { throwError } from 'rxjs';

describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;
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
        MatRadioModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: MapService, useClass: MockMapService },
        { provide: DocumentService, useClass: MockDocumentService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoDrawerComponent);
    component = fixture.componentInstance;
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
      priority: 2
    };
    component.stationRithmId = stationId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get station last updated date', () => {
    const getLastUpdatedSpy = spyOn(TestBed.inject(StationService), 'getLastUpdated').and.callThrough();

    component.getLastUpdated();

    expect(getLastUpdatedSpy).toHaveBeenCalledOnceWith(stationId);
  });

  it('should delete a station', async () => {
    const deleteStationSpy = spyOn(TestBed.inject(StationService), 'deleteStation').and.callThrough();
    await component.deleteStation();

    expect(deleteStationSpy).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should update station document generation status', () => {
    const updateGenerationStatusSpy = spyOn(TestBed.inject(StationService), 'updateStationDocumentGenerationStatus').and.callThrough();

    const newStatus = DocumentGenerationStatus.Manual;

    component.updateStationDocumentGenerationStatus(stationId, newStatus);

    expect(updateGenerationStatusSpy).toHaveBeenCalledOnceWith(stationId, newStatus);
  });

  it('should update the component data', () => {
    const refreshDataComponent = spyOn(TestBed.inject(StationService), 'getStationInfo').and.callThrough();
    component.getStationInfo();
    expect(refreshDataComponent).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should show loading-indicators while get data component', () => {
    component.getStationInfo();
    fixture.detectChanges();
    expect(component.stationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-drawer-component');
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while get lasted data update', () => {
    component.getLastUpdated();
    fixture.detectChanges();
    expect(component.stationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-drawer-component');
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while get data the status station document', () => {
    component.stationLoading = false;
    component.getStationDocumentGenerationStatus();
    fixture.detectChanges();
    expect(component.docGenLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-indicator-status');
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while update data the status station document', () => {
    component.stationLoading = false;
    const newStatus = DocumentGenerationStatus.Manual;
    component.updateStationDocumentGenerationStatus(component.stationRithmId, newStatus);
    fixture.detectChanges();
    expect(component.docGenLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-indicator-status');
    expect(loadingComponent).toBeTruthy();
  });

  it('should refresher data info drawer component after this execute event refresher the dialog', () => {
    const eventRefresher = true;
    const spyRefresh = spyOn(component, 'getStationInfo').and.callThrough();
    component.refreshInfoDrawer(eventRefresher);
    expect(spyRefresh).toHaveBeenCalledOnceWith();
  });

  it('should show the delete-station-button on the station information', () => {
    component.stationLoading = false;
    component.editMode = true;
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
    const deleteButton = fixture.debugElement.nativeElement.querySelector('#delete-station-button');
    expect(deleteButton).toBeTruthy();
  });

  it('should not show the delete-station-button on the station information if the user is a worker', () => {
    component.stationLoading = false;
    component.editMode = false;
    spyOnProperty(component, 'isWorker').and.returnValue(true);
    expect(component.editMode).toBeFalse();
    const deleteButton = fixture.debugElement.nativeElement.querySelector('#delete-station-button');
    expect(deleteButton).toBeFalsy();
  });

  it('should determine if the user is an admin or station owner', () => {
    spyOn(TestBed.inject(UserService), 'isStationOwner').and.returnValue(true);
    const valueExpected = component.isUserAdminOrOwner;
    expect(valueExpected).toBeTrue();
  });

  it('should a user assigned in new document', () => {
    const newUserExpect = '123-957';
    const newDocumentExpect = '852-789-654-782';
    const spyPetition = spyOn(TestBed.inject(DocumentService), 'assignUserToNewDocument').and.callThrough();
    component.assignUserToNewDocument(newUserExpect, newDocumentExpect);
    expect(spyPetition).toHaveBeenCalledOnceWith(newUserExpect, component.stationRithmId, newDocumentExpect);
  });

  it('should catch error and executed error service', () => {
    const newUserExpect = '123-957';
    const newDocumentExpect = '852-789-654-782';
    spyOn(TestBed.inject(DocumentService), 'assignUserToNewDocument').and.returnValue(throwError(() => {
      throw new Error();
    }));
    const spyError = spyOn(TestBed.inject(ErrorService), 'displayError').and.callThrough();
    component.assignUserToNewDocument(newUserExpect, newDocumentExpect);
    expect(spyError).toHaveBeenCalled();
  });
});
