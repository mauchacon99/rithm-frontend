import { Injectable } from '@angular/core';
import { StationGroupMapElement } from 'src/helpers';
import {
  StationGroupElementHoverItem,
  Point,
  MapMode,
  MapItemStatus,
} from 'src/models';
import {
  CONNECTION_DEFAULT_COLOR,
  STATION_GROUP_PADDING,
  STATION_HEIGHT,
  STATION_WIDTH,
  CONNECTION_LINE_WIDTH,
  BUTTON_DEFAULT_COLOR,
  DEFAULT_SCALE,
  FONT_SIZE_MODIFIER,
  NODE_HOVER_COLOR,
  CONNECTION_LINE_WIDTH_SELECTED,
  MAP_SELECTED,
  MAP_DISABLED_STROKE,
  MAP_DEFAULT_COLOR,
  TOOLTIP_RADIUS,
  TOOLTIP_HEIGHT,
  TOOLTIP_WIDTH,
  TOOLTIP_PADDING,
  SLOPE_RANGE_NOT_ALLOWED,
  SCALE_RENDER_STATION_ELEMENTS,
  STATION_GROUP_NAME_PADDING,
  ICON_STATION_GROUP_CANCEL,
  ICON_STATION_GROUP_ACCEPT,
  ICON_STATION_GROUP_HOVER_COLOR_CANCEL,
  ICON_STATION_GROUP_PATH_RADIUS,
  GROUP_CHARACTER_SIZE,
  STATION_GROUP_DISPLACEMENT,
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

  /** The Dimensions of the canvas. */
  canvasDimensions: {
    /** The width of the canvas.*/ width: number;
    /** The height of the canvas.*/
    height: number;
  } = { width: 0, height: 0 };

  constructor(private mapService: MapService) {
    //set this.mapScale to match the behavior subject in mapService.
    this.mapService.mapScale$.subscribe((scale) => (this.mapScale = scale));
  }

  /**
   * Draws all the station group boundaries on the map. Starts from the deepest station groups and works back to the root.
   */
  drawStationGroups(): void {
    //If stationGroupElements doesn't have a length defined.
    if (!this.mapService.stationGroupElements.length) {
      return;
    }
    //Note which station group is the read only root station group.
    const rootStationGroup = this.mapService.stationGroupElements.find(
      (stationGroup) => stationGroup.isReadOnlyRootStationGroup
    );
    //If there isn't a root defined.
    if (!rootStationGroup) {
      throw new Error('Root station group could not be found');
    }
    //Draw a specific station group.
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
      //store the subStationGroup so we can recursively call this method for said station group.
      const subStationGroup = this.mapService.stationGroupElements.find(
        (stationGroupElement) =>
          stationGroupElement.rithmId === subStationGroupId
      );
      if (!subStationGroup) {
        throw new Error(
          `Couldn't find a sub-station-group for which an id exists: ${subStationGroupId}`
        );
      }
      //If a subStationGroup was found recursively call this method to draw that first.
      this.drawStationGroup(subStationGroup);
    });

    if (stationGroup.isReadOnlyRootStationGroup) {
      return; // No need to calculate/render the root station group.
    }

    // Determine the points within the station group.
    const pointsWithinStationGroup: Point[] = [];
    pointsWithinStationGroup.push(
      //Fill array with the array returned.
      ...this.getStationPointsForStationGroup(stationGroup)
    );
    pointsWithinStationGroup.push(
      //Fill array with the array returned.
      ...this.getSubStationGroupPointsForStationGroup(stationGroup)
    );

    // Determine the points for the boundary line
    stationGroup.boundaryPoints = this.getConvexHull(pointsWithinStationGroup);

    //If there are boundary points set call methods needed to render the station group.
    if (stationGroup.boundaryPoints.length > 0) {
      this.setStationGroupBoundaryPath(stationGroup);
      this.drawStationGroupBoundaryLine(stationGroup);
      // Render station group name depending on the zoom level.
      if (this.mapScale > SCALE_RENDER_STATION_ELEMENTS) {
        this.drawStationGroupName(stationGroup);
      }

      if (
        this.mapService.mapMode$.value === MapMode.StationGroupAdd &&
        stationGroup.disabled &&
        !stationGroup.selected &&
        stationGroup.hoverItem === StationGroupElementHoverItem.Boundary
      ) {
        this.drawStationGroupToolTip(stationGroup);
      }
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
    //Point the canvasContext to the global one in mapService.
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw station group boundary line if context is not defined'
      );
    }

    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    //Draw the path object on stationGroup.
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.strokeStyle =
      this.mapService.mapMode$.value === MapMode.StationGroupAdd &&
      stationGroup.selected &&
      stationGroup.status !== MapItemStatus.Pending
        ? MAP_SELECTED
        : this.mapService.mapMode$.value === MapMode.StationGroupAdd &&
          stationGroup.disabled &&
          stationGroup.status !== MapItemStatus.Pending
        ? MAP_DISABLED_STROKE
        : stationGroup.hoverItem === StationGroupElementHoverItem.Boundary &&
          stationGroup.status !== MapItemStatus.Pending
        ? this.mapService.mapMode$.value === MapMode.StationGroupAdd
          ? MAP_SELECTED
          : NODE_HOVER_COLOR
        : CONNECTION_DEFAULT_COLOR;
    if (
      this.mapService.mapMode$.value === MapMode.StationGroupAdd &&
      stationGroup.status !== MapItemStatus.Pending &&
      (stationGroup.selected ||
        (stationGroup.hoverItem === StationGroupElementHoverItem.Boundary &&
          !stationGroup.disabled))
    ) {
      ctx.lineWidth = CONNECTION_LINE_WIDTH_SELECTED;
    } else {
      ctx.lineWidth = CONNECTION_LINE_WIDTH;
    }
    ctx.stroke(stationGroup.path);
    ctx.setLineDash([]);
  }

  /**
   * Draws the station group tooltip on the map for a station group.
   *
   * @param stationGroup The station group for which to draw the tooltip.
   */
  private drawStationGroupToolTip(stationGroup: StationGroupMapElement): void {
    if (!this.canvasContext) {
      throw new Error('Cannot draw the tooltip if context is not defined');
    }
    const ctx = this.canvasContext;

    const startingX = stationGroup.boundaryPoints[0].x;
    const startingY =
      stationGroup.boundaryPoints[stationGroup.boundaryPoints.length - 1].y -
      65 * this.mapScale;

    const scaledTooltipRadius = TOOLTIP_RADIUS * this.mapScale;
    const scaledTooltipHeight = TOOLTIP_HEIGHT * this.mapScale;
    const scaledTooltipWidth = TOOLTIP_WIDTH * this.mapScale;
    const scaledTooltipPadding = TOOLTIP_PADDING * this.mapScale;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startingX + scaledTooltipRadius, startingY);
    ctx.lineTo(startingX + scaledTooltipWidth - scaledTooltipRadius, startingY);
    ctx.quadraticCurveTo(
      startingX + scaledTooltipWidth,
      startingY,
      startingX + scaledTooltipWidth,
      startingY + scaledTooltipRadius
    );
    // line going to bottom right
    ctx.lineTo(
      startingX + scaledTooltipWidth,
      startingY + scaledTooltipHeight - scaledTooltipRadius
    );
    // bottom right curve to line going to bottom left
    ctx.quadraticCurveTo(
      startingX + scaledTooltipWidth,
      startingY + scaledTooltipHeight,
      startingX + scaledTooltipWidth - scaledTooltipRadius,
      startingY + scaledTooltipHeight
    );
    // line going to bottom left
    ctx.lineTo(
      startingX + scaledTooltipRadius,
      startingY + scaledTooltipHeight
    );
    // bottom left curve to line going to top left
    ctx.quadraticCurveTo(
      startingX,
      startingY + scaledTooltipHeight,
      startingX,
      startingY + scaledTooltipHeight - scaledTooltipRadius
    );
    // line going to top left
    ctx.lineTo(startingX, startingY + scaledTooltipRadius);
    // top left curve to line going top right
    ctx.quadraticCurveTo(
      startingX,
      startingY,
      startingX + scaledTooltipRadius,
      startingY
    );
    ctx.closePath();
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = MAP_DEFAULT_COLOR;
    const fontSize = Math.ceil(FONT_SIZE_MODIFIER * this.mapScale);
    ctx.font = `normal ${fontSize}px Montserrat`;
    ctx.fillText(
      'Cannot add group to',
      startingX + scaledTooltipPadding,
      startingY + 12 * this.mapScale + scaledTooltipPadding,
      140 * this.mapScale
    );
    ctx.fillText(
      'current selection',
      startingX + scaledTooltipPadding,
      startingY + 32 * this.mapScale + scaledTooltipPadding,
      140 * this.mapScale
    );
  }

  /**
   * Draws the station group name on the map.
   *
   * @param stationGroup The station group for which to draw the name.
   */
  private drawStationGroupName(stationGroup: StationGroupMapElement): void {
    //Point the canvasContext to the global one in mapService.
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw station group name if context is not defined'
      );
    }

    // The name of the station group.
    // Change color when hovered over.
    this.canvasContext.fillStyle =
      stationGroup.selected ||
      (stationGroup.hoverItem === StationGroupElementHoverItem.Boundary &&
        !stationGroup.disabled &&
        this.mapService.mapMode$.value === MapMode.StationGroupAdd)
        ? MAP_SELECTED
        : stationGroup.disabled &&
          this.mapService.mapMode$.value === MapMode.StationGroupAdd
        ? MAP_DISABLED_STROKE
        : stationGroup.hoverItem === StationGroupElementHoverItem.Boundary
        ? NODE_HOVER_COLOR
        : BUTTON_DEFAULT_COLOR;
    const fontSize = Math.ceil(FONT_SIZE_MODIFIER * this.mapScale);
    this.canvasContext.font = `bold ${fontSize}px Montserrat`;

    // Get the canvas dimensions.
    const canvasBoundingRect =
      this.canvasContext?.canvas.getBoundingClientRect();
    // Set the canvas dimensions.
    this.canvasDimensions = {
      width: canvasBoundingRect.width,
      height: canvasBoundingRect.height,
    };

    // Calculates the position of the first straightest line.
    const newPosition = this.positionStraightestLine(
      stationGroup.boundaryPoints,
      this.canvasContext.measureText(stationGroup.title).width +
        STATION_GROUP_PADDING
    );

    // Split station group name.
    const newTitle = this.splitStationGroupName(
      stationGroup.title,
      newPosition,
      stationGroup.boundaryPoints
    );

    // Delete the line under the station group name.
    newTitle.forEach((title, index) => {
      // If the new Position is greater than half of the number of points.
      /* When deleting the station group name at the top of the group we deleting from the highest to the lowest position but
      at the bottom of the group we delete from the lowest to the highest position. */
      if (
        Math.round((stationGroup.boundaryPoints.length - 1) / 2) > newPosition
      ) {
        this.paintOrDeleteLineStationGroupName(
          title,
          stationGroup.boundaryPoints[newPosition + index - 1],
          stationGroup.boundaryPoints[newPosition + index],
          stationGroup,
          false
        );
      } else {
        this.paintOrDeleteLineStationGroupName(
          title,
          stationGroup.boundaryPoints[newPosition - index],
          stationGroup.boundaryPoints[newPosition - index - 1],
          stationGroup,
          false
        );
      }
    });

    // Paint the station group name.
    newTitle.forEach((title, index) => {
      // If the new Position is greater than half of the number of points.
      /* When painting the station group name at the top of the group we painting from the highest to the lowest position but
      at the bottom of the group we paint from the lowest to the highest position. */
      if (
        Math.round((stationGroup.boundaryPoints.length - 1) / 2) > newPosition
      ) {
        this.paintOrDeleteLineStationGroupName(
          title,
          stationGroup.boundaryPoints[newPosition + index - 1],
          stationGroup.boundaryPoints[newPosition + index],
          stationGroup,
          true
        );
      } else {
        this.paintOrDeleteLineStationGroupName(
          title,
          stationGroup.boundaryPoints[newPosition - index],
          stationGroup.boundaryPoints[newPosition - index - 1],
          stationGroup,
          true
        );
      }
    });
  }

  /**
   * Sets the station group boundary path on the map for a station group.
   *
   * @param stationGroup The station group for which path needs to be set.
   */
  private setStationGroupBoundaryPath(
    stationGroup: StationGroupMapElement
  ): void {
    const path = new Path2D();

    //draws a path based on the boundary points of the station group.
    path.moveTo(
      stationGroup.boundaryPoints[0].x,
      stationGroup.boundaryPoints[0].y
    );
    stationGroup.boundaryPoints = stationGroup.boundaryPoints.concat(
      stationGroup.boundaryPoints.splice(0, 1)
    ); // Shift the first point to the back so we can get all the points.

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
    //If a station group has no stations inside it.
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

  /**
   * Calculate the slope between two points.
   *
   * @param pointStart The start point of the line.
   * @param pointEnd The end point of the line.
   * @returns The slope of a line.
   */
  slopeLine(pointStart: Point, pointEnd: Point): number {
    // If the denominator approximates 0 then return pi to deal with the error.
    if (
      pointEnd.x - pointStart.x > -SLOPE_RANGE_NOT_ALLOWED &&
      pointEnd.x - pointStart.x < SLOPE_RANGE_NOT_ALLOWED
    )
      return pointStart.y < pointEnd.y ? Math.PI / 2 : -Math.PI / 2;

    return (pointEnd.y - pointStart.y) / (pointEnd.x - pointStart.x);
  }

  /**
   * Move a point on the line.
   *
   * @param pointStart The start point of the line.
   * @param pointEnd The end point of the line.
   * @param displacement The Amount of displacement.
   * @param coordinate The coordinate to move, if true the coordinate is X else the coordinate is Y.
   * @returns The new Point on line.
   */
  movePointOnLine(
    pointStart: Point,
    pointEnd: Point,
    displacement: number,
    coordinate = true
  ): Point {
    const newPoint = { ...pointStart };

    // Calculate the slope between two points.
    const m = this.slopeLine(pointStart, pointEnd);
    // If the slope is infinity.
    if (Math.abs(m) === Math.PI / 2) {
      if (coordinate) {
        //  The x-coordinate is shifted because when we use the rotate it moves in y-coordinate.
        newPoint.x += displacement;
      } else {
        newPoint.y += Math.sign(m) * displacement;
      }

      return newPoint;
    }

    // If true the coordinate is X else the coordinate is Y.
    if (coordinate) {
      // x-coordinate displacement.
      newPoint.x += displacement;
      // The point-slope equation evaluating X.
      newPoint.y = m * (newPoint.x - pointEnd.x) + pointEnd.y;
    } else {
      // If the Start point in y-coordinate is greater than the End point in y-coordinate
      // Then subtract the displacement to the new position, or sum the displacement to the new position..
      if (
        this.mapService.getMapX(pointStart.y) >
        this.mapService.getMapX(pointEnd.y)
      ) {
        // Y-coordinate displacement.
        newPoint.y -= displacement;
      } else {
        // Y-coordinate displacement.
        newPoint.y += displacement;
      }
      // The point-slope equation evaluating Y.
      newPoint.x = (newPoint.y - pointEnd.y) / m + pointEnd.x;
    }
    return newPoint;
  }

  /**
   * Position of the points that make the first straight line.
   *
   * @param points A Array the points.
   * @param titleWidth The Width station Group Name.
   * @returns The position of the points that make the first straight line.
   */
  positionStraightestLine(points: Point[], titleWidth: number): number {
    let newPosition = points.length - 1;
    // Array of The best positions to place the name.
    const memoryPosition: {
      /** The position in array points. */
      position: number;
      /** The slope line. */
      slope: number;
      /** The distance between the position and the next position. */
      distance: number;
    }[] = [];

    for (let i = points.length - 1; i > 1; i--) {
      // Calculate the slope between two points.
      const m = this.slopeLine(points[i], points[i - 1]);
      const distance = this.distanceBetweenTwoPoints(points[i], points[i - 1]);
      // If is visible on the canvas.
      if (
        points[i].x >= STATION_GROUP_PADDING &&
        points[i - 1].x >= STATION_GROUP_PADDING &&
        points[i].x + titleWidth <= this.canvasDimensions.width &&
        points[i].y >= STATION_GROUP_PADDING &&
        points[i].y <= this.canvasDimensions.height
      ) {
        memoryPosition.push({
          position: i,
          slope: m,
          distance: distance,
        });
      }
    }
    // The first position is assigned.
    newPosition =
      memoryPosition.length > 0 ? memoryPosition[0].position : newPosition;
    let slopeBetter =
      memoryPosition.length > 0 ? Math.abs(memoryPosition[0].slope) : 0;
    for (let i = 0; i < memoryPosition.length; i++) {
      //If the slope is 0 and the distance is greater than the station group name.
      if (
        memoryPosition[i].slope === 0 &&
        memoryPosition[i].distance >= titleWidth
      ) {
        newPosition = memoryPosition[i].position;
        break;
        // If the slope is less than the best slope 0 and the distance is greater than the station group name.
      } else if (
        Math.abs(memoryPosition[i].slope) < slopeBetter &&
        memoryPosition[i].distance >= titleWidth
      ) {
        newPosition = memoryPosition[i].position;
        slopeBetter = memoryPosition[i].slope;
      }
    }
    return newPosition;
  }

  /**
   * The distance between two points.
   *
   * @param pointStart The start point of the line.
   * @param pointEnd The end point of the line.
   * @returns The distance between two points.
   */
  distanceBetweenTwoPoints(pointStart: Point, pointEnd: Point): number {
    const xDistance = pointEnd.y - pointStart.y;
    const yDistance = pointEnd.x - pointStart.x;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  }

  /**
   * Split the Station Group Name depending on the line width of the line.
   *
   * @param title The station group name.
   * @param position The better position in the array the points.
   * @param points The arrays points.
   * @returns The array with split title.
   */
  private splitStationGroupName(
    title: string,
    position: number,
    points: Point[]
  ): string[] {
    // Point the canvasContext to the global one in mapService.
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw station group boundary line if context is not defined'
      );
    }

    // The distance of the line.
    let distanceLine = this.distanceBetweenTwoPoints(
      points[position],
      points[position - 1]
    );

    const newTitle: string[] = [];

    let titleAux = '';

    let newPosition = position;

    const titleAllWidth =
      this.canvasContext.measureText(title).width + STATION_GROUP_NAME_PADDING;

    // If the width of the station Group Name is greater than the line distance.
    if (titleAllWidth >= distanceLine) {
      for (let i = 0; i < title.length; i++) {
        // The width of the part the station group name.
        const titleWidth =
          this.canvasContext.measureText(titleAux).width +
          this.canvasContext.measureText(title[i]).width;
        // If The width of the part the station group name is greater than the line distance.
        if (titleWidth >= distanceLine) {
          // Split station group name.
          newTitle.push(titleAux);
          // Assigns the following start of the title.
          titleAux = title[i];
          // Moves to the next position in the array points.
          newPosition =
            newPosition - 1 > 0 ? newPosition - 1 : points.length - 1;
          // The distance of the new line.
          distanceLine = this.distanceBetweenTwoPoints(
            points[newPosition],
            points[newPosition - 1 > 0 ? newPosition - 1 : points.length - 1]
          );
        } else {
          titleAux = titleAux.concat(title[i]);
        }
      }
      newTitle.push(titleAux);
    } else {
      newTitle.push(title);
    }
    return newTitle;
  }

  /**
   * Paint or delete the line under the station group name.
   *
   * @param title The station group name.
   * @param pointStart The start point of the line.
   * @param pointEnd The end point of the line.
   * @param stationGroup The station group.
   * @param paintOrDelete If true, paint the name, if not, delete the line under the name.
   */
  private paintOrDeleteLineStationGroupName(
    title: string,
    pointStart: Point,
    pointEnd: Point,
    stationGroup: StationGroupMapElement,
    paintOrDelete = true
  ): void {
    // Point the canvasContext to the global one in mapService.
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw station group boundary line if context is not defined'
      );
    }
    // Calculation of the slope of the line.
    const m = this.slopeLine(pointStart, pointEnd);
    // Calculation of the angle of rotation of station group name.
    // If the slope is equal to Pi (in the case of Pi/2 it is a value of references) then it is the vertical line.
    let rotateAngleStationGroupName =
      Math.abs(m) === Math.PI / 2 ? m : Math.atan(m);

    // If the title is painted from right to left.
    if (
      this.mapService.getMapX(pointStart.x) >
      this.mapService.getMapX(pointEnd.x)
    ) {
      rotateAngleStationGroupName = -Math.PI + Math.atan(m);
    }

    // Save Canvas.
    this.canvasContext.save();

    // translate the canvas to the new point.
    this.canvasContext.translate(pointStart.x, pointStart.y);

    // Rotate station group name.
    this.canvasContext.rotate(rotateAngleStationGroupName);

    if (paintOrDelete) {
      // Paint the station group name.
      this.canvasContext.fillText(
        title,
        STATION_GROUP_DISPLACEMENT,
        this.canvasContext.measureText(title).fontBoundingBoxDescent
      );
      // If status of the station group is pending.
      if (stationGroup.status === MapItemStatus.Pending) {
        const titleWidth =
          this.canvasContext.measureText(title).width +
          GROUP_CHARACTER_SIZE * 2 * this.mapScale;

        // Reset pathButtons of the station group.
        stationGroup.pathButtons = [];
        // Paint the Cancel Icon on the map.
        this.drawStationGroupIcon(
          pointStart,
          pointEnd,
          titleWidth,
          StationGroupElementHoverItem.ButtonCancel,
          ICON_STATION_GROUP_CANCEL,
          ICON_STATION_GROUP_HOVER_COLOR_CANCEL,
          stationGroup
        );
        // Paint the Accept Icon on the map.
        this.drawStationGroupIcon(
          pointStart,
          pointEnd,
          titleWidth + GROUP_CHARACTER_SIZE * 4 * this.mapScale,
          StationGroupElementHoverItem.ButtonAccept,
          ICON_STATION_GROUP_ACCEPT,
          MAP_SELECTED,
          stationGroup
        );
      }
    } else {
      // Delete the line under the station group name.
      this.canvasContext.clearRect(
        -STATION_GROUP_DISPLACEMENT,
        -STATION_GROUP_DISPLACEMENT,
        this.canvasContext.measureText(title).width +
          STATION_GROUP_NAME_PADDING +
          (stationGroup.status === MapItemStatus.Pending
            ? GROUP_CHARACTER_SIZE * 12
            : GROUP_CHARACTER_SIZE) *
            this.mapScale,
        //This dynamically sets the hight of the rectangle based on the hight of the text.
        this.canvasContext.measureText(title).fontBoundingBoxDescent +
          STATION_GROUP_NAME_PADDING
      );
    }

    // Reset translate and rotate.
    this.canvasContext.rotate(-rotateAngleStationGroupName);
    this.canvasContext.translate(-pointStart.x, -pointStart.y);
    // Restore Canvas.
    this.canvasContext.restore();
  }

  /**
   * Draw the icon on the map.
   *
   * @param pointStart The start point of the line.
   * @param pointEnd The end point of the line.
   * @param displacement The displacement on the line.
   * @param typeButton The icon type button.
   * @param icon The icon.
   * @param hoverColor The color of the icon when hovering.
   * @param stationGroup The station group.
   * @param displacedMap If the map was moved to point Start.
   */
  private drawStationGroupIcon(
    pointStart: Point,
    pointEnd: Point,
    displacement: number,
    typeButton: StationGroupElementHoverItem,
    icon: string,
    hoverColor: string,
    stationGroup: StationGroupMapElement,
    displacedMap = true
  ): void {
    this.canvasContext = this.mapService.canvasContext;

    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw station group boundary line if context is not defined'
      );
    }
    //Calculation of the slope of the line.
    const m = this.slopeLine(pointStart, pointEnd);

    // Move the point on the line to paint on the map.
    const newPoint = this.movePointOnLine(
      {
        x: pointStart.x,
        y: pointStart.y,
      },
      {
        x: pointEnd.x,
        y: pointEnd.y,
      },
      displacement
    );

    // Calculation of the new displacement as a function of the slope of the line.
    // If the slope is greater than pi/4 we adjust the icon multiplied by 3.
    const newDisplacement =
      displacement +
      (Math.abs(m) === Math.PI / 2
        ? 0
        : Math.abs(m) < Math.PI / 4
        ? -STATION_GROUP_DISPLACEMENT * this.mapScale
        : -STATION_GROUP_DISPLACEMENT * 3 * this.mapScale);

    // Moves the point on the line to delimit where the hover zone begins.
    const newUnRotatedPointStart = this.movePointOnLine(
      {
        x: pointStart.x,
        y: pointStart.y,
      },
      {
        x: pointEnd.x,
        y: pointEnd.y,
      },
      newDisplacement,
      Math.abs(m) < Math.PI / 4
    );

    const fontSize = Math.ceil(FONT_SIZE_MODIFIER * this.mapScale);

    // Font selected to paint the icon.
    // If the icon is hover we increase the font by 0.5.
    this.canvasContext.font = `${
      fontSize * (stationGroup.hoverItem === typeButton ? 2.5 : 2)
    }px "FontAwesome"`;

    // Hovering changes the color of the icon.
    this.canvasContext.fillStyle =
      stationGroup.hoverItem === typeButton ? hoverColor : BUTTON_DEFAULT_COLOR;

    // Paint the icon on the map.
    this.canvasContext.fillText(
      icon,
      displacedMap ? newPoint.x - pointStart.x : newPoint.x,
      this.canvasContext.measureText(icon).fontBoundingBoxDescent
    );
    // If the slope is 0 then we do a displacement by the x-coordinate so that it does not overlap the station group name.
    const displacementX = m === 0 ? GROUP_CHARACTER_SIZE * this.mapScale : 0;
    const path = new Path2D();
    // Create a circle over the icon button for hovering.
    path.arc(
      newUnRotatedPointStart.x + displacementX,
      newUnRotatedPointStart.y,
      ICON_STATION_GROUP_PATH_RADIUS * this.mapScale,
      0,
      2 * Math.PI
    );
    path.closePath();

    // Adds the hover zone of the button in position Buttons of the stationGroup.
    stationGroup.pathButtons?.push({
      typeButton: typeButton,
      path: path,
    });
  }
}
