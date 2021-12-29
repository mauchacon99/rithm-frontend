import { Injectable } from '@angular/core';
import { ConnectionMapElement } from 'src/models';
import {
  CONNECTION_DEFAULT_COLOR,
  CONNECTION_LINE_WIDTH,
  CONNECTION_LINE_WIDTH_ZOOM_OUT,
  DEFAULT_SCALE,
  NODE_HOVER_COLOR,
  SCALE_REDUCED_RENDER,
} from './map-constants';
import { MapService } from './map.service';

/**
 * Service for rendering and other behavior for a connection on the map.
 */
@Injectable({
  providedIn: 'root',
})
export class ConnectionElementService {
  /** The rendering this.canvasContext for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  /** The default scale value for the station card. */
  private mapScale = DEFAULT_SCALE;

  constructor(private mapService: MapService) {
    this.mapService.mapScale$.subscribe((scale) => {
      this.mapScale = scale;
    });
  }

  /**
   * Draws a connection on the map.
   *
   * @param connection The connection to draw.
   */
  drawConnection(connection: ConnectionMapElement): void {
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error('Cannot draw connection if context is not defined');
    }

    const ctx = this.canvasContext;

    ctx.beginPath();
    ctx.moveTo(connection.startPoint.x, connection.startPoint.y);
    ctx.lineWidth =
      this.mapScale > SCALE_REDUCED_RENDER
        ? CONNECTION_LINE_WIDTH
        : CONNECTION_LINE_WIDTH_ZOOM_OUT;
    ctx.strokeStyle = connection.hoverActive
      ? NODE_HOVER_COLOR
      : CONNECTION_DEFAULT_COLOR;
    ctx.stroke(connection.path);
  }
}
