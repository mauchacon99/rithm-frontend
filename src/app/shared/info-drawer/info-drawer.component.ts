import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MapService } from 'src/app/map/map.service';
import { StationInfoDrawerData } from 'src/models';

/**
 * Component for info drawer.
 */
@Component({
  selector: 'app-info-drawer',
  templateUrl: './info-drawer.component.html',
  styleUrls: ['./info-drawer.component.scss'],
})
export class InfoDrawerComponent implements OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Whether the called info-drawer is documentInfo type or stationInfo. */
  drawerMode: '' | 'stationInfo' | 'documentInfo' | 'history' | 'fieldSetting' =
    '';

  /** Whether the station drawer is opened from map or not. */
  openedFromMap = false;

  /** The centering progress is active in station. */
  centerActive = false;

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private mapService: MapService
  ) {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (
          data === 'documentInfo' ||
          data === 'stationInfo' ||
          data === 'history' ||
          data === 'fieldSetting'
        ) {
          this.drawerMode = data;
        }
      });
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as StationInfoDrawerData;
        if (dataDrawer) {
          this.openedFromMap = dataDrawer.openedFromMap;
        }
      });

    /** Subscribe to the active center on the center helper mapService. */
    this.mapService.centerHelper.centerActive$
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (centerActive) => {
          // Set center active for the done button in the station.
          this.centerActive = centerActive;
        },
        error: (error: unknown) => {
          throw new Error(`Center active subscription error: ${error}`);
        },
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Toggles the open state for drawer mode.
   *
   * @param drawerItem The drawer item to toggle.
   */
  async toggleDrawer(
    drawerItem: '' | 'stationInfo' | 'documentInfo' | 'history' | 'fieldSetting'
  ): Promise<void> {
    if (
      drawerItem === 'documentInfo' ||
      drawerItem === 'stationInfo' ||
      drawerItem === 'history' ||
      drawerItem === 'fieldSetting'
    ) {
      this.mapService.mapHelper.isDrawerOpened$.next(false);
      await this.sidenavDrawerService.toggleDrawer(drawerItem);
    }
    this.drawerMode = '';
  }
}
