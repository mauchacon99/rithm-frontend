import { MapItemStatus, StationMapData } from 'src/models';
import { StationMapElement } from './station-map-element';

const TEST_STATION_MAP_DATA: StationMapData = {
  rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
  stationName: 'Test Station',
  mapPoint: { x: 0, y: 0 },
  nextStations: [],
  previousStations: [],
  noOfDocuments: 5,
  status: MapItemStatus.Normal,
  notes: ''
};

describe('StationMapElement', () => {
  it('should create an instance', () => {
    expect(new StationMapElement(TEST_STATION_MAP_DATA)).toBeTruthy();
  });
});
