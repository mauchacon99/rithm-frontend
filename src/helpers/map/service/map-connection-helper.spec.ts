import { MapConnectionHelper } from './map-connection-helper';
import { MapHelper } from './map-helper';

describe('MapConnectionHelper', () => {
  let mapHelper: MapHelper;
  let mapConnectionHelper: MapConnectionHelper;

  beforeEach(() => {
    mapHelper = new MapHelper();
    mapConnectionHelper = new MapConnectionHelper(mapHelper);
  });

  it('should create an instance', () => {
    expect(mapConnectionHelper).toBeTruthy();
  });
});
