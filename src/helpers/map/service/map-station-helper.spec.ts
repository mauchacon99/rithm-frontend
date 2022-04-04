import { MapStationHelper } from 'src/helpers';
import { MapHelper } from './map-helper';

describe('MapStationHelper', () => {
  let mapHelper: MapHelper;
  let mapStationHelper: MapStationHelper;

  beforeEach(() => {
    mapHelper = new MapHelper();
    mapStationHelper = new MapStationHelper(mapHelper);
  });

  it('should create an instance', () => {
    expect(mapStationHelper).toBeTruthy();
  });
});
