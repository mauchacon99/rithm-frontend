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

  // MVP +1 below

  // undo(): void {}
  // redo(): void {}
  // search(): void {}
}
