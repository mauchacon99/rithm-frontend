import { MapHelper } from './map-helper';
import { MapStationGroupHelper } from './map-station-group-helper';

describe('MapStationGroupHelper', () => {
  let mapHelper: MapHelper;
  let mapStationGroupHelper: MapStationGroupHelper;

  beforeEach(() => {
    mapHelper = new MapHelper();
    mapStationGroupHelper = new MapStationGroupHelper(mapHelper);
  });

  it('should create an instance', () => {
    expect(mapStationGroupHelper).toBeTruthy();
  });
});
