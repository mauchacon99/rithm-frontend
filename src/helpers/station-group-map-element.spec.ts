import { StationGroupMapData, MapItemStatus } from 'src/models';
import { StationGroupMapElement } from '.';

const TEST_STATION_GROUP_DATA: StationGroupMapData = {
  rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
  organizationRithmId: '9724A1FB-426D-4826-8FF2-F0752979155E',
  title: 'Test Station Group',
  stations: [
    '3a97bead-e698-45ea-a1d9-51f4513a909a',
    '6D8976EF-F9A2-40E3-957E-CAAAE2AA2DA8',
  ],
  subStationGroups: ['9724A1FB-426D-4826-8FF2-F0752979155E'],
  status: MapItemStatus.Normal,
  isReadOnlyRootStationGroup: false,
};

describe('StationGroupMapElement', () => {
  let stationGroup: StationGroupMapElement;

  beforeEach(() => {
    stationGroup = new StationGroupMapElement(TEST_STATION_GROUP_DATA);
  });

  it('should create an instance', () => {
    expect(stationGroup).toBeTruthy();
  });

  it('should be marked as deleted', () => {
    stationGroup.markAsDeleted();
    expect(stationGroup.status).toEqual(MapItemStatus.Deleted);
  });

  it('should throw an error when marking it as deleted when it is newly created', () => {
    stationGroup.status = MapItemStatus.Created;
    expect(() => stationGroup.markAsDeleted()).toThrowError();
    expect(stationGroup.status).toEqual(MapItemStatus.Created);
  });

  it('should be marked as updated', () => {
    stationGroup.markAsUpdated();
    expect(stationGroup.status).toEqual(MapItemStatus.Updated);
  });

  it('should not be marked as updated when it has been deleted already', () => {
    stationGroup.status = MapItemStatus.Deleted;
    stationGroup.markAsUpdated();
    expect(stationGroup.status).toEqual(MapItemStatus.Deleted);
  });

  it('should not be marked as updated when it has been newly created', () => {
    stationGroup.status = MapItemStatus.Created;
    stationGroup.markAsUpdated();
    expect(stationGroup.status).toEqual(MapItemStatus.Created);
  });

  it('should be empty if there are no stations or sub groups within', () => {
    stationGroup.stations = [];
    stationGroup.subStationGroups = [];
    expect(stationGroup.isEmpty).toBeTrue();
  });

  it('should not be empty if there are stations contained', () => {
    stationGroup.subStationGroups = [];
    expect(stationGroup.isEmpty).toBeFalse();
  });

  it('should not be empty if there are sub groups contained', () => {
    stationGroup.stations = [];
    expect(stationGroup.isEmpty).toBeFalse();
  });

  xit('should report hover of boundary when the point is over the station group boundary', () => {
    // TODO: add test
  });

  xit('should report hover of title when the point is over the station group title', () => {
    // TODO: add test
  });

  xit("should report hover of none when the point isn't over anything specifically", () => {
    // TODO: add test
  });

  xit('should report that a station group is identical to itself', () => {
    // TODO: add test
  });

  xit('should report that a station group is different from itself', () => {
    // TODO: add test
  });
});
