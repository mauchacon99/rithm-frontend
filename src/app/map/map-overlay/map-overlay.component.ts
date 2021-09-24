import { Component } from '@angular/core';

/**
 * Component for the elements overlaid on top of the map canvas.
 */
@Component({
  selector: 'app-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.scss']
})
export class MapOverlayComponent {
  /** Admin promote or demote loading indicator. */
  mapDataLoading = false;

  /**
   * Enters build mode for the map.
   */
   build(): void {
    // TODO: Implement build
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
