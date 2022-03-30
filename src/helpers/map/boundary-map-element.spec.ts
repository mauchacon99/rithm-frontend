import { MapItemStatus, StationMapData } from 'src/models';
import { BoundaryMapElement, StationMapElement } from '..';

const TEST_STATIONS_DATA: StationMapData[] = [
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

const TEST_STATIONS = TEST_STATIONS_DATA.map((e) => new StationMapElement(e));

describe('BoundaryMapElement', () => {
  let boundary: BoundaryMapElement;

  beforeEach(() => {
    boundary = new BoundaryMapElement(TEST_STATIONS);
  });

  it('should create an instance', () => {
    expect(boundary).toBeTruthy();
  });
});
