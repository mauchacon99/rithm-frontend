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

});
