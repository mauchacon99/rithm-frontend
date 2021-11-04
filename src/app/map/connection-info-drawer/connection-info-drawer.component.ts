import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationMapElement } from 'src/helpers';
import { MapService } from '../map.service';

/**
 * Component for connection info drawer.
 */
@Component({
  selector: 'app-connection-info-drawer',
  templateUrl: './connection-info-drawer.component.html',
  styleUrls: ['./connection-info-drawer.component.scss']
})

export class ConnectionInfoDrawerComponent {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject();

  /** Array of the two connected stations. */
  connectedStations: StationMapElement[] = [];

  /** Name of first station. */
  station1 = '';

  /** Name of second station. */
  station2 = '';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private mapService: MapService
  ) {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const stationIds = data as string[];
        if (dataDrawer) {
          this.connectedStations = this.mapService.stationElements.filter((e) => {
            e.rithmId === dataDrawer[0] || dataDrawer[1];
          });
          this.station1 = this.connectedStations[0].stationName;
          this.station2 = this.connectedStations[1].stationName;
        }
      });
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'connectionInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }

}
