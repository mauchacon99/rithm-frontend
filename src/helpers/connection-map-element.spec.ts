import { MapItemStatus, StationMapData } from 'src/models';
import { ConnectionMapElement, StationMapElement } from '.';

const TEST_STATION_DATA: StationMapData = {
  rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
  stationName: 'Test Station',
  mapPoint: { x: 0, y: 0 },
  nextStations: [],
  previousStations: [],
  noOfDocuments: 5,
  status: MapItemStatus.Normal,
  notes: ''
};

const TEST_STATION_1 = new StationMapElement(TEST_STATION_DATA);
const TEST_STATION_2 = new StationMapElement(TEST_STATION_DATA);

describe('ConnectionMapElement', () => {
  let connection: ConnectionMapElement;

  beforeEach(() => {
    connection = new ConnectionMapElement(TEST_STATION_1, TEST_STATION_2, 0);
  });

  it('should create an instance', () => {
    expect(connection).toBeTruthy();
  });

});
