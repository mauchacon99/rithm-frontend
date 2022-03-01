import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';

import { StationGroupElementService } from './station-group-element.service';
import { MapService } from './map.service';
import {
  Corner,
  MapItemStatus,
  Point,
  StationGroupElementHoverItem,
  StationGroupMapData,
  StationMapData,
} from 'src/models';
import {
  DEFAULT_SCALE,
  GROUP_CHARACTER_SIZE,
  ICON_STATION_GROUP_ACCEPT,
  MAP_SELECTED,
  SCALE_RENDER_STATION_ELEMENTS,
  STATION_GROUP_PADDING,
  STATION_HEIGHT,
  STATION_WIDTH,
} from './map-constants';
import { StationGroupMapElement, StationMapElement } from 'src/helpers';

describe('StationGroupElementService', () => {
  let service: StationGroupElementService;
  let mapService: MapService;
  const stationGroupsMapData: StationGroupMapData[] = [
    {
      rithmId: 'Root',
      title: 'Root',
      organizationRithmId: '',
      stations: [
        'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
      ],
      subStationGroups: [
        'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
        'ED6155C9-ABB7-458E-A250-9542B2535B1C',
      ],
      status: MapItemStatus.Normal,
      isReadOnlyRootStationGroup: true,
      isChained: false,
    },
    {
      rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
      title: 'Rithm Group',
      organizationRithmId: '',
      stations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
      subStationGroups: [],
      status: MapItemStatus.Normal,
      isReadOnlyRootStationGroup: true,
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
  const stationsMapData: StationMapData[] = [
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
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: MapService, useClass: MockMapService }],
    });
    service = TestBed.inject(StationGroupElementService);
    mapService = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate the slope between two points', () => {
    const pointStart: Point = { x: 10.1, y: -5.1 };
    const pointEnd: Point = { x: 29.0, y: -1.1 };

    const slopeExpect = 0.21;
    const slope = Number(service.slopeLine(pointStart, pointEnd).toFixed(2));
    expect(slope).toEqual(slopeExpect);
    const slopePi = service.slopeLine(pointStart, pointStart);
    expect(Math.abs(slopePi)).toEqual(Math.PI / 2);
  });

  it('should move a point by the x-coordinate over the line', () => {
    const pointStart: Point = { x: 10.1, y: -5.1 };
    const pointEnd: Point = { x: 29.0, y: -1.1 };
    const pointExpectX: Point = {
      x: pointStart.x + GROUP_CHARACTER_SIZE,
      y:
        service.slopeLine(pointStart, pointEnd) *
          (pointStart.x + GROUP_CHARACTER_SIZE - pointEnd.x) +
        pointEnd.y,
    };
    const movedPointInX = service.movePointOnLine(
      pointStart,
      pointEnd,
      GROUP_CHARACTER_SIZE
    );

    expect(movedPointInX).toEqual(pointExpectX);
  });

  it('should move a point by the y-coordinate over the line', () => {
    const pointStart: Point = { x: 10.1, y: -5.1 };
    const pointEnd: Point = { x: 29.0, y: -1.1 };
    const pointExpectY: Point = {
      x:
        (pointStart.y + GROUP_CHARACTER_SIZE - pointEnd.y) /
          service.slopeLine(pointStart, pointEnd) +
        pointEnd.x,
      y: pointStart.y + GROUP_CHARACTER_SIZE,
    };
    const movedPointInY = service.movePointOnLine(
      pointStart,
      pointEnd,
      GROUP_CHARACTER_SIZE,
      false
    );

    expect(movedPointInY).toEqual(pointExpectY);
  });

  it('should return the position of the points that make the first straight line', () => {
    service.canvasDimensions = {
      width: 1200,
      height: 500,
    };
    const points: Point[] = [
      { x: 296.64472347020927, y: 518.1905987569099 },
      { x: 456.4144630483116, y: 570.1704797840323 },
      { x: 583.354804082968, y: 578.9249860622845 },
      { x: 714.6723982567509, y: 578.9249860622845 },
      { x: 916.026042656551, y: 570.1704797840323 },
      { x: 972.9303334651902, y: 139.55820222250316 },
      { x: 972.9303334651902, y: 57.48470586388896 },
      { x: 863.4990049870379, y: 57.48470586388896 },
      { x: 296.64472347020927, y: 436.11710239829574 },
    ];
    const titleWidth = 77.92393493652344;
    const positionExpect = 7;
    const position = service.positionStraightestLine(points, titleWidth);
    expect(position).toEqual(positionExpect);
  });

  it('should return the distance between two points', () => {
    const pointStart: Point = { x: 10.1, y: -5.1 };
    const pointEnd: Point = { x: 29.0, y: -1.1 };
    const distanceExpect = 19.32;
    const distance = Number(
      service.distanceBetweenTwoPoints(pointStart, pointEnd).toFixed(2)
    );
    expect(distance).toEqual(distanceExpect);
  });

  it('should compare and order the points', () => {
    const points: Point[] = [
      { x: 97, y: -216 },
      { x: 125, y: 223 },
      { x: 240, y: 129 },
      { x: 74, y: 56 },
      { x: 240, y: 87 },
      { x: 219, y: -210 },
      { x: -186, y: -3 },
      { x: -91, y: 194 },
      { x: -104, y: 299 },
      { x: 222, y: -152 },
    ];
    const expectPoints: Point[] = [
      { x: -186, y: -3 },
      { x: -104, y: 299 },
      { x: -91, y: 194 },
      { x: 74, y: 56 },
      { x: 97, y: -216 },
      { x: 125, y: 223 },
      { x: 219, y: -210 },
      { x: 222, y: -152 },
      { x: 240, y: 87 },
      { x: 240, y: 129 },
    ];
    points.sort(service.comparePoints);
    expect(points).toEqual(expectPoints);
  });

  it('should call of the method drawStationGroups', () => {
    mapService.stationGroupElements = stationGroupsMapData.map(
      (e) => new StationGroupMapElement(e)
    );

    const drawStationGroupSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'drawStationGroup'
    );
    service.drawStationGroups();
    expect(drawStationGroupSpy).toHaveBeenCalledOnceWith(
      mapService.stationGroupElements[0]
    );
  });

  it('should get the station points for a station group', () => {
    const stationGroup = new StationGroupMapElement(stationGroupsMapData[0]);

    mapService.stationElements = stationsMapData.map(
      (e) => new StationMapElement(e)
    );

    const expectPositionStations = [0, 2];
    const expectPoints: Point[] = [];
    expectPositionStations.forEach((positionStation) => {
      const scaledPadding = STATION_GROUP_PADDING * mapService.mapScale$.value;
      const maxX =
        mapService.stationElements[positionStation].canvasPoint.x +
        STATION_WIDTH * mapService.mapScale$.value;
      const maxY =
        mapService.stationElements[positionStation].canvasPoint.y +
        STATION_HEIGHT * mapService.mapScale$.value;
      expectPoints.push(
        {
          x:
            mapService.stationElements[positionStation].canvasPoint.x -
            scaledPadding,
          y:
            mapService.stationElements[positionStation].canvasPoint.y -
            scaledPadding,
          corner: Corner.TopLeft,
        },
        {
          x: maxX + scaledPadding,
          y:
            mapService.stationElements[positionStation].canvasPoint.y -
            scaledPadding,
          corner: Corner.TopRight,
        },
        {
          x:
            mapService.stationElements[positionStation].canvasPoint.x -
            scaledPadding,
          y: maxY + scaledPadding,
          corner: Corner.BottomLeft,
        },
        {
          x: maxX + scaledPadding,
          y: maxY + scaledPadding,
          corner: Corner.BottomRight,
        }
      );
    });

    const points = service.getStationPointsForStationGroup(stationGroup);
    expect(points).toEqual(expectPoints);
  });

  it('should get padding a station group', () => {
    const points: Point[] = [
      { x: -186, y: -3, corner: Corner.BottomLeft },
      { x: -104, y: 299, corner: Corner.BottomLeft },
      { x: -91, y: 194, corner: Corner.BottomRight },
      { x: 74, y: 56, corner: Corner.BottomRight },
      { x: 97, y: -216, corner: Corner.BottomRight },
      { x: 125, y: 223, corner: Corner.TopRight },
      { x: 219, y: -210, corner: Corner.TopRight },
      { x: 222, y: -152, corner: Corner.BottomRight },
      { x: 240, y: 87, corner: Corner.TopLeft },
      { x: 240, y: 129, corner: Corner.TopLeft },
    ];
    const padding = STATION_GROUP_PADDING * mapService.mapScale$.value;
    const expectPoints: Point[] = [
      { x: -186 - padding, y: -3 + padding, corner: Corner.BottomLeft },
      { x: -104 - padding, y: 299 + padding, corner: Corner.BottomLeft },
      { x: -91 + padding, y: 194 + padding, corner: Corner.BottomRight },
      { x: 74 + padding, y: 56 + padding, corner: Corner.BottomRight },
      { x: 97 + padding, y: -216 + padding, corner: Corner.BottomRight },
      { x: 125 + padding, y: 223 - padding, corner: Corner.TopRight },
      { x: 219 + padding, y: -210 - padding, corner: Corner.TopRight },
      { x: 222 + padding, y: -152 + padding, corner: Corner.BottomRight },
      { x: 240 - padding, y: 87 - padding, corner: Corner.TopLeft },
      { x: 240 - padding, y: 129 - padding, corner: Corner.TopLeft },
    ];
    const newPoints = service.getPaddedStationGroupBoundaryPoints(points);
    expect(newPoints).toEqual(expectPoints);
  });

  it('should call method getPaddedStationGroupBoundaryPoints for a sub station group', () => {
    mapService.stationGroupElements = stationGroupsMapData.map(
      (e) => new StationGroupMapElement(e)
    );

    const getPaddedStationGroupBoundaryPointsSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'getPaddedStationGroupBoundaryPoints'
    ).and.callFake(() => []);

    service.getSubStationGroupPointsForStationGroup(
      mapService.stationGroupElements[0]
    );

    expect(getPaddedStationGroupBoundaryPointsSpy).toHaveBeenCalled();
    expect(getPaddedStationGroupBoundaryPointsSpy).toHaveBeenCalledTimes(2);
  });

  it('should get convex hull for a station group', () => {
    const getConvexHullPresortedSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'getConvexHullPresorted'
    ).and.callThrough();
    const comparePointsSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'comparePoints'
    ).and.callThrough();

    const points: Point[] = [
      { x: 97, y: -216 },
      { x: 125, y: 223 },
      { x: 240, y: 129 },
      { x: 74, y: 56 },
      { x: 240, y: 87 },
      { x: 219, y: -210 },
      { x: -186, y: -3 },
      { x: -91, y: 194 },
      { x: -104, y: 299 },
      { x: 222, y: -152 },
    ];
    const expectPoints: Point[] = [
      { x: -186, y: -3 },
      { x: -104, y: 299 },
      { x: 125, y: 223 },
      { x: 240, y: 129 },
      { x: 240, y: 87 },
      { x: 219, y: -210 },
      { x: 97, y: -216 },
    ];
    const convexPoints = service.getConvexHull(points);
    expect(comparePointsSpy).toHaveBeenCalled();
    expect(getConvexHullPresortedSpy).toHaveBeenCalled();
    expect(convexPoints).toEqual(expectPoints);
  });

  it('should call of the method animatePendingGroup', () => {
    service.animatePendingGroup();
    expect(service['offset']).toBe(1);
    for (let i = 1; i < 15; i++) {
      service.animatePendingGroup();
    }
    expect(service['offset']).toBe(0);
  });

  it('should call all methods inside drawStationGroup', () => {
    mapService.stationGroupElements = stationGroupsMapData.map(
      (e) => new StationGroupMapElement(e)
    );
    const getStationPointsForStationGroupSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'getStationPointsForStationGroup'
    ).and.callFake(() => []);
    const getSubStationGroupPointsForStationGroupSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'getSubStationGroupPointsForStationGroup'
    ).and.callFake(() => []);
    const getConvexHullSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'getConvexHull'
    ).and.callFake(() => [
      { x: -186, y: -3 },
      { x: -104, y: 299 },
      { x: 125, y: 223 },
      { x: 240, y: 129 },
      { x: 240, y: 87 },
      { x: 219, y: -210 },
      { x: 97, y: -216 },
    ]);
    const setStationGroupBoundaryPathSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'setStationGroupBoundaryPath'
    );
    const drawStationGroupBoundaryLineSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'drawStationGroupBoundaryLine'
    );
    const drawStationGroupNameSpy = spyOn(
      TestBed.inject(StationGroupElementService),
      'drawStationGroupName'
    );
    mapService.mapScale$.next(SCALE_RENDER_STATION_ELEMENTS);
    service.drawStationGroup(mapService.stationGroupElements[0]);
    // When the station group name isn't visible.
    expect(getStationPointsForStationGroupSpy).toHaveBeenCalled();
    expect(getSubStationGroupPointsForStationGroupSpy).toHaveBeenCalled();
    expect(getConvexHullSpy).toHaveBeenCalled();
    expect(setStationGroupBoundaryPathSpy).toHaveBeenCalled();
    expect(drawStationGroupBoundaryLineSpy).toHaveBeenCalled();
    expect(drawStationGroupNameSpy).not.toHaveBeenCalled();

    // When the station group name is visible.
    mapService.mapScale$.next(DEFAULT_SCALE);
    service.drawStationGroup(mapService.stationGroupElements[0]);
    expect(getStationPointsForStationGroupSpy).toHaveBeenCalledTimes(2);
    expect(getSubStationGroupPointsForStationGroupSpy).toHaveBeenCalledTimes(2);
    expect(getConvexHullSpy).toHaveBeenCalledTimes(2);
    expect(setStationGroupBoundaryPathSpy).toHaveBeenCalledTimes(2);
    expect(drawStationGroupBoundaryLineSpy).toHaveBeenCalledTimes(2);
    expect(drawStationGroupNameSpy).toHaveBeenCalled();
  });

  it('should return Throw Error in the method drawStationGroupBoundaryLine', () => {
    const stationGroup = new StationGroupMapElement(stationGroupsMapData[0]);
    expect(() => service.drawStationGroupBoundaryLine(stationGroup)).toThrow(
      new Error(
        'Cannot draw station group boundary line if context is not defined'
      )
    );
  });

  it('should return Throw Error in the method paintOrDeleteLineStationGroupName', () => {
    const stationGroup = new StationGroupMapElement(stationGroupsMapData[0]);
    expect(() =>
      service.paintOrDeleteLineStationGroupName(
        'title',
        { x: 20, y: 10 },
        { x: 15, y: 5 },
        stationGroup,
        true
      )
    ).toThrow(
      new Error(
        'Cannot paint or delete station group name on line if context is not defined'
      )
    );
  });

  it('should return Throw Error in the method splitStationGroupName', () => {
    expect(() =>
      service.splitStationGroupName('title', 1, [
        { x: 30, y: 10 },
        { x: 20, y: 10 },
        { x: 50, y: 6 },
      ])
    ).toThrow(
      new Error('Cannot split station group name if context is not defined')
    );
  });

  it('should return Throw Error in the method drawStationGroupIcon', () => {
    const stationGroup = new StationGroupMapElement(stationGroupsMapData[0]);
    expect(() =>
      service.drawStationGroupIcon(
        { x: 20, y: 10 },
        { x: 15, y: 5 },
        5,
        StationGroupElementHoverItem.ButtonAccept,
        ICON_STATION_GROUP_ACCEPT,
        MAP_SELECTED,
        stationGroup
      )
    ).toThrow(
      new Error('Cannot draw station group icon if context is not defined')
    );
  });

  it('should return Throw Error in the method drawStationGroupName', () => {
    const stationGroup = new StationGroupMapElement(stationGroupsMapData[0]);
    expect(() => service.drawStationGroupName(stationGroup)).toThrow(
      new Error('Cannot draw station group name if context is not defined')
    );
  });

  it('should return Throw Error in the method drawStationGroupToolTip', () => {
    const pointStart = { x: 0, y: 0 };
    expect(() => service.drawStationGroupToolTip(pointStart)).toThrow(
      new Error('Cannot draw the tooltip if context is not defined')
    );
  });
});
