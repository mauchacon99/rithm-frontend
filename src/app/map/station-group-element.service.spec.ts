import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockMapService } from 'src/mocks';

import { StationGroupElementService } from './station-group-element.service';
import { MapService } from './map.service';
import { Point } from 'src/models';
import { STATION_GROUP_NAME_TRANSLATE } from './map-constants';

describe('StationGroupElementService', () => {
  let service: StationGroupElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: MapService, useClass: MockMapService }],
    });
    service = TestBed.inject(StationGroupElementService);
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
    expect(slopePi).toEqual(Math.PI);
  });

  it('should move a point by the x-coordinate over the line', () => {
    const pointStart: Point = { x: 10.1, y: -5.1 };
    const pointEnd: Point = { x: 29.0, y: -1.1 };
    const pointExpectX: Point = {
      x: pointStart.x + STATION_GROUP_NAME_TRANSLATE,
      y:
        service.slopeLine(pointStart, pointEnd) *
          (pointStart.x + STATION_GROUP_NAME_TRANSLATE - pointEnd.x) +
        pointEnd.y,
    };
    const movedPointInX = service.movePointOnLine(
      pointStart,
      pointEnd,
      STATION_GROUP_NAME_TRANSLATE
    );

    expect(movedPointInX).toEqual(pointExpectX);
  });

  it('should move a point by the y-coordinate over the line', () => {
    const pointStart: Point = { x: 10.1, y: -5.1 };
    const pointEnd: Point = { x: 29.0, y: -1.1 };
    const pointExpectY: Point = {
      x:
        (pointStart.y + STATION_GROUP_NAME_TRANSLATE - pointEnd.y) /
          service.slopeLine(pointStart, pointEnd) +
        pointEnd.x,
      y: pointStart.y + STATION_GROUP_NAME_TRANSLATE,
    };
    const movedPointInY = service.movePointOnLine(
      pointStart,
      pointEnd,
      STATION_GROUP_NAME_TRANSLATE,
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
});
