import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
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
  drawerMode: '' | 'stationInfo' | 'documentInfo' = '';

  openedFromMap = false;

  constructor(private sidenavDrawerService: SidenavDrawerService) {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data === 'documentInfo' || data === 'stationInfo') {
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
    drawerItem: '' | 'stationInfo' | 'documentInfo'
  ): Promise<void> {
    if (drawerItem === 'documentInfo' || drawerItem === 'stationInfo') {
      await this.sidenavDrawerService.toggleDrawer(drawerItem);
    }
    this.drawerMode = '';
  }
}
