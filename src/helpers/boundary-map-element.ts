import { STATION_HEIGHT, STATION_WIDTH } from "src/app/map/map-constants";
import { Point } from "src/models";
import { StationMapElement } from ".";

/**
 * Represents all information about the map boundary box.
 *
 */
export interface BoundaryMapElement {
  /** The top-left map point. */
  minMapPoint: Point;

  /** The bottom-right map point. */
  maxMapPoint: Point;

  /** The top-left canvas point. */
  minCanvasPoint: Point;

  /** The bottom-right canvas point. */
  maxCanvasPoint: Point;
}

/**
 * Represents all information about the map boundary box.
 */
export class BoundaryMapElement {
  /**
   * Creates a new 'BoundaryElement'.
   *
   * @param stationElements Should contain all the stations in the map.
   */
  constructor(
    stationElements: StationMapElement[],
  ) {
    this.minMapPoint = this.getMinMapPoint(stationElements);
    this.maxMapPoint = this.getMaxMapPoint(stationElements);
    this.minCanvasPoint = this.getMinMapPoint(stationElements);
    this.maxCanvasPoint = this.getMaxMapPoint(stationElements);
  }

  /**
   * Logic for finding top-left or bottom-right map points.
   *
   * @param stations The array of stations to check.
   * @param isMax Is the point the top-left corner of the map or the bottom-right? Bottom-right is the max.
   * @returns An object with the points.
   */
  private getEdgeMapPoint(
    stations: StationMapElement[],
    isMax: boolean
  ): Point {
    //An array of all station y coords in order from top to bottom.
    const orderedYPoints = stations
      .map((station) => station.mapPoint.y)
      .sort((a, b) => a - b);
    //An array of all station x coords in order from left to right.
    const orderedXPoints = stations
      .map((station) => station.mapPoint.x)
      .sort((a, b) => a - b);

    /* If isMax = true, set X to the last x coord in the array plus the width of a station, or the rightmost station.
    Otherwise set it to the first x coord in the array, leftmost. */
    const x = isMax
      ? orderedXPoints[orderedXPoints.length - 1] + STATION_WIDTH
      : orderedXPoints[0];
    /* If isMax = true, set Y to the last y coord in the array plus the height of a station, or the bottommost station.
    Otherwise set it to the first y coord in the array, or the topmost station. */
    const y = isMax
      ? orderedYPoints[orderedYPoints.length - 1] + STATION_HEIGHT
      : orderedYPoints[0];

    return {
      x: x,
      y: y,
    };
  }

  /**
   * Gets the top-left mapPoint.
   *
   * @param stations The array of stations to check.
   * @returns A point.
   */
  private getMinMapPoint(stations: StationMapElement[]): Point {
    return this.getEdgeMapPoint(stations, false);
  }

  /**
   * Gets the bottom-right mapPoint.
   *
   * @param stations The array of stations to check.
   * @returns A point.
   */
  private getMaxMapPoint(stations: StationMapElement[]): Point {
    return this.getEdgeMapPoint(stations, true);
  }

  /**
   * Updates the min and max mapPoints.
   *
   * @param stations The array of stations to check.
   */
  updatePoints(stations: StationMapElement[]): void {
      this.minMapPoint = this.getMinMapPoint(stations);
      this.maxMapPoint = this.getMaxMapPoint(stations);
  }

}
