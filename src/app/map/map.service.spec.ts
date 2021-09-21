/* eslint-disable rxjs/no-ignored-error */
import { TestBed } from '@angular/core/testing';
import { StationMapData } from 'src/models';

import { MapService } from './map.service';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all map elements for a given organization', () => {
    const expectedResponse: StationMapData[] = [{
      id: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      name: 'Development',
      numberOfDocuments: 5,
      mapPoint: {
        x: 12,
        y: 15
      },
      incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C', 'AAAEBE98-YU01-97ER-A7BB-285PP25B0989'],
      outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989', 'CCCAAA00-IO01-97QW-Z7LK-877MM25Z0989']
    }];

    service.getMapElements()
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
  });
});
