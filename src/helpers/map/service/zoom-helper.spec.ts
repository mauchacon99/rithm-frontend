import { MapHelper } from './map-helper';
import { ZoomHelper } from './zoom-helper';

describe('ZoomHelper', () => {
  let mapHelper: MapHelper;
  let zoomHelper: ZoomHelper;

  beforeEach(() => {
    mapHelper = new MapHelper();
    zoomHelper = new ZoomHelper(mapHelper);
  });

  it('should create an instance', () => {
    expect(zoomHelper).toBeTruthy();
  });
});
