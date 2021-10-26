import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { MapMode } from 'src/models';
import { MapService } from 'src/app/map/map.service';
import { PopupService } from 'src/app/core/popup.service';
import { DEFAULT_SCALE, MAX_SCALE, MIN_SCALE, SCALE_RENDER_STATION_ELEMENTS } from '../map-constants';
import { MatMenuTrigger } from '@angular/material/menu';

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

  /** Map data request loading indicator. */
  mapDataLoading = false;

  /** Map scale. */
  mapScale = DEFAULT_SCALE;

  /** Used to track map cursor point option button. */
  menuX = 0;

  /** Used to track map cursor point option button. */
  menuY = 0;

  /** The MatMenu displayed on option button click. */
  @ViewChild(MatMenuTrigger, { static: false })
  menu!: MatMenuTrigger;

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

  /**
   * Zoom in/out button state Enable and disable when limits has been reached.
   *
   * @param zoom Zoom in/out buttons.
   * @returns Disable zoom button state if limits are reached.
   */
  enableZoom(zoom: number): boolean {
    if (zoom === 1) {
      return this.mapScale >= MAX_SCALE;
    }
    if (zoom === 0) {
      //disable zooming out past a certain point when in build mode.
      if (this.mapScale <= SCALE_RENDER_STATION_ELEMENTS * 2 && this.currentMode !== MapMode.View) {
        return true;
      }
      return this.mapScale <= MIN_SCALE;
    }
    return false;
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

    this.mapService.mapScale$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((scale) => {
        this.mapScale = scale;
      });

    this.mapService.currentMouseClick$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((click) => {
        if (click) {
          this.optionMenuTrigger(this.mapService.currentMousePoint$.value);
          this.mapService.currentMouseClick$.next(false);
        }
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
   */
  async publish(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Publish Map Changes',
      // eslint-disable-next-line max-len
      message: `The map changes that you have made will be published and be made available for all users of the organization. Are you ready to do this?`,
      okButtonText: 'Okay',
    });
    if (confirm) {
      this.mapDataLoading = true;
      this.mapService.publishMap()
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
    this.mapService.zoom(2);
  }

  /**
   * Zooms the map out from center.
   */
  zoomOut(): void {
    this.mapService.zoom(.5);
  }

  /**
   * Zoom in/out button state Enable and disable when limits has been reached.
   *
   * @param points Cursor x and y coordinates for display menu.
   */
  optionMenuTrigger(points: any): void {
    this.menuX = points.x - 15;
    this.menuY = points.y + 63;
    this.menu.closeMenu();
    this.menu.openMenu();
  }

}
