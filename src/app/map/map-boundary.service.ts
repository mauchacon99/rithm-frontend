import { Injectable } from '@angular/core';
import { Point } from 'src/models';
import { CONNECTION_LINE_WIDTH } from './map-constants';
import { MapService } from './map.service';

/**
 * Service for rendering and other behavior for the Map Boundary.
 */
@Injectable({
  providedIn: 'root',
})
export class MapBoundaryService {
  /** The rendering this.canvasContext for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  constructor(private mapService: MapService) {}

  /**
   * Draws a boundary box on the map. Draws any nested flows first through recursion.
   *
   * @param minBoundaryCoords The minimum boundary coordinates to be used draw boundary box on the map.
   * @param maxBoundaryCoords The maximum boundary coordinates to be used draw boundary box on the map.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawBox(minBoundaryCoords: Point, maxBoundaryCoords: Point): void {
    this.canvasContext = this.mapService.canvasContext;
    if (!this.canvasContext) {
      throw new Error('Cannot draw boundary line if context is not defined');
    }
    const ctx = this.canvasContext;
    const strokeColor = '#1b4387';

    ctx.setLineDash([1, 5]);
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.strokeStyle = strokeColor;

    ctx.moveTo(minBoundaryCoords.x, minBoundaryCoords.y);
    ctx.lineTo(minBoundaryCoords.x, minBoundaryCoords.y);
    ctx.lineTo(maxBoundaryCoords.x, minBoundaryCoords.y);
    ctx.lineTo(maxBoundaryCoords.x, maxBoundaryCoords.y);
    ctx.lineTo(minBoundaryCoords.x, maxBoundaryCoords.y);
    ctx.lineTo(minBoundaryCoords.x, minBoundaryCoords.y);

    ctx.lineWidth = CONNECTION_LINE_WIDTH;
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
