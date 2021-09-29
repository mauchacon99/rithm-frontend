/* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { StationMapData } from 'src/models';

import { MapService } from './map.service';

const MICROSERVICE_PATH = '/mapservice/api/map';

describe('MapService', () => {
  let service: MapService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MapService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all map elements for a given organization', () => {
    const expectedResponse: StationMapData[] = [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          name: 'Development',
          noOfDocuments: 5,
          mapPoint: {
            x: 12,
            y: 15
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C', 'AAAEBE98-YU01-97ER-A7BB-285PP25B0989'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989', 'CCCAAA00-IO01-97QW-Z7LK-877MM25Z0989']
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 1',
          noOfDocuments: 5,
          mapPoint: {
            x: 200,
            y: 80
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 2',
          noOfDocuments: 5,
          mapPoint: {
            x: 500,
            y: 400
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 3',
          noOfDocuments: 5,
          mapPoint: {
            x: 50,
            y: 240
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        }
      ];

    service.getMapElements()
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/stations`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });
});
