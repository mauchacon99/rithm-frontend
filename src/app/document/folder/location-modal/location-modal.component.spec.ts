import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { DocumentCurrentStation } from 'src/models';

import { LocationModalComponent } from './location-modal.component';

const DATA_TEST = {
  stationRithmId: 'E204F369-386F-4E41',
};

describe('LocationModalComponent', () => {
  let component: LocationModalComponent;
  let fixture: ComponentFixture<LocationModalComponent>;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
  const documentId = 'E204F369-386F-4E41';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationModalComponent],
      imports: [RouterTestingModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DATA_TEST },
        { provide: MatDialogRef, useValue: { close } },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.stationRithmId = DATA_TEST.stationRithmId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the service to get the current Stations', () => {
    component.stationRithmId = stationId;
    const spyMethod = spyOn(
      TestBed.inject(DocumentService),
      'getCurrentStations'
    ).and.callThrough();

    component.ngOnInit();
    expect(component.eventDocumentsError).toBeTrue();
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

  it('should call the method that redirect to the same container in other station', () => {
    component.eventsLoading = false;
    component.eventDocumentsError = false;

    const eventStation: DocumentCurrentStation[] = [
      {
        name: 'Testy',
        rithmId: '123',
        flowedTimeUTC: '2022-04-18T20:34:24.118Z',
      },
    ];
    component.currentStations = eventStation;
    fixture.detectChanges();

    const index = 0;
    const btnContainer = fixture.debugElement.nativeElement.querySelector(
      `#view-station-${index}`
    );
    expect(btnContainer).toBeTruthy();

    const navigateSpy = spyOn(component, 'goToContainer').and.callThrough();
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    spyOn(
      TestBed.inject(SidenavDrawerService),
      'closeDrawer'
    );
    spyOn(TestBed.inject(MatDialogRef), 'close');

    btnContainer.click(component.currentStations[0].rithmId);
    component.goToContainer(component.currentStations[0].rithmId);

    expect(navigateSpy).toHaveBeenCalledWith(component.currentStations[0].rithmId);
    expect(routerSpy).toHaveBeenCalledWith([`/document/${component.documentRithmId}`], {
      queryParams: {
        documentId: component.documentRithmId,
        stationId: component.currentStations[0].rithmId,
      },
    });
  });
});
