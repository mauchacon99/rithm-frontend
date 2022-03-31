import { MapHelper } from './map-helper';

describe('MapHelper', () => {
  let mapHelper: MapHelper;

  beforeEach(() => {
    mapHelper = new MapHelper();
  });

  it('should create an instance', () => {
    expect(mapHelper).toBeTruthy();
  });
});
