import { Injectable } from '@angular/core';
import { StationMapElement } from 'src/helpers';
import { MapMode } from 'src/models';
import { STATION_HEIGHT, STATION_WIDTH, STATION_RADIUS, DEFAULT_SCALE, STATION_PADDING } from './map-constants';
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

    this.drawStationCard(station);
    this.drawStationName(station);
    this.drawDocumentBadge(station);
  }

  /**
   * Draws the station card on the map for a station.
   *
   * @param station The station for which to draw the card.
   */
  private drawStationCard(station: StationMapElement): void {
    if (!this.canvasContext) {
      throw new Error('Cannot draw the station card if context is not defined');
    }
    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledStationRadius = STATION_RADIUS * this.mapScale;
    const scaledStationHeight = STATION_HEIGHT * this.mapScale;
    const scaledStationWidth = STATION_WIDTH * this.mapScale;

    this.canvasContext.shadowColor = '#ccc';
    this.canvasContext.shadowBlur = 6;
    this.canvasContext.shadowOffsetX = 3;
    this.canvasContext.shadowOffsetY = 3;

    this.canvasContext.beginPath();
    this.canvasContext.moveTo(startingX + scaledStationRadius, startingY);
    this.canvasContext.lineTo(startingX + scaledStationWidth - scaledStationRadius, startingY);
    // eslint-disable-next-line max-len
    this.canvasContext.quadraticCurveTo(startingX + scaledStationWidth, startingY, startingX + scaledStationWidth, startingY + scaledStationRadius);
    // eslint-disable-next-line max-len
    this.canvasContext.lineTo(startingX + scaledStationWidth, startingY + scaledStationHeight - scaledStationRadius);// line going to bottom right
    // eslint-disable-next-line max-len
    this.canvasContext.quadraticCurveTo(startingX + scaledStationWidth, startingY + scaledStationHeight, startingX + scaledStationWidth - scaledStationRadius, startingY + scaledStationHeight);// bottom right curve to line going to bottom left
    this.canvasContext.lineTo(startingX + scaledStationRadius, startingY + scaledStationHeight);// line going to bottom left
    // eslint-disable-next-line max-len
    this.canvasContext.quadraticCurveTo(startingX, startingY + scaledStationHeight, startingX, startingY + scaledStationHeight - scaledStationRadius); // bottom left curve to line going to top left
    this.canvasContext.lineTo(startingX, startingY + scaledStationRadius);// line going to top left
    this.canvasContext.quadraticCurveTo(startingX, startingY, startingX + scaledStationRadius, startingY);
    // top left curve to line going top right
    this.canvasContext.closePath();
    this.canvasContext.fillStyle = '#fff';
    this.canvasContext.fill();
  }

  /**
   * Draws the station name at the top left of a station card.
   *
   * @param station The station for which to draw the station name.
   */
  private drawStationName(station: StationMapElement): void {
    if (!this.canvasContext) {
      throw new Error('Cannot reset the stroke if context is not defined');
    }
    const scaledStationPadding = STATION_PADDING * this.mapScale;

    this.canvasContext.shadowBlur = 0;
    this.canvasContext.shadowColor = 'transparent';
    this.canvasContext.textAlign = 'left';
    this.canvasContext.fillStyle = 'black';
    this.canvasContext.font = 'normal 16px Montserrat';

    const sn = station.name.trim().split(' ');
    const firstLineArray: string[] = [];
    const secondLineArray: string[] = [];

    for (const word of sn) {
      // eslint-disable-next-line max-len
      if (word.length <= 12 * this.mapScale && firstLineArray.join(' ').length <= 12 * this.mapScale && firstLineArray.join(' ').length + word.length <= 12 * this.mapScale && secondLineArray.length === 0) {
        firstLineArray.push(word);
      } else {
        // eslint-disable-next-line max-len
        if (word.length <= 12 * this.mapScale && secondLineArray.join(' ').length <= 12 * this.mapScale && secondLineArray.join(' ').length + word.length <= 12 * this.mapScale) {
          secondLineArray.push(word);
        } else if (secondLineArray.join(' ').length + word.length >= 12 * this.mapScale) {
          if (sn.length === 1 && word.length > 10) {
            firstLineArray.push(word.substring(0, 10));
            secondLineArray.push(word.substring(10, 20));
            if (sn.length === 1 && word.length > 20) {
              secondLineArray.push('...');
            }
          } else if (sn.length > 1) {
            secondLineArray.push('...');
          }
          break;
        }
      }
    }

    // eslint-disable-next-line max-len
    this.canvasContext.fillText(firstLineArray.join(' '), station.canvasPoint.x + scaledStationPadding, station.canvasPoint.y + 12 + scaledStationPadding, 114 * this.mapScale);
    if (secondLineArray.join(' ').length > 0) {
      // eslint-disable-next-line max-len
      this.canvasContext.fillText(secondLineArray.join(' '), station.canvasPoint.x + scaledStationPadding, station.canvasPoint.y + 32 + scaledStationPadding, 114 * this.mapScale);
    }
  }

  /**
   * Draws the document badge indicating the number of documents for the station at the top right of the station card.
   *
   * @param station The station for which to draw the badge.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private drawDocumentBadge(station: StationMapElement): void {
    // TODO: Draw the document badge
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
