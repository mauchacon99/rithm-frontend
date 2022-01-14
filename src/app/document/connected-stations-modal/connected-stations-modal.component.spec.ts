import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ConnectedStationsModalComponent } from './connected-stations-modal.component';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService } from 'src/mocks/mock-error-service';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService } from 'src/mocks/mock-document-service';
import { of, throwError } from 'rxjs';
import { MoveDocument } from 'src/models';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { MockComponent } from 'ng-mocks';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/core/popup.service';
import { MockPopupService } from 'src/mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectedStationsModalComponent, MockComponent(LoadingIndicatorComponent)],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: MockComponent(DashboardComponent) },
        ]),
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DATA_TEST },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
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
    const btnMoveDocument = fixture.nativeElement.querySelector(
      '#connected-modal-move'
    );
    expect(btnMoveDocument.disabled).toBeTruthy();
    component.selectedStation = stationId;
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
    component.selectedStation = '123-654-789';

    const dataExpect: MoveDocument = {
      fromStationRithmId: stationId,
      toStationRithmIds: ['123-654-789'],
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
    component.selectedStation = '123-654-789';

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
    component.selectedStation = '123-654-789';

    const dataExpect: MoveDocument = {
      fromStationRithmId: stationId,
      toStationRithmIds: ['123-654-789'],
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
});
