import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { LocationModalComponent } from './location-modal.component';

describe('LocationModalComponent', () => {
  let component: LocationModalComponent;
  let fixture: ComponentFixture<LocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationModalComponent],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the service to get the current Stations', () => {
    const spyMethod = spyOn(
      TestBed.inject(StationService),
      'getCurrentStations'
    ).and.callThrough();

    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should call the errorService if the request getCurrentStations fails', () => {
    const currentStationsEventSpy = spyOn(
      TestBed.inject(StationService),
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
      component.stationRithmId
    );
    expect(spyError).toHaveBeenCalled();
  });
});
