import { BehaviorSubject } from 'rxjs';
import {
  ABOVE_MAX,
  BELOW_MIN,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_RENDER_STATION_ELEMENTS,
  ZOOM_VELOCITY,
} from 'src/app/map/map-constants';
import { MapMode } from 'src/models';
import { MapHelper } from './map-helper';

/**
 * Represents methods that handle zooming for the Map.
 */
export class ZoomHelper {
  /**
   * The number of zoom levels to increment or decrement.
   * Scale should be slowly changed as this happens.
   */
  zoomCount$ = new BehaviorSubject(0);

  constructor(private mapHelper: MapHelper) {}

  /**
   * Zooms the map by adjusting the map scale and position.
   *
   * @param zoomingIn Zooming in or out?
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   * @param zoomAmount How much to zoom in/out.
   */
  zoom(
    zoomingIn: boolean,
    zoomOrigin = this.mapHelper.getCanvasCenterPoint(),
    zoomAmount = ZOOM_VELOCITY
  ): void {
    //Reset zoomCount and return if attempting to zoom past min or max scale.
    if (
      (this.mapHelper.mapScale$.value <= MIN_SCALE && !zoomingIn) ||
      (this.mapHelper.mapScale$.value >= MAX_SCALE && zoomingIn)
    ) {
      this.zoomCount$.next(0);
      return;
    }

    // Reset zoomCount and return if attempting to zoom out past a certain point while not in view mode.
    if (
      this.mapHelper.mapScale$.value <=
        SCALE_RENDER_STATION_ELEMENTS / zoomAmount &&
      !zoomingIn &&
      this.mapHelper.mapMode$.value !== MapMode.View
    ) {
      this.zoomCount$.next(0);
      return;
    }

    //Set so that we can move the currentCanvasPoint closer or further away based on zoom direction.
    const translateDirection = zoomingIn ? -1 : 1;

    /* What will we change the scale to when we're finished?
    When we zoom out we make the scale smaller, when we zoom in we make it larger.
    zoomAmount is set up to be exponential. */
    const newScale = zoomingIn
      ? this.mapHelper.mapScale$.value / zoomAmount
      : this.mapHelper.mapScale$.value * zoomAmount;

    //We have translateLogic in a const so that we don't have to repeat code for both x and y coords.
    const translateLogic = (zoom: boolean, coord: 'x' | 'y'): number => {
      //If zooming in.
      if (zoom) {
        //Return amount to translate a given coord based on the arithmetic.
        return Math.round(
          //current scale to new scale
          (zoomOrigin[coord] / this.mapHelper.mapScale$.value -
            zoomOrigin[coord] / newScale) *
            translateDirection
        );
        //If zooming out.
      } else {
        //Return amount to translate a given coord based on the arithmetic.
        return Math.round(
          //new scale to current scale
          (zoomOrigin[coord] / newScale -
            zoomOrigin[coord] / this.mapHelper.mapScale$.value) *
            translateDirection
        );
      }
    };

    //Subtract the number returned from translateLogic from x coord of currentCanvasPoint to pan the map that amount.
    this.mapHelper.currentCanvasPoint$.value.x -= translateLogic(
      zoomingIn,
      'x'
    );
    //Subtract the number returned from translateLogic from y coord of currentCanvasPoint to pan the map that amount.
    this.mapHelper.currentCanvasPoint$.value.y -= translateLogic(
      zoomingIn,
      'y'
    );

    //Set the mapScale to the new scale as long as it isn't above or below the max or min allowed.
    this.mapHelper.mapScale$.next(
      zoomingIn ? Math.min(ABOVE_MAX, newScale) : Math.max(BELOW_MIN, newScale)
    );
  }

  /**
   * Calls the zoom() method a number of times equal to the zoomCount.
   * This method is required for a smooth zoom, since we recursively call it every time the scale changes.
   *
   * @param pinch Remove delay if zoom is a pinch zoom.
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   */
  handleZoom(
    pinch: boolean,
    zoomOrigin = this.mapHelper.getCanvasCenterPoint()
  ): void {
    //We put our logic in a const so we can call it later.
    const zoomLogic = () => {
      //zoomCount can be positive or negative.
      //If zoomCount is positive, we're zooming in.
      if (this.zoomCount$.value > 0) {
        //run this.zoom(), marking it as zooming in.
        this.zoom(true, zoomOrigin);
        //Decrement the zoomCount. Getting it closer to 0.
        this.zoomCount$.next(this.zoomCount$.value - 1);
        //If zoomCount still isn't 0, recursively call this.handleZoom().
        if (this.zoomCount$.value > 0) {
          this.handleZoom(pinch, zoomOrigin);
        }
      }

      //If zoomCount is negative, we're zooming out.
      if (this.zoomCount$.value < 0) {
        //Run this.zoom(), marking it as zooming out.
        this.zoom(false, zoomOrigin);
        //Increment the zoomCount. Getting it closer to 0.
        this.zoomCount$.next(this.zoomCount$.value + 1);
        //If zoomCount still isn't 0, recursively call this.handleZoom().
        if (this.zoomCount$.value < 0) {
          this.handleZoom(pinch, zoomOrigin);
        }
      }
    };

    //When not a pinch to zoom.
    if (!pinch) {
      //delay calling zoomLogic so that we can get an animation effect from the zoom.
      setTimeout(
        () => {
          zoomLogic();
        },
        //We want to speed up the animation when zoomCount is higher, like when the zoom buttons are pressed.
        this.zoomCount$.value > 10 || this.zoomCount$.value < -10 ? 4 : 10
      );
    } else {
      //We don't want any delay in response when a user is doing a pinch to zoom.
      zoomLogic();
    }
  }
}
