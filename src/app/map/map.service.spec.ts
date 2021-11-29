import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MapData, MapItemStatus } from 'src/models';
import { environment } from 'src/environments/environment';
import { MapService } from './map.service';

const MICROSERVICE_PATH_STATION = '/stationservice/api/station';
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
    const expectedResponse: MapData = {
      stations: [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          stationName: 'Development',
          noOfDocuments: 5,
          mapPoint: {
            x: 12,
            y: 15
          },
          previousStations: [],
          nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0988'],
          status: MapItemStatus.Normal
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
          stationName: 'Step 1',
          noOfDocuments: 5,
          mapPoint: {
            x: 200,
            y: 80
          },
          previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          nextStations: [],
          status: MapItemStatus.Normal
        },
        {
          rithmId: 'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          stationName: 'Step 2',
          noOfDocuments: 5,
          mapPoint: {
            x: 500,
            y: 400
          },
          previousStations: [],
          nextStations: [],
          status: MapItemStatus.Normal
        },
        {
          rithmId: 'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
          stationName: 'Step 3',
          noOfDocuments: 5,
          mapPoint: {
            x: 50,
            y: 240
          },
          previousStations: [],
          nextStations: [],
          status: MapItemStatus.Normal
        }
      ],
      flows: [
        {
          rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
          organizationRithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
          title: 'Flow 1',
          stations: [
            'ED6148C9-ABB7-408E-A210-9242B2735B1C',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0990',
            'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
            'CCAEBE94-AF01-48AB-A7BB-279CC25B0989'
          ],
          subFlows: [],
          status: MapItemStatus.Normal,
          isReadOnlyRootFlow: false
        },
        {
          rithmId: '',
          title: '',
          stations: [],
          subFlows: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
          status: MapItemStatus.Normal,
          isReadOnlyRootFlow: true
        }
      ]
    };

    service.getMapElements()
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/all`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  xit('should restore previous data when cancelled', () => {
    // const test = [
    //   {
    //     rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
    //     stationName: 'Step 2',
    //     noOfDocuments: 5,
    //     mapPoint: {
    //       x: 500,
    //       y: 400
    //     },
    //     canvasPoint: {
    //       x: 500,
    //       y: 400
    //     },
    //     previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
    //     nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
    //     dragging: false,
    //     hoverActive: StationElementHoverType.None,
    //     status: MapItemStatus.Normal,
    //   },
    //   {
    //     rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
    //     name: 'Step 2',
    //     noOfDocuments: 5,
    //     mapPoint: {
    //       x: 500,
    //       y: 400
    //     },
    //     canvasPoint: {
    //       x: 500,
    //       y: 400
    //     },
    //     previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
    //     nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
    //     dragging: false,
    //     hoverActive: StationElementHoverType.None,
    //     status: MapItemStatus.Normal,
    //   },
    //   {
    //     rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
    //     name: 'Step 2',
    //     noOfDocuments: 5,
    //     mapPoint: {
    //       x: 500,
    //       y: 400
    //     },
    //     canvasPoint: {
    //       x: 500,
    //       y: 400
    //     },
    //     previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
    //     nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
    //     dragging: false,
    //     hoverActive: StationElementHoverType.None,
    //     status: MapItemStatus.Normal,
    //   },
    //   {
    //     rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
    //     name: 'Step 2',
    //     noOfDocuments: 5,
    //     mapPoint: {
    //       x: 500,
    //       y: 400
    //     },
    //     canvasPoint: {
    //       x: 500,
    //       y: 400
    //     },
    //     previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
    //     nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
    //     dragging: false,
    //     hoverActive: StationElementHoverType.None,
    //     status: MapItemStatus.Normal,
    //   },
    // ];
    // // service.stationElements = test;
    // service.buildMap();
    // expect(service.stationElements).toEqual(service.storedStationElements);
    // service.stationElements = [
    //       {
    //         rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
    //         name: 'Step 2',
    //         noOfDocuments: 5,
    //         mapPoint: {
    //           x: 500,
    //           y: 400
    //         },
    //         canvasPoint: {
    //           x: 500,
    //           y: 400
    //         },
    //         previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
    //         nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
    //         dragging: false,
    //         hoverActive: StationElementHoverType.None,
    //         status: MapItemStatus.Normal,
    //       },
    //       {
    //         rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
    //         name: 'Step 2',
    //         noOfDocuments: 5,
    //         mapPoint: {
    //           x: 500,
    //           y: 400
    //         },
    //         canvasPoint: {
    //           x: 500,
    //           y: 400
    //         },
    //         previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
    //         nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
    //         dragging: false,
    //         hoverActive: StationElementHoverType.None,
    //         status: MapItemStatus.Normal,
    //       },
    //     ];
    // expect(service.stationElements).not.toEqual(service.storedStationElements);
    // service.cancelMapChanges();
    // expect(service.stationElements).toEqual(test);
  });

  xit('should publish map data', () => {
    const postData: MapData = {
      stations: [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          stationName: 'Development',
          noOfDocuments: 5,
          mapPoint: {
            x: 12,
            y: 15
          },
          previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C', 'AAAEBE98-YU01-97ER-A7BB-285PP25B0989'],
          nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989', 'CCCAAA00-IO01-97QW-Z7LK-877MM25Z0989'],
          status: MapItemStatus.Normal
        }
      ], flows: []
    };

    service.publishMap()
      .subscribe((response) => {
        expect(response).toBeDefined();
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH_STATION}/map`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(postData);

    req.flush(postData);
    httpTestingController.verify();
  });

});
