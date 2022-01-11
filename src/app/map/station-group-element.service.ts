import { Injectable } from '@angular/core';
import { StationGroupMapElement } from 'src/helpers';
import { StationGroupElementHoverItem, Point } from 'src/models';
import {
  CONNECTION_DEFAULT_COLOR,
  STATION_GROUP_PADDING,
  STATION_HEIGHT,
  STATION_WIDTH,
  CONNECTION_LINE_WIDTH,
  BUTTON_DEFAULT_COLOR,
  DEFAULT_SCALE,
  STATION_GROUP_NAME_PADDING,
  FONT_SIZE_MODIFIER,
  NODE_HOVER_COLOR,
} from './map-constants';
import { MapService } from './map.service';

/**
 * Service for rendering and other behavior for a station group on the map.
 */
@Injectable({
  providedIn: 'root',
})
export class StationGroupElementService {
  /** The rendering this.canvasContext for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  /** The default scale value for the station card. */
  private mapScale = DEFAULT_SCALE;

  constructor(private mapService: MapService) {
    this.mapService.mapScale$.subscribe((scale) => (this.mapScale = scale));
  }

  /**
   * Draws all the station group boundaries on the map. Starts from the deepest station groups and works back to the root.
   */
  drawStationGroups(): void {
    if (!this.mapService.stationGroupElements.length) {
      return;
    }
    const rootStationGroup = this.mapService.stationGroupElements.find(
      (stationGroup) => stationGroup.isReadOnlyRootStationGroup
    );
    if (!rootStationGroup) {
      throw new Error('Root station group could not be found');
    }
    this.drawStationGroup(rootStationGroup);
  }

  /**
   * Draws a specific station group on the map. Draws any nested station groups first through recursion.
   *
   * @param stationGroup The station group to be drawn on the map.
   */
  private drawStationGroup(stationGroup: StationGroupMapElement): void {
    // If station group has a sub-station-group, draw that first
    stationGroup.subStationGroups.forEach((subStationGroupId) => {
      const subStationGroup = this.mapService.stationGroupElements.find(
        (stationGroupElement) =>
          stationGroupElement.rithmId === subStationGroupId
      );
      if (!subStationGroup) {
        throw new Error(
          `Couldn't find a sub-station-group for which an id exists: ${subStationGroupId}`
        );
      }
      this.drawStationGroup(subStationGroup);
    });

    if (stationGroup.isReadOnlyRootStationGroup) {
      return; // No need to calculate/render the root station group.
    }

    // Determine the points within the station group.
    const pointsWithinStationGroup: Point[] = [];
    pointsWithinStationGroup.push(
      ...this.getStationPointsForStationGroup(stationGroup)
    );
    pointsWithinStationGroup.push(
      ...this.getSubStationGroupPointsForStationGroup(stationGroup)
    );

    // Determine the points for the boundary line
    stationGroup.boundaryPoints = this.getConvexHull(pointsWithinStationGroup);

    // TODO: Render an empty station group.
    if (stationGroup.boundaryPoints.length > 0) {
      this.setStationGroupBoundaryPath(stationGroup);
      this.drawStationGroupBoundaryLine(stationGroup);
      this.drawStationGroupName(stationGroup);
    }
  }

  /**
   * Draws the boundary line on the map for a station group.
   *
   * @param stationGroup The station group for which to draw the station group boundary line.
   */
  private drawStationGroupBoundaryLine(
    stationGroup: StationGroupMapElement
  ): void {
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw station group boundary line if context is not defined'
      );
    }
    const ctx = this.canvasContext;

    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.strokeStyle =
      stationGroup.hoverItem === StationGroupElementHoverItem.Boundary
        ? NODE_HOVER_COLOR
        : CONNECTION_DEFAULT_COLOR;
    ctx.lineWidth = CONNECTION_LINE_WIDTH;
    ctx.stroke(stationGroup.path);
    ctx.setLineDash([]);
  }

  /**
   * Draws the station group name on the map.
   *
   * @param stationGroup The station group for which to draw the name.
   */
  private drawStationGroupName(stationGroup: StationGroupMapElement): void {
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw station group name if context is not defined'
      );
    }
    // TODO: Update this to be more dynamic
    this.canvasContext.fillStyle = BUTTON_DEFAULT_COLOR;
    const fontSize = Math.ceil(FONT_SIZE_MODIFIER * this.mapScale);
    this.canvasContext.font = `bold ${fontSize}px Montserrat`;
    this.canvasContext.fillText(
      stationGroup.title,
      stationGroup.boundaryPoints[0].x + STATION_GROUP_NAME_PADDING,
      stationGroup.boundaryPoints[stationGroup.boundaryPoints.length - 1].y +
        STATION_GROUP_NAME_PADDING
    );
  }

  /**
   * Set's the station group boundary path on the map for a station group.
   *
   * @param stationGroup The station group for which path needs to be set.
   */
  private setStationGroupBoundaryPath(
    stationGroup: StationGroupMapElement
  ): void {
    const path = new Path2D();

    path.moveTo(
      stationGroup.boundaryPoints[0].x,
      stationGroup.boundaryPoints[0].y
    );
    stationGroup.boundaryPoints = stationGroup.boundaryPoints.concat(
      stationGroup.boundaryPoints.splice(0, 1)
    ); // Shift the first point to the back

    for (const boundaryPoint of stationGroup.boundaryPoints) {
      path.lineTo(boundaryPoint.x, boundaryPoint.y);
    }
    stationGroup.path = path;
  }

  /**
   * Gets a list of all the station points that are contained within a station group.
   *
   * @param stationGroup The station group for which to get the points.
   * @returns A list of contained points representing the stations.
   */
  private getStationPointsForStationGroup(
    stationGroup: StationGroupMapElement
  ): Point[] {
    if (!stationGroup.stations.length) {
      return []; // Nothing to do here
    }

    // Get the stations within the station group.
    const stationGroupStations = this.mapService.stationElements.filter(
      (station) => stationGroup.stations.includes(station.rithmId)
    );

    // Get all the station points within this station group.
    const stationPointsWithinStationGroup: Point[] = [];
    for (const station of stationGroupStations) {
      const scaledPadding =
        STATION_GROUP_PADDING * this.mapService.mapScale$.value;
      const maxX =
        station.canvasPoint.x + STATION_WIDTH * this.mapService.mapScale$.value;
      const maxY =
        station.canvasPoint.y +
        STATION_HEIGHT * this.mapService.mapScale$.value;

      stationPointsWithinStationGroup.push({
        x: station.canvasPoint.x - scaledPadding,
        y: station.canvasPoint.y - scaledPadding,
      }); // TL
      stationPointsWithinStationGroup.push({
        x: maxX + scaledPadding,
        y: station.canvasPoint.y - scaledPadding,
      }); // TR
      stationPointsWithinStationGroup.push({
        x: station.canvasPoint.x - scaledPadding,
        y: maxY + scaledPadding,
      }); // BL
      stationPointsWithinStationGroup.push({
        x: maxX + scaledPadding,
        y: maxY + scaledPadding,
      }); // BR
    }
    return stationPointsWithinStationGroup;
  }

  /**
   * Gets a list of all the pre-calculated, sub-station-group points that are contained within a station group.
   *
   * @param stationGroup The station group for which to get the points.
   * @returns A list of contained points representing the station group boundary of the sub-station-groups.
   */
  private getSubStationGroupPointsForStationGroup(
    stationGroup: StationGroupMapElement
  ): Point[] {
    if (!stationGroup.subStationGroups.length) {
      return [];
    }
    // Get the sub-station-groups within the station group.
    const subStationGroups = this.mapService.stationGroupElements.filter(
      (subStationGroup) =>
        stationGroup.subStationGroups.includes(subStationGroup.rithmId)
    );

    // Get all the points for sub-station-groups.
    const subStationGroupPointsWithinStationGroup: Point[] = [];
    subStationGroups.forEach((subStationGroup) => {
      subStationGroupPointsWithinStationGroup.push(
        ...this.getPaddedStationGroupBoundaryPoints(
          subStationGroup.boundaryPoints
        )
      );
    });
    return subStationGroupPointsWithinStationGroup;
  }

  /**
   * Adds station group padding to the provided boundary points and returns it.
   *
   * @param boundaryPoints The existing station group boundary points for which to add padding.
   * @returns The padded station group boundary points.
   */
  private getPaddedStationGroupBoundaryPoints(
    boundaryPoints: Point[]
  ): Point[] {
    const updatedBoundaryPoints = [...boundaryPoints]; // Deep copy
    const minX = Math.min(...updatedBoundaryPoints.map((point) => point.x));
    const maxX = Math.max(...updatedBoundaryPoints.map((point) => point.x));
    const minY = Math.min(...updatedBoundaryPoints.map((point) => point.y));
    const maxY = Math.max(...updatedBoundaryPoints.map((point) => point.y));
    // Get center average point of boundary
    // const averageCenterPoint = {
    //   x: minX + maxX / 2,
    //   y: minY + maxY / 2
    // };

    for (const point of updatedBoundaryPoints) {
      if (point.x === maxX) {
        point.x += STATION_GROUP_PADDING * this.mapService.mapScale$.value;
      } else if (point.x === minX) {
        point.x -= STATION_GROUP_PADDING * this.mapService.mapScale$.value;
      }

      if (point.y === maxY) {
        point.y += STATION_GROUP_PADDING * this.mapService.mapScale$.value;
      } else if (point.y === minY) {
        point.y -= STATION_GROUP_PADDING * this.mapService.mapScale$.value;
      }
    }

    return updatedBoundaryPoints;
  }

  /**
   * Gets a new array of points representing the convex hull of the given set of points. The convex hull excludes collinear points.
   * This algorithm runs in O(n log n) time.
   *
   * @param points The unsorted points for which to get the points.
   * @returns The convex hull for the points.
   */
  private getConvexHull(points: Point[]): Point[] {
    const newPoints = points.slice();
    newPoints.sort(this.comparePoints);
    return this.getConvexHullPresorted(newPoints);
  }

  /**
   * Gets the convex hull of a pre-sorted set of points.
   *
   * @param points The sorted points to be contained in the convex hull.
   * @returns The convex hull for the points.
   */
  private getConvexHullPresorted(points: Point[]): Point[] {
    if (points.length <= 1) {
      return points.slice();
    }

    // Andrew's monotone chain algorithm. Positive y coordinates correspond to "up"
    // as per the mathematical convention, instead of "down" as per the computer
    // graphics convention. This doesn't affect the correctness of the result.

    // TODO: Refactor this; some duplicated code and vague variable names

    const upperHull: Point[] = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      while (upperHull.length >= 2) {
        const q = upperHull[upperHull.length - 1];
        const r = upperHull[upperHull.length - 2];
        if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) {
          upperHull.pop();
        } else {
          break;
        }
      }
      upperHull.push(p);
    }
    upperHull.pop();

    const lowerHull: Point[] = [];
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      while (lowerHull.length >= 2) {
        const q = lowerHull[lowerHull.length - 1];
        const r = lowerHull[lowerHull.length - 2];
        if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) {
          lowerHull.pop();
        } else {
          break;
        }
      }
      lowerHull.push(p);
    }
    lowerHull.pop();

    if (
      upperHull.length === 1 &&
      lowerHull.length === 1 &&
      upperHull[0].x === lowerHull[0].x &&
      upperHull[0].y === lowerHull[0].y
    ) {
      return upperHull;
    } else {
      return upperHull.concat(lowerHull);
    }
  }

  /**
   * Compares the position of one point to another.
   *
   * @param pointA The first point to compare.
   * @param pointB The second point to compare.
   * @returns A number indicating the position of `pointA` in relation to `pointB`.
   */
  private comparePoints(pointA: Point, pointB: Point): number {
    if (pointA.x < pointB.x) {
      return -1;
    } else if (pointA.x > pointB.x) {
      return 1;
    } else if (pointA.y < pointB.y) {
      return -1;
    } else if (pointA.y > pointB.y) {
      return 1;
    } else {
      return 0;
    }
  }
}
