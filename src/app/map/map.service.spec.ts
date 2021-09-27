/* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MapData } from 'src/models';
import { environment } from 'src/environments/environment';
import { MapService } from './map.service';

const MICROSERVICE_PATH = '/stationservice/api/station';

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
            x: 12,
            y: 15
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

  xit('should publish map data', () => {
    const postData: MapData = {
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
        }
      ], flows: []
    };

    service.publishMap(postData)
      .subscribe((response) => {
        expect(response).toBeDefined();
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/map`);
    console.log(req);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(postData);

    req.flush(postData);
    httpTestingController.verify();
  });

});
