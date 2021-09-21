import { Component } from '@angular/core';

/**
 * Component for managing the toolbar on the map.
 */
@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss']
})
export class MapToolbarComponent {
  /** Build button for admin. */
  adminRole = false;

  /** Build button for admin. */
   publishEnable = false;


  /**
   * Sets the map to add flow mode in preparation for a flow to be selected.
   */
   addFlow(): void {
    // TODO: Implement add flow
  }

  /**
   * Sets the map to add station mode in preparation for a station to be selected.
   */
   addStation(): void {
    // TODO: Implement add station
  }

  /**
   * Sets the map to publish mode from build.
   */
   publishMode(): void {
    this.adminRole = !this.adminRole;
    this.publishEnable = !this.publishEnable;
    }

  // MVP +1 below

  // undo(): void {}
  // redo(): void {}
  // search(): void {}
}
