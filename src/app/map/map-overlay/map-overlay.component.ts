import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class MapOverlayComponent implements OnDestroy {

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject();

  /** The current mode of the map. */
  private currentMode = MapMode.view;

  /** Map data request loading indicator. */
  mapDataLoading = false;

  /**
   * Whether the map is in any building mode.
   *
   * @returns True if the map is in any building mode, false otherwise.
   */
  get isBuilding(): boolean {
    return this.currentMode === MapMode.build || this.currentMode === MapMode.stationAdd || this.currentMode === MapMode.flowAdd;
  }

  constructor(private mapService: MapService) {
    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mapMode) => {
        this.currentMode = mapMode;
      }, (error: unknown) => {
        throw new Error(`Map overlay subscription error: ${error}`);
      });
  }

  /**
   * Cleans up subscription.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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
   *
   */
  cancel(): void {
    this.mapService.mapMode$.next(MapMode.view);
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
