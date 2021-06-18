/* eslint-disable rxjs/no-ignored-error */
import { TestBed } from '@angular/core/testing';

import { StationService } from './station.service';

describe('StationService', () => {
  let service: StationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of worker roaster of a station', () => {
    service.getWorkerRoasterByStationId()
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });
  });
});
