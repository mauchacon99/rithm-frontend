import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { MapData, MapItemStatus, MapMode } from 'src/models';
import { MapService } from 'src/app/map/map.service';
import { PopupService } from 'src/app/core/popup.service';

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
  private currentMode = MapMode.View;

  /** The data that will be published. */
  publishMapData: MapData = {
    stations: [],
    flows: []
  };

  /** Map data request loading indicator. */
  mapDataLoading = false;

  /**
   * Whether the map is in any building mode.
   *
   * @returns True if the map is in any building mode, false otherwise.
   */
  get isBuilding(): boolean {
    return this.currentMode === MapMode.Build || this.currentMode === MapMode.StationAdd || this.currentMode === MapMode.FlowAdd;
  }

  /**
   * Station the map is in stationAdd mode.
   *
   * @returns True if the map is in stationAdd mode, false otherwise.
   */
  get isStationAdd(): boolean {
    return this.currentMode === MapMode.StationAdd;
  }

  constructor(private mapService: MapService,
    private popupService: PopupService,
    private errorService: ErrorService) {
    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mapMode) => {
        this.currentMode = mapMode;
      }, (error: unknown) => {
        throw new Error(`Map overlay subscription error: ${error}`);
      });

    this.mapService.mapElements$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const updatedData: MapData = {
          stations: data.stations.filter((e) => e.status !== MapItemStatus.Normal),
          flows: data.flows.filter((e) => e.status !== MapItemStatus.Normal)
        };
        this.publishMapData = updatedData;
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
    this.mapService.mapMode$.next(MapMode.View);
  }

  /**
   * Enters build mode for the map.
   */
  build(): void {
    this.mapService.buildMap();
  }

  /**
   * Publishes map changes.
   *
   * @param mapData The updated map data to return.
   */
  async publish(mapData: MapData): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Publish Map Changes',
      // eslint-disable-next-line max-len
      message: `The map changes that you have made will be published and be made available for all users of the organization. Are you ready to do this?`,
      okButtonText: 'Okay',
    });
    if (confirm) {
      this.mapDataLoading = true;
      this.mapService.publishMap(mapData)
        .pipe(first())
        .subscribe(() => {
          this.mapDataLoading = false;
          this.mapService.mapMode$.next(MapMode.View);
          this.popupService.notify('Map data published successfully.');
        }, (error: unknown) => {
          this.mapDataLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error,
            true
          );
        });
    }
  }

  /**
   * Cancels the map changes and returns to view mode.
   *
   */
  async cancel(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Confirmation',
      message: `Are you sure you want to cancel these changes? All map changes will be lost`,
      okButtonText: 'Confirm',
    });
    if (confirm) {
      this.mapService.cancelMapChanges();
    }
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
