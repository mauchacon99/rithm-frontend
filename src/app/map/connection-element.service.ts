import { Injectable } from '@angular/core';
import { ConnectionMapElement } from 'src/helpers';
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
    //set this.mapScale to match the behavior subject in mapService.
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
    //Point the canvasContext to the global one in mapService.
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error('Cannot draw connection if context is not defined');
    }

    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    ctx.beginPath();
    ctx.moveTo(connection.startPoint.x, connection.startPoint.y);
    //Styling dependent on a scale and hover state.
    ctx.lineWidth =
      this.mapScale > SCALE_REDUCED_RENDER
        ? CONNECTION_LINE_WIDTH
        : CONNECTION_LINE_WIDTH_ZOOM_OUT;
    ctx.strokeStyle = connection.hovering
      ? NODE_HOVER_COLOR
      : CONNECTION_DEFAULT_COLOR;
    //use the path information in connection to draw the connection line.
    ctx.stroke(connection.path);
  }
}
