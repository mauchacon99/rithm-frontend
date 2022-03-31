import { CenterHelper } from './center-helper';
import { MapHelper } from './map-helper';
import { MapStationGroupHelper } from './map-station-group-helper';
import { MapStationHelper } from './map-station-helper';
import { ZoomHelper } from './zoom-helper';

describe('MapConnectionHelper', () => {
  let mapHelper: MapHelper;
  let mapStationHelper: MapStationHelper;
  let mapStationGroupHelper: MapStationGroupHelper;
  let zoomHelper: ZoomHelper;
  let centerHelper: CenterHelper;

  beforeEach(() => {
    mapHelper = new MapHelper();
    mapStationHelper = new MapStationHelper(mapHelper);
    mapStationGroupHelper = new MapStationGroupHelper(mapHelper);
    zoomHelper = new ZoomHelper(mapHelper);
    centerHelper = new CenterHelper(
      mapHelper,
      mapStationHelper,
      mapStationGroupHelper,
      zoomHelper
    );
  });

  it('should create an instance', () => {
    expect(centerHelper).toBeTruthy();
  });
});
