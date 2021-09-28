/* eslint-disable rxjs/no-ignored-error */
import { TestBed } from '@angular/core/testing';
import { MapData } from 'src/models';

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
    const expectedResponse: MapData = {
      stations: [
        {
          id: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          name: 'Development',
          numberOfDocuments: 5,
          mapPoint: {
            x: 12,
            y: 15
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C', 'AAAEBE98-YU01-97ER-A7BB-285PP25B0989'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989', 'CCCAAA00-IO01-97QW-Z7LK-877MM25Z0989']
        },
        {
          id: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 1',
          numberOfDocuments: 5,
          mapPoint: {
            x: 200,
            y: 80
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        },
        {
          id: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 2',
          numberOfDocuments: 5,
          mapPoint: {
            x: 500,
            y: 400
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        },
        {
          id: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 3',
          numberOfDocuments: 5,
          mapPoint: {
            x: 50,
            y: 240
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        }
      ], flows: []
    };

    service.getMapElements()
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
  });

  it('should restore previous data when cancelled', () => {
    service.buildMap();
    expect(service.storedMapElements).toEqual(service.mapElements);
    service.mapElements.stations.push(
      {
        id: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
        name: 'Step 2',
        numberOfDocuments: 5,
        mapPoint: {
          x: 500,
          y: 400
        },
        incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
        outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
      },
    );
    expect(service.mapElements).not.toEqual(service.storedMapElements);
    service.cancelMapChanges();
    expect(service.storedMapElements).toEqual(service.mapElements);
  });
});
