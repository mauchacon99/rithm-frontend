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
  subFlows: [
    '9724A1FB-426D-4826-8FF2-F0752979155E'
  ],
  status: MapItemStatus.Normal,
  isReadOnlyRootFlow: false
};

describe('FlowMapElement', () => {
  let flow: FlowMapElement;

  beforeEach(() => {
    flow = new FlowMapElement(TEST_FLOW_DATA);
  });

  it('should create an instance', () => {
    expect(flow).toBeTruthy();
  });

  xit('should be marked as deleted', () => {
    // TODO: add test
  });

  xit('should throw an error when marking it as deleted when it is newly created', () => {
    // TODO: add test
  });

  xit('should be marked as updated', () => {
    // TODO: add test
  });

  xit('should not be marked as updated when it has been deleted', () => {
    // TODO: add test
  });

  xit('should not be marked as updated when it has been newly created', () => {
    // TODO: add test
  });

  xit('should be empty if there are no stations or sub groups within', () => {
    // TODO: add test
  });

  xit('should not be empty if there are stations contained', () => {
    // TODO: add test
  });

  xit('should not be empty if there are sub groups contained', () => {
    // TODO: add test
  });

  xit('should report hover of boundary when the point is over the station group boundary', () => {
    // TODO: add test
  });

  xit('should report hover of title when the point is over the station group title', () => {
    // TODO: add test
  });

  xit('should report hover of none when the point isn\'t over anything specifically', () => {
    // TODO: add test
  });

  xit('should report that a flow is identical to itself', () => {
    // TODO: add test
  });

  xit('should report that a flow is non-identical to itself', () => {
    // TODO: add test
  });

});
