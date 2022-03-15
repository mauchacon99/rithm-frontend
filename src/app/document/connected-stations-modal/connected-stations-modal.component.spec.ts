import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { StationService } from 'src/app/core/station.service';
import { ConnectedStationInfo, MoveDocument, Station } from 'src/models';
import { ConnectedStationsModalComponent } from './connected-stations-modal.component';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService } from 'src/mocks/mock-error-service';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService } from 'src/mocks/mock-document-service';
import { UserService } from 'src/app/core/user.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockPopupService, MockUserService } from 'src/mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';

const DATA_TEST = {
  documentRithmId: 'E204F369-386F-4E41',
  stationRithmId: 'E204F369-386F-4E41',
};

describe('ConnectedStationsModalComponent', () => {
  let component: ConnectedStationsModalComponent;
  let fixture: ComponentFixture<ConnectedStationsModalComponent>;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
  const documentId = 'E204F369-386F-4E41';
  const dialogRefSpyObj = jasmine.createSpyObj({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close: () => {},
  });

  const station = {
    allowAllOrgWorkers: false,
    allowExternalWorkers: true,
    allowPreviousButton: false,
    altStationButtons: false,
    createdByRithmId: '92c53ccd-dab1-44ad-976d-86a48d2104b5',
    createdDateUTC: '2022-01-28T21:20:55.37',
    dueDate: null,
    flowButton: null,
    instructions: '',
    isChained: false,
    name: "Path of Mand'alor",
    priority: 0,
    questions: [],
    rithmId: '4fb462ec-0772-49dc-8cfb-3849d70ad168',
    stationOwners: [],
    updatedByRithmId: 'a3f2e8ef-c7cc-4eaf-8833-d6385d4b35f9',
    updatedDateUTC: '2022-03-07T23:16:09.4977559',
    workers: [],
  } as ConnectedStationInfo | Station;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConnectedStationsModalComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: MockComponent(DashboardComponent) },
        ]),
        HttpClientModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DATA_TEST },
        { provide: MatDialogRef, useValue: { close } },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedStationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.documentRithmId = DATA_TEST.documentRithmId;
    component.stationRithmId = DATA_TEST.stationRithmId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activate the move document button', () => {
    component.connectedStationLoading = false;
    const btnMoveDocument = fixture.nativeElement.querySelector(
      '#connected-modal-move'
    );
    expect(btnMoveDocument.disabled).toBeTruthy();

    component.formMoveDocument.setValue(station);
    fixture.detectChanges();

    expect(btnMoveDocument.disabled).toBeFalsy();
  });

  it('should must call the method that returns the previous and next stations.', () => {
    const spyStations = spyOn(
      TestBed.inject(DocumentService),
      'getConnectedStationInfo'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyStations).toHaveBeenCalledOnceWith(
      component.documentRithmId,
      component.stationRithmId
    );
  });

  it('should show error message when request for next and previous stations fails.', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getConnectedStationInfo'
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
    expect(spyError).toHaveBeenCalled();
  });

  it('should call the service to move the document to another station', () => {
    component.stationRithmId = stationId;
    component.documentRithmId = documentId;
    component.formMoveDocument.setValue(station);

    const dataExpect: MoveDocument = {
      fromStationRithmId: stationId,
      toStationRithmIds: [station.rithmId],
      documentRithmId: documentId,
    };
    const spyMoveDocument = spyOn(
      TestBed.inject(DocumentService),
      'moveDocument'
    ).and.callThrough();
    component.moveDocument();
    expect(spyMoveDocument).toHaveBeenCalledOnceWith(dataExpect);
  });

  it('should catch an error when moving the document if an error occurs', () => {
    component.stationRithmId = stationId;
    component.documentRithmId = documentId;
    component.formMoveDocument.setValue(station);

    spyOn(TestBed.inject(DocumentService), 'moveDocument').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.moveDocument();
    expect(spyError).toHaveBeenCalled();
  });

  it('should show error in petition connected stations', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getConnectedStationInfo'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    const reviewError =
      fixture.debugElement.nativeElement.querySelector('#stations-error');
    expect(component.connectedError).toBeTrue();
    expect(reviewError).toBeTruthy();
  });

  it('should redirect to dashboard when document is moved', () => {
    component.stationRithmId = stationId;
    component.documentRithmId = documentId;
    component.formMoveDocument.setValue(station);

    const dataExpect: MoveDocument = {
      fromStationRithmId: stationId,
      toStationRithmIds: [station.rithmId],
      documentRithmId: documentId,
    };
    const spyMoveDocument = spyOn(
      TestBed.inject(DocumentService),
      'moveDocument'
    ).and.callFake(() => of(dataExpect));
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

    component.moveDocument();
    expect(spyMoveDocument).toHaveBeenCalledOnceWith(dataExpect);
    expect(routerSpy).toHaveBeenCalledWith('dashboard');
  });

  it('should activate the connected station loading', () => {
    const connectedStationLoading =
      fixture.debugElement.nativeElement.querySelector(
        '#connected-stations-loading'
      );
    component.connectedStationLoading = true;
    fixture.detectChanges();
    expect(connectedStationLoading).toBeTruthy();
  });

  it('should show error message when request for move document fails', () => {
    spyOn(TestBed.inject(DocumentService), 'moveDocument').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.stationRithmId = stationId;
    component.documentRithmId = documentId;
    component.moveDocument();
    fixture.detectChanges();
    expect(component.moveDocumentError).toBeTrue();
    const errorComponent = fixture.debugElement.nativeElement.querySelector(
      '#move-document-error'
    );
    expect(errorComponent).toBeTruthy();
  });

  it('should call the method that returns all stations.', () => {
    const getAllStations = spyOn(
      TestBed.inject(StationService),
      'getAllStations'
    ).and.callThrough();

    spyOnProperty(component, 'isAdmin').and.returnValue(true);
    component.ngOnInit();
    expect(getAllStations).toHaveBeenCalled();
  });

  it('should test method get isAdmin', () => {
    spyOnProperty(component, 'isAdmin').and.returnValue(true);
    const valueExpected = component.isAdmin;
    expect(valueExpected).toBe(true);
  });

  it('should activate the connected-stations-loading when calling getAllStations', () => {
    spyOnProperty(component, 'isAdmin').and.returnValue(true);
    const connectedStationLoading =
      fixture.debugElement.nativeElement.querySelector(
        '#connected-stations-loading'
      );
    component.ngOnInit();
    expect(connectedStationLoading).toBeTruthy();
  });

  it('should check typeof of the formMoveDocument', () => {
    component.formMoveDocument.setValue('');
    expect(component.checkTypeof).toBeTrue();
  });

  it('should listen to autocomplete input', () => {
    const spyForm = spyOn(
      component.formMoveDocument.valueChanges,
      'pipe'
    ).and.callThrough();
    component['listenAutocomplete$']();
    expect(spyForm).toHaveBeenCalled();
  });

  it('should return filter data to autocomplete', () => {
    component.stations = [station];
    const expectData = component['filterAutocomplete'](station.name);
    expect(expectData).toEqual([station]);
  });

  it('should return name station to display', () => {
    const expectData = component.displayFn(station);
    expect(expectData).toEqual(station.name);
  });

  it('should close the rule modal when connected-modal-close clicked', () => {
    const buttonClose = fixture.debugElement.nativeElement.querySelector(
      '#connected-modal-close'
    );
    expect(buttonClose).toBeTruthy();
    buttonClose.click();
    expect(component.dialogRef.close).toHaveBeenCalled();
    expect(buttonClose).toBeTruthy();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
