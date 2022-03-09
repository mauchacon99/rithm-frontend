import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  MapData,
  MapItemStatus,
  StationGroupMapData,
  StationMapData,
} from 'src/models';
import { environment } from 'src/environments/environment';
import { MapService } from './map.service';
import { StationGroupMapElement, StationMapElement } from 'src/helpers';
import { v4 as uuidv4 } from 'uuid';

const MICROSERVICE_PATH_STATION = '/stationservice/api/station';
const MICROSERVICE_PATH = '/mapservice/api/map';

describe('MapService', () => {
  let service: MapService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
            y: 15,
          },
          previousStations: [],
          nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0988'],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
          stationName: 'Step 1',
          noOfDocuments: 5,
          mapPoint: {
            x: 200,
            y: 80,
          },
          previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          stationName: 'Step 2',
          noOfDocuments: 5,
          mapPoint: {
            x: 500,
            y: 400,
          },
          previousStations: [],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
          stationName: 'Step 3',
          noOfDocuments: 5,
          mapPoint: {
            x: 50,
            y: 240,
          },
          previousStations: [],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
      ],
      stationGroups: [
        {
          rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
          organizationRithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
          title: 'Group 1',
          stations: [
            'ED6148C9-ABB7-408E-A210-9242B2735B1C',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0990',
            'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
            'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          ],
          subStationGroups: [],
          status: MapItemStatus.Normal,
          isReadOnlyRootStationGroup: false,
          isChained: false,
        },
        {
          rithmId: '',
          title: '',
          stations: [],
          subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
          status: MapItemStatus.Normal,
          isReadOnlyRootStationGroup: true,
          isChained: false,
        },
      ],
    };

    service.getMapData().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/all`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should populate this.connectionElements', () => {
    expect(service.connectionElements.length).toEqual(0);

    const stationElementsArray: StationMapElement[] = [];
    for (let i = 0; i < 4; i++) {
      const newStation = new StationMapElement({
        rithmId: uuidv4(),
        stationName: 'Untitled Station',
        mapPoint: {
          x: 12,
          y: 15,
        },
        noOfDocuments: 0,
        previousStations: [],
        nextStations: [],
        status: MapItemStatus.Created,
        notes: '',
      });
      stationElementsArray.push(newStation);
    }

    stationElementsArray[0].nextStations.push(stationElementsArray[1].rithmId);
    stationElementsArray[1].nextStations.push(stationElementsArray[2].rithmId);
    stationElementsArray[2].nextStations.push(stationElementsArray[3].rithmId);

    stationElementsArray[3].previousStations.push(
      stationElementsArray[2].rithmId
    );
    stationElementsArray[2].previousStations.push(
      stationElementsArray[1].rithmId
    );
    stationElementsArray[1].previousStations.push(
      stationElementsArray[0].rithmId
    );

    service.stationElements = stationElementsArray;

    service.setConnections();

    expect(service.connectionElements.length).toEqual(3);
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
            y: 15,
          },
          previousStations: [
            'ED6148C9-ABB7-408E-A210-9242B2735B1C',
            'AAAEBE98-YU01-97ER-A7BB-285PP25B0989',
          ],
          nextStations: [
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
            'CCCAAA00-IO01-97QW-Z7LK-877MM25Z0989',
          ],
          status: MapItemStatus.Normal,
          notes: '',
        },
      ],
      stationGroups: [],
    };

    service.publishMap().subscribe((response) => {
      expect(response).toBeDefined();
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION}/map`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(postData);

    req.flush(postData);
    httpTestingController.verify();
  });

  it('should Delete the station group and find parent to move all stations and sub groups', () => {
    const stationGroupMapData: StationGroupMapData[] = [
      {
        rithmId: 'Root',
        title: 'Root',
        organizationRithmId: '',
        stations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
        subStationGroups: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: true,
        isChained: false,
      },
      {
        rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
        title: 'Rithm Group',
        organizationRithmId: '',
        stations: [],
        subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: false,
        isChained: false,
      },
      {
        rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
        title: ' Sub RithmGroup',
        organizationRithmId: '',
        stations: [],
        subStationGroups: [],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: false,
        isChained: false,
      },
    ];
    service.stationGroupElements = stationGroupMapData.map(
      (e) => new StationGroupMapElement(e)
    );
    const stationGroupId = 'ED6155C9-ABB7-458E-A250-9542B2535B1C';
    service.removeStationGroup(stationGroupId);
    const removedGroup = service.stationGroupElements.find(
      (group) => group.rithmId === stationGroupId
    );
    const parentGroup = service.stationGroupElements.find((group) =>
      group.subStationGroups.includes(<string>removedGroup?.rithmId)
    );
    expect(parentGroup?.subStationGroups).toEqual(
      parentGroup?.subStationGroups.concat(
        <string[]>removedGroup?.subStationGroups
      )
    );
    expect(parentGroup?.stations).toEqual(
      parentGroup?.stations.concat(<string[]>removedGroup?.stations)
    );
    expect(removedGroup?.subStationGroups.length).toEqual(0);
    expect(removedGroup?.stations.length).toEqual(0);
    service.mapDataReceived$.subscribe((res) => expect(res).toBe(true));
  });

  it('should add only the parent group to a pending group when a group and subgroup are selected', () => {
    const stationGroupMapData: StationGroupMapData[] = [
      {
        rithmId: 'Root',
        title: 'Root',
        organizationRithmId: '',
        stations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
        subStationGroups: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989'],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: true,
        isChained: false,
      },
      {
        rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
        title: 'Rithm Group',
        organizationRithmId: '',
        stations: [],
        subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: false,
        isChained: false,
      },
      {
        rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
        title: ' Sub RithmGroup',
        organizationRithmId: '',
        stations: [],
        subStationGroups: [],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: false,
        isChained: false,
      },
    ];
    service.stationGroupElements = stationGroupMapData.map(
      (e) => new StationGroupMapElement(e)
    );
    for (const group of service.stationGroupElements) {
      if (
        group.status !== MapItemStatus.Pending &&
        !group.isReadOnlyRootStationGroup
      ) {
        group.selected = true;
      }
    }
    service.updatePendingStationGroup();
    const pendingGroup =
      service.stationGroupElements[service.stationGroupElements.length - 1];
    expect(pendingGroup.status).toEqual(MapItemStatus.Pending);
    expect(pendingGroup.subStationGroups.length).toEqual(1);
    expect(pendingGroup.subStationGroups[0]).toEqual(
      'CCAEBE24-AF01-48AB-A7BB-279CC25B0989'
    );
  });

  it('should add only the outer stations to a pending group when stations within and outside a selected group are also selected', () => {
    const stationMapData: StationMapData[] = [
      {
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        stationName: 'Development',
        noOfDocuments: 5,
        mapPoint: {
          x: 12,
          y: 15,
        },
        previousStations: [],
        nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0988'],
        status: MapItemStatus.Normal,
        notes: '',
      },
      {
        rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
        stationName: 'Step 1',
        noOfDocuments: 5,
        mapPoint: {
          x: 200,
          y: 80,
        },
        previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
        nextStations: [],
        status: MapItemStatus.Normal,
        notes: '',
      },
      {
        rithmId: 'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
        stationName: 'Step 2',
        noOfDocuments: 5,
        mapPoint: {
          x: 500,
          y: 400,
        },
        previousStations: [],
        nextStations: [],
        status: MapItemStatus.Normal,
        notes: '',
      },
      {
        rithmId: 'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
        stationName: 'Step 3',
        noOfDocuments: 5,
        mapPoint: {
          x: 50,
          y: 240,
        },
        previousStations: [],
        nextStations: [],
        status: MapItemStatus.Normal,
        notes: '',
      },
    ];
    service.stationElements = stationMapData.map(
      (e) => new StationMapElement(e)
    );
    for (const station of service.stationElements) {
      station.selected = true;
    }

    const stationGroupMapData: StationGroupMapData[] = [
      {
        rithmId: 'Root',
        title: 'Root',
        organizationRithmId: '',
        stations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
        subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: true,
        isChained: false,
      },
      {
        rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
        title: ' Sub RithmGroup',
        organizationRithmId: '',
        stations: [
          'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
          'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
        ],
        subStationGroups: [],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: false,
        isChained: false,
      },
    ];
    service.stationGroupElements = stationGroupMapData.map(
      (e) => new StationGroupMapElement(e)
    );
    for (const group of service.stationGroupElements) {
      if (
        group.status !== MapItemStatus.Pending &&
        !group.isReadOnlyRootStationGroup
      ) {
        group.selected = true;
      }
    }

    service.updatePendingStationGroup();
    const pendingGroup =
      service.stationGroupElements[service.stationGroupElements.length - 1];
    expect(pendingGroup.status).toEqual(MapItemStatus.Pending);
    expect(pendingGroup.subStationGroups.length).toEqual(1);
    expect(pendingGroup.subStationGroups[0]).toEqual(
      'ED6155C9-ABB7-458E-A250-9542B2535B1C'
    );
    expect(pendingGroup.stations.length).toEqual(1);
    expect(pendingGroup.stations[0]).toEqual(
      'ED6148C9-ABB7-408E-A210-9242B2735B1C'
    );
  });

  it('should replace old pending group when a new one is added', () => {
    const stationMapData: StationMapData[] = [
      {
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        stationName: 'Development',
        noOfDocuments: 5,
        mapPoint: {
          x: 12,
          y: 15,
        },
        previousStations: [],
        nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0988'],
        status: MapItemStatus.Normal,
        notes: '',
      },
    ];
    service.stationElements = stationMapData.map(
      (e) => new StationMapElement(e)
    );
    for (const station of service.stationElements) {
      station.selected = true;
    }

    const stationGroupMapData: StationGroupMapData[] = [
      {
        rithmId: 'Root',
        title: 'Root',
        organizationRithmId: '',
        stations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
        subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: true,
        isChained: false,
      },
      {
        rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
        title: ' Sub RithmGroup',
        organizationRithmId: '',
        stations: [
          'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
          'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
        ],
        subStationGroups: [],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: false,
        isChained: false,
      },
    ];
    service.stationGroupElements = stationGroupMapData.map(
      (e) => new StationGroupMapElement(e)
    );

    service.updatePendingStationGroup();

    const firstPendingId =
      service.stationGroupElements[service.stationGroupElements.length - 1]
        .rithmId;
    const firstPending =
      service.stationGroupElements[service.stationGroupElements.length - 1];

    expect(service.stationGroupElements.length).toEqual(3);
    expect(
      service.stationGroupElements[service.stationGroupElements.length - 1]
        .status
    ).toEqual(MapItemStatus.Pending);
    expect(firstPending.subStationGroups.length).toEqual(0);

    for (const group of service.stationGroupElements) {
      if (
        group.status !== MapItemStatus.Pending &&
        !group.isReadOnlyRootStationGroup
      ) {
        group.selected = true;
      }
    }

    service.updatePendingStationGroup();

    const secondPending =
      service.stationGroupElements[service.stationGroupElements.length - 1];

    expect(service.stationGroupElements.length).toEqual(3);
    expect(
      service.stationGroupElements[service.stationGroupElements.length - 1]
        .status
    ).toEqual(MapItemStatus.Pending);
    expect(
      service.stationGroupElements[service.stationGroupElements.length - 1]
        .rithmId
    ).not.toEqual(firstPendingId);
    expect(secondPending.subStationGroups.length).toEqual(1);
  });

  it('should set drawerOpened property of respective map element to false when any drawer is closed', () => {
    const station = new StationMapElement({
      rithmId: uuidv4(),
      stationName: 'Untitled Station',
      mapPoint: {
        x: 12,
        y: 15,
      },
      noOfDocuments: 0,
      previousStations: [],
      nextStations: [],
      status: MapItemStatus.Created,
      notes: '',
    });
    service.stationElements.push(station);
    service.stationElements.map((e) => {
      e.drawerOpened = true;
    });
    service.handleDrawerClose();
    service.mapDataReceived$.subscribe((res) => expect(res).toBe(true));
  });

  it('should update the status to created for a new station group.', () => {
    const stationGroupMapData: StationGroupMapData[] = [
      {
        rithmId: 'Root',
        title: 'Root',
        organizationRithmId: '',
        stations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
        subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: true,
        isChained: false,
      },
      {
        rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
        title: ' Sub RithmGroup',
        organizationRithmId: '',
        stations: [
          'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
          'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
        ],
        subStationGroups: [],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: false,
        isChained: false,
      },
    ];
    service.stationGroupElements = stationGroupMapData.map(
      (e) => new StationGroupMapElement(e)
    );
    const rithmId = 'ED6155C9-ABB7-458E-A250-9542B2535B1C';

    const resetSelectedStationGroupStationStatusSpy = spyOn(
      TestBed.inject(MapService),
      'resetSelectedStationGroupStationStatus'
    );

    service.updateCreatedStationGroup(rithmId);
    expect(service.stationGroupElements[1].title).toEqual(' Sub RithmGroup');
    expect(service.stationGroupElements[1].status).toBe(MapItemStatus.Normal);
    expect(resetSelectedStationGroupStationStatusSpy).toHaveBeenCalled();

    expect(service.stationGroupElements[0].status).not.toBe(
      MapItemStatus.Created
    );
  });
});
