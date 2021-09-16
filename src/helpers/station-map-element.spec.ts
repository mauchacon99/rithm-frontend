import { StationMapData } from 'src/models';
import { StationMapElement } from './station-map-element';

const TEST_STATION_MAP_DATA: StationMapData = {
  name: 'Test Station',
  mapPoint: { x: 0, y: 0 },
  outgoingStationIds: [],
  incomingStationIds: [],
  numberOfDocuments: 5
};

describe('StationMapElement', () => {
  it('should create an instance', () => {
    expect(new StationMapElement(TEST_STATION_MAP_DATA)).toBeTruthy();
  });
});
