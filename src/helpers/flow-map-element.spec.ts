import { FlowMapData, MapItemStatus } from 'src/models';
import { FlowMapElement } from '.';

const TEST_FLOW_DATA: FlowMapData = {
  rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
  organizationRithmId: '9724A1FB-426D-4826-8FF2-F0752979155E',
  title: 'Test Flow',
  stations: [
    '3a97bead-e698-45ea-a1d9-51f4513a909a',
    '6D8976EF-F9A2-40E3-957E-CAAAE2AA2DA8',
  ],
  subFlows: ['9724A1FB-426D-4826-8FF2-F0752979155E'],
  status: MapItemStatus.Normal,
  isReadOnlyRootFlow: false,
};

describe('FlowMapElement', () => {
  let flow: FlowMapElement;

  beforeEach(() => {
    flow = new FlowMapElement(TEST_FLOW_DATA);
  });

  it('should create an instance', () => {
    expect(flow).toBeTruthy();
  });

  it('should be marked as deleted', () => {
    flow.markAsDeleted();
    expect(flow.status).toEqual(MapItemStatus.Deleted);
  });

  it('should throw an error when marking it as deleted when it is newly created', () => {
    flow.status = MapItemStatus.Created;
    expect(() => flow.markAsDeleted()).toThrowError();
    expect(flow.status).toEqual(MapItemStatus.Created);
  });

  it('should be marked as updated', () => {
    flow.markAsUpdated();
    expect(flow.status).toEqual(MapItemStatus.Updated);
  });

  it('should not be marked as updated when it has been deleted already', () => {
    flow.status = MapItemStatus.Deleted;
    flow.markAsUpdated();
    expect(flow.status).toEqual(MapItemStatus.Deleted);
  });

  it('should not be marked as updated when it has been newly created', () => {
    flow.status = MapItemStatus.Created;
    flow.markAsUpdated();
    expect(flow.status).toEqual(MapItemStatus.Created);
  });

  it('should be empty if there are no stations or sub groups within', () => {
    flow.stations = [];
    flow.subFlows = [];
    expect(flow.isEmpty).toBeTrue();
  });

  it('should not be empty if there are stations contained', () => {
    flow.subFlows = [];
    expect(flow.isEmpty).toBeFalse();
  });

  it('should not be empty if there are sub groups contained', () => {
    flow.stations = [];
    expect(flow.isEmpty).toBeFalse();
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
