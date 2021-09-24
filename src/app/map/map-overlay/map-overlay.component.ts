import { Component } from '@angular/core';
import { MapMode } from 'src/models';
import { MapService } from '../map.service';

/**
 * Component for the elements overlaid on top of the map canvas.
 */
@Component({
  selector: 'app-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.scss']
})
export class MapOverlayComponent {
  /** Build button for admin. */
  mapMode = false;

  /** The different modes of the map. */
  mode = MapMode;

  /** The current mode of the map. */
  currentMode = MapMode.view;

  constructor(private mapService: MapService) {
    this.mapService.mapMode$
      .subscribe((mapMode) => {
        this.currentMode = mapMode;
      });
  }

  /**
   * Enters build mode for the map.
   */
  build(): void {
    this.mapService.buildMap();
  }

  /**
   * Publishes map changes.
   */
  publish(): void {
    // TODO: Implement publish
  }

  /**
   * Cancels the map changes and returns to view mode.
   */
  cancel(): void {
    this.mapMode = !this.mapMode;
    // TODO: Implement cancel
  }

  /**
   * Zooms the map in to center.
   */
  zoomIn(): void {
    // TODO: Implement zoom in
  }

  /**
   * Zooms the map out from center.
   */
  zoomOut(): void {
    // TODO: Implement zoom out
  }

}
