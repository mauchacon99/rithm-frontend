import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationMapElement } from 'src/helpers';
import { MapService } from '../map.service';
import { PopupService } from 'src/app/core/popup.service';

/**
 * Component for station group info drawer.
 */
@Component({
  selector: 'app-station-group-info-drawer',
  templateUrl: './station-group-info-drawer.component.html',
  styleUrls: ['./station-group-info-drawer.component.scss'],
})
export class StationGroupInfoDrawerComponent implements OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Array of the two connected stations. */
  connectedStations: StationMapElement[] = [];

  /** Name of the station where the connection begins. */
  connectionStartStationName = 'StartStationName';

  /** Name of the station where the connection ends. */
  connectionEndStationName = 'EndStationName';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private mapService: MapService,
    private popupService: PopupService
  ) {}

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationGroupInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
