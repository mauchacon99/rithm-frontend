import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';

import { LocationModalComponent } from './location-modal.component';

const DATA_TEST = {
  stationRithmId: 'E204F369-386F-4E41',
};

describe('LocationModalComponent', () => {
  let component: LocationModalComponent;
  let fixture: ComponentFixture<LocationModalComponent>;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationModalComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DATA_TEST },
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

  it('should indicate how long it has been located at that station', () => {
    const timeEntered = component.getElapsedTime('2022-04-19T21:32:41.2150164');
    expect(timeEntered).toEqual('7 days');
  });
});
