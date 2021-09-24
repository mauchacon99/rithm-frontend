import { Injectable } from '@angular/core';
import { StationMapElement } from 'src/helpers';
import { MapMode } from 'src/models';
import {
  STATION_HEIGHT, STATION_WIDTH, STATION_RADIUS, DEFAULT_SCALE,
  BADGE_RADIUS, BADGE_MARGIN, BADGE_DEFAULT_COLOR, BADGE_HOVER_COLOR
} from './map-constants';
import { MapService } from './map.service';

/**
 * Service for rendering and other behavior for a station on the map.
 */
@Injectable({
  providedIn: 'root'
})
export class StationElementService {
  /** The default scale value for the station card. */
  private mapScale = DEFAULT_SCALE;

  /** The rendering this.canvasContext for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  constructor(
    private mapService: MapService
  ) { }

  /**
   * Draws a station on the map.
   *
   * @param station The station to draw on the map.
   * @param mapMode The current mode of the map.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawStation(station: StationMapElement, mapMode: MapMode): void {
    this.canvasContext = this.mapService.canvasContext;

    this.drawStationCard(station, <CanvasRenderingContext2D>(this.canvasContext));
    this.drawStationName(station);
    this.drawDocumentBadge(station);
  }

  /**
   * Draws the station card on the map for a station.
   *
   * @param station The station for which to draw the card.
   * @param context The context for station card element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private drawStationCard(station: StationMapElement, context: CanvasRenderingContext2D) {
    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledStationRadius = STATION_RADIUS * this.mapScale;
    const scaledStationHeight = STATION_HEIGHT * this.mapScale;
    const scaledStationWidth = STATION_WIDTH * this.mapScale;

    context.shadowColor = '#ccc';
    context.shadowBlur = 6;
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;

    context.beginPath();
    context.moveTo(startingX + scaledStationRadius, startingY);
    context.lineTo(startingX + scaledStationWidth - scaledStationRadius, startingY);
    context.quadraticCurveTo(startingX + scaledStationWidth, startingY, startingX + scaledStationWidth, startingY + scaledStationRadius);
    context.lineTo(startingX + scaledStationWidth, startingY + scaledStationHeight - scaledStationRadius);// line going to bottom right
    // eslint-disable-next-line max-len
    context.quadraticCurveTo(startingX + scaledStationWidth, startingY + scaledStationHeight, startingX + scaledStationWidth - scaledStationRadius, startingY + scaledStationHeight);// bottom right curve to line going to bottom left
    context.lineTo(startingX + scaledStationRadius, startingY + scaledStationHeight);// line going to bottom left
    // eslint-disable-next-line max-len
    context.quadraticCurveTo(startingX, startingY + scaledStationHeight, startingX, startingY + scaledStationHeight - scaledStationRadius); // bottom left curve to line going to top left
    context.lineTo(startingX, startingY + scaledStationRadius);// line going to top left
    context.quadraticCurveTo(startingX, startingY, startingX + scaledStationRadius, startingY);// top left curve to line going top right
    context.closePath();
    context.fillStyle = '#fff';
    context.fill();
  }

  /**
   * Draws the station name at the top left of a station card.
   *
   * @param station The station for which to draw the station name.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private drawStationName(station: StationMapElement): void {
    // TODO: Render the station text
  }

  /**
   * Draws the document badge indicating the number of documents for the station at the top right of the station card.
   *
   * @param station The station for which to draw the badge.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private drawDocumentBadge(station: StationMapElement): void {
    const ctx = <CanvasRenderingContext2D> this.canvasContext;

    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledBadgeRadius = BADGE_RADIUS * this.mapScale;
    const scaledBadgeMargin = BADGE_MARGIN * this.mapScale;
    const scaledStationWidth = STATION_WIDTH * this.mapScale;

    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const badgeColor = BADGE_DEFAULT_COLOR;
    // const badgeColorHover = BADGE_HOVER_COLOR;

    ctx.beginPath();
    ctx.arc(startingX + scaledStationWidth - scaledBadgeMargin, startingY + scaledBadgeMargin, scaledBadgeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = badgeColor;
    ctx.fill();
    ctx.font = '700 20px Montserrat';
    ctx.fillStyle = '#fff';
    ctx.fillText('7', startingX + scaledStationWidth - (scaledBadgeMargin + 5), startingY + (scaledBadgeMargin + 7), scaledBadgeRadius);
  }

  /**
   * Draws the interactive button on the bottom right of a station card.
   *
   * @param station The station for which to draw the button.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private drawStationButton(station: StationMapElement): void {
    // TODO: Render station button
  }

  /**
   * Draws the connection node on right side of station card.
   *
   * @param station The station for which to draw the connection node.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private drawConnectionNode(station: StationMapElement): void {
    // TODO: Draw the connection node
  }

  /**
   * Resets the shadow on the this.canvasContext.
   */
  private resetShadow(): void {
    if (!this.canvasContext) {
      throw new Error('Cannot reset the shadow if context is not defined');
    }
    this.canvasContext.shadowColor = 'transparent';
    this.canvasContext.shadowBlur = 0;
  }

  /**
   * Resets the stroke on the this.canvasContext.
   */
  private resetStroke(): void {
    if (!this.canvasContext) {
      throw new Error('Cannot reset the stroke if context is not defined');
    }
    this.canvasContext.setLineDash([0, 0]);
    this.canvasContext.strokeStyle = 'transparent';
  }
}
