import { TestBed } from '@angular/core/testing';

import { MapStationService } from './map-station.service';

describe('MapStationService', () => {
  let service: MapStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
