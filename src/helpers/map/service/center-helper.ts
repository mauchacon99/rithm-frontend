import { BehaviorSubject } from 'rxjs';
import {
  CENTER_ZOOM_BUFFER,
  MAX_SCALE,
  SCALE_REDUCED_RENDER,
  STATION_HEIGHT,
  STATION_PAN_CENTER_HEIGHT,
  STATION_PAN_CENTER_WIDTH,
  STATION_WIDTH,
  ZOOM_VELOCITY,
} from 'src/app/map/map-constants';
import { CenterPanType, Point } from 'src/models';
import { MapHelper } from './map-helper';
import { MapStationGroupHelper } from './map-station-group-helper';
import { MapStationHelper } from './map-station-helper';
import { ZoomHelper } from './zoom-helper';

/**
 * Represents methods that handle centering for the Map.
 */
export class CenterHelper {
  /** The number of times this.center() should be called. It will continually be incremented until centering is done.*/
  centerCount$ = new BehaviorSubject(0);

  /** Passes auto pan velocity for when the center button is pressed to the map-canvas. */
  centerPanVelocity$ = new BehaviorSubject<Point>({ x: 0, y: 0 });

  /** Checks if there should be panning towards the center of the map. */
  centerActive$ = new BehaviorSubject(false);

  constructor(
    private mapHelper: MapHelper,
    private mapStationHelper: MapStationHelper,
    private mapStationGroupHelper: MapStationGroupHelper,
    private zoomHelper: ZoomHelper
  ) {}

  /**
   * Set a bounding box around the edge of the map to calculate centering the map.
   * Used to put some space between minMapPoints/maxMapPoints and the screen edges.
   *
   * @returns A number representing how for out from the edge of the screen a box should be.
   */
  centerBoundingBox(): number {
    /*TODO: change name of method and related terminology to avoid confusion with the boundary box.
    For now: *bounding box* refers to an invisible box that tracks if any stations are placed outside it, then triggers a function.
    *boundary box* is a visible box surrounding a user's map that prevents stations from being placed too far away.*/

    //Dynamically set the size of the bounding box based on screen size.
    if (((window.innerHeight + window.innerWidth) / 2) * 0.01 < 30) {
      //Set the size of the box based on screen size.
      return Math.floor(((window.innerHeight + window.innerWidth) / 2) * 0.01);
    } else {
      //If a screen is above a certain size just return 30.
      return 30;
    }
  }

  /**
   * Scales the map when center method is called to allow as many stations as possible to be visible.
   *
   * @param onInit Determines if this is called during mapCanvas init.
   */
  centerScale(onInit = false): void {
    //TODO: This method needs work in general. It especially needs help when used in conjunction with centerPan().
    if (!this.mapHelper.canvasContext) {
      throw new Error(
        'Cannot get center point of canvas when canvas context is not set'
      );
    }

    if (!this.mapHelper.boundaryElement) {
      throw new Error(
        'Cannot get center point of map if map boundaries are not defined.'
      );
    }

    //Get correct size of the canvas.
    const canvasBoundingRect =
      this.mapHelper.canvasContext.canvas.getBoundingClientRect();

    //Get the canvas points of the top-left corner and bottom-right corner of the map.
    const minPoint = this.mapHelper.boundaryElement.minCanvasPoint;
    const maxPoint = this.mapHelper.boundaryElement.maxCanvasPoint;

    //Get the DPI of the screen.
    const pixelRatio = window.devicePixelRatio || 1;
    /* Zooming in and zooming out need to have different sized bounding boxes to work.
    So we have a buffer const that is the difference between the two. */
    const zoomInBox =
      (this.centerBoundingBox() + CENTER_ZOOM_BUFFER) * pixelRatio;
    const zoomOutBox =
      (this.centerBoundingBox() - CENTER_ZOOM_BUFFER) * pixelRatio;

    //Zoom in.
    /* If the topmost, the bottommost, rightmost, and leftmost station are all within the bounding box,
    and mapScale isn't at max scale yet.
    OR mapScale is less than the scale set as the preferred scale.*/
    if (
      (zoomInBox < minPoint.y &&
        canvasBoundingRect.height - zoomInBox > maxPoint.y + STATION_HEIGHT &&
        canvasBoundingRect.width - zoomInBox > maxPoint.x + STATION_WIDTH &&
        zoomInBox < minPoint.x &&
        this.mapHelper.mapScale$.value < MAX_SCALE) ||
      this.mapHelper.mapScale$.value < SCALE_REDUCED_RENDER
    ) {
      //Increment the zoomCount. This lets handleZoom know we need to zoom in.
      this.zoomHelper.zoomCount$.next(this.zoomHelper.zoomCount$.value + 1);
      //Increment the centerCount. This lets the center method know we aren't done centering.
      this.centerCount$.next(this.centerCount$.value + 1);
      //Call handleZoom with onInit in order to determine whether there should be a delay in zooming.
      this.zoomHelper.handleZoom(onInit);
      //Zoom out.
      /* If the topmost, the bottommost, rightmost, or leftmost station are outside the bounding box,
    AND mapScale is bigger than the scale set as the preferred  scale. */
    } else if (
      (zoomOutBox > minPoint.y ||
        canvasBoundingRect.height - zoomOutBox < maxPoint.y + STATION_HEIGHT ||
        canvasBoundingRect.width - zoomOutBox < maxPoint.x + STATION_WIDTH ||
        zoomOutBox > minPoint.x) &&
      this.mapHelper.mapScale$.value > SCALE_REDUCED_RENDER / ZOOM_VELOCITY
    ) {
      //Decrement the zoomCount. This lets handleZoom know we need to zoom out.
      this.zoomHelper.zoomCount$.next(this.zoomHelper.zoomCount$.value - 1);
      //Increment the centerCount. This lets the center method know we aren't done centering.
      this.centerCount$.next(this.centerCount$.value + 1);
      //Call handleZoom with onInit in order to determine whether there should be a delay in zooming.
      this.zoomHelper.handleZoom(onInit);
    }
  }

  /**
   * Gets center canvas point of either station or station group or map center which should be pan.
   *
   * @param panType Determines the area of the map to be pan to center.
   * @param drawerWidth Width of the opened drawer.
   * @returns Returns true if no stations are updated and false if any station is updated.
   */
  getAdjustedCenter(panType: CenterPanType, drawerWidth: number): Point {
    let adjustedCenter = { x: 0, y: 0 };
    //Get the point that currentCanvasPoint needs to be set to.
    const canvasCenter = this.mapHelper.getCanvasCenterPoint();

    //If selected station group needs to be pan to center.
    if (panType === CenterPanType.StationGroup) {
      const openedStationGroups =
        this.mapStationGroupHelper.stationGroupElements.find(
          (e) => e.drawerOpened
        );
      if (!openedStationGroups) {
        throw new Error('There is no selected station group for center pan');
      }
      const updatedBoundaryPoints = [...openedStationGroups.boundaryPoints];
      const minX = Math.min(...updatedBoundaryPoints.map((point) => point.x));
      const maxX = Math.max(...updatedBoundaryPoints.map((point) => point.x));
      const minY = Math.min(...updatedBoundaryPoints.map((point) => point.y));
      const maxY = Math.max(...updatedBoundaryPoints.map((point) => point.y));

      //Determine the map center point of station group to pan it to the center.
      const groupCenterMapPoint = this.mapHelper.getMapPoint({
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
      });

      //Determine the canvas point of station group to pan it to the center.
      adjustedCenter = {
        x:
          groupCenterMapPoint.x +
          drawerWidth / 2 / this.mapHelper.mapScale$.value -
          canvasCenter.x / this.mapHelper.mapScale$.value,
        y:
          groupCenterMapPoint.y -
          canvasCenter.y / this.mapHelper.mapScale$.value,
      };
      //If selected station needs to be pan to center.
    } else if (panType === CenterPanType.Station) {
      const openedStation = this.mapStationHelper.stationElements.find(
        (e) => e.drawerOpened
      );
      if (!openedStation) {
        throw new Error('There is no selected station for center pan');
      }
      //Determine the canvas point of station to pan it to the center.
      adjustedCenter = {
        x:
          openedStation.mapPoint.x +
          drawerWidth / 2 / this.mapHelper.mapScale$.value +
          STATION_PAN_CENTER_WIDTH / this.mapHelper.mapScale$.value -
          canvasCenter.x / this.mapHelper.mapScale$.value,
        y:
          openedStation.mapPoint.y +
          STATION_PAN_CENTER_HEIGHT / this.mapHelper.mapScale$.value -
          canvasCenter.y / this.mapHelper.mapScale$.value,
      };
      //If selected map center needs to be pan to center.
    } else if (panType === CenterPanType.MapCenter) {
      //Get the center of the map and the center of the canvas.
      adjustedCenter = this.mapHelper.getMapCenterPoint();

      //Get the point that currentCanvasPoint needs to be set to.
      adjustedCenter = {
        x: adjustedCenter.x - canvasCenter.x / this.mapHelper.mapScale$.value,
        y: adjustedCenter.y - canvasCenter.y / this.mapHelper.mapScale$.value,
      };
    }
    return adjustedCenter;
  }

  /**
   * Pans the map when center method is called to the map center or station or station group.
   *
   * @param panType Determines the area of the map to be pan to center..
   * @param drawerWidth Width of the opened drawer.
   * @param onInit Determines if this is called during mapCanvas init.
   */
  centerPan(panType: CenterPanType, drawerWidth = 0, onInit = false): void {
    //Get the point that currentCanvasPoint needs to be set to.
    const adjustedCenter = this.getAdjustedCenter(panType, drawerWidth);

    //On Init, immediately set the currentCanvasPoint to the center of the map.
    if (onInit) {
      this.mapHelper.currentCanvasPoint$.next(adjustedCenter);
      return;
    }

    //How far away is the currentCanvasPoint from the map center?
    const totalPanNeeded = {
      x: this.mapHelper.currentCanvasPoint$.value.x - adjustedCenter.x,
      y: this.mapHelper.currentCanvasPoint$.value.y - adjustedCenter.y,
    };

    //initialize variable needed to set panVelocity.
    const panAmount: Point = { x: 0, y: 0 };

    //Set x axis of panAmount as 1% of totalPanNeeded.
    panAmount.x = totalPanNeeded.x * 0.1;

    //Set y axis of panAmount as 1% of totalPanNeeded.
    panAmount.y = totalPanNeeded.y * 0.1;

    /* In order to have a fade out animation effect we exponentially decrement the totalPanNeeded with each recursive call of centerPan().
    This means that panAmount wil never reach 0, so we need to decide on a number thats close enough.
    If we waited for 0 we'd get caught in an infinite loop.
    The number settled on for now is .12. */
    if (Math.abs(panAmount.x) >= 0.12 || Math.abs(panAmount.y) >= 0.12) {
      //nextPanVelocity on map canvas will be set to this.
      this.centerPanVelocity$.next(panAmount);
      //Increment the centerCount. This lets the center method know we aren't done centering.
      this.centerCount$.next(this.centerCount$.value + 1);
    } else {
      //After the animation is finished, jump to the map center.
      this.mapHelper.currentCanvasPoint$.next(adjustedCenter);
      //Cancel panning by setting panVelocity to 0,0.
      this.centerPanVelocity$.next({ x: 0, y: 0 });
    }
  }

  /**
   * Smoothly sets the scale and pans the map or station or station group to center.
   * On init, immediately change the scale and position.
   *
   * @param panType Determines the area of the map to be pan to center.
   * @param drawerWidth Width of the opened drawer.
   * @param onInit Determines if this is called during mapCanvas init.
   */
  center(panType: CenterPanType, drawerWidth = 0, onInit = false): void {
    //If there are no stations to center around, do nothing.
    if (
      panType === CenterPanType.Station &&
      this.mapStationHelper.stationElements.length === 0
    ) {
      return;
    }

    //If there are no station groups to center around, do nothing.
    if (
      panType === CenterPanType.StationGroup &&
      this.mapStationGroupHelper.stationGroupElements.length === 0
    ) {
      return;
    }

    //We put our logic in a const so we can call it later.
    const centerLogic = () => {
      //If there is still centering that needs to be done.
      if (this.centerCount$.value > 0) {
        /* Smoothly change the scale of the map.
        TODO: The performance on centerScale isn't up to par,
        so it is disabled when not onInit until we can spend some time improving it. */
        if (onInit) {
          this.centerScale(onInit);
        }
        //Smoothly pan to the center.
        this.centerPan(panType, drawerWidth, onInit);
        //Decrement centerCount to note that we've moved a step further to the center.
        this.centerCount$.next(this.centerCount$.value - 1);
        //Recursively call method so we can animate a smooth pan and scale.
        this.center(panType, drawerWidth, onInit);
        //If centering is finished.
      } else {
        //Reset properties that mark that more centering needs to happen.
        this.centerActive$.next(false);
        this.centerCount$.next(0);
        if (panType === CenterPanType.Station) {
          this.mapStationHelper.stationCenter$.next(true);
        }
      }
    };

    //End method if centerActive is false.
    if (!this.centerActive$.value) {
      return;
    }

    //If center is being done after map-canvas has already been initialized, animate centering.
    if (!onInit) {
      //Use a setTimeout on centering so that center is animated.
      setTimeout(() => {
        centerLogic();
      }, 4);
    } else {
      //Don't use setTimeout so that centering is instant.
      centerLogic();
    }
  }

  /**
   * Checks the map when station is selected and its in the center of the map.
   *
   * @param panType Determines the area of the map to be pan to center.
   * @param drawerWidth Width of the opened drawer.
   * @returns True if the option is a selected station is center of the map.
   */
  checkCenter(panType: CenterPanType, drawerWidth = 0): boolean {
    const adjustCenter = this.getAdjustedCenter(panType, drawerWidth);
    const canvasPoint = this.mapHelper.currentCanvasPoint$.value;
    return adjustCenter.x === canvasPoint.x && adjustCenter.y === canvasPoint.y;
  }
}
