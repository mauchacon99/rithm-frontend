import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationMapElement } from 'src/helpers';
import { ConnectionLineInfo, MapMode } from 'src/models';
import { MapService } from '../map.service';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';

/**
 * Component for connection info drawer.
 */
@Component({
  selector: 'app-connection-info-drawer',
  templateUrl: './connection-info-drawer.component.html',
  styleUrls: ['./connection-info-drawer.component.scss']
})

export class ConnectionInfoDrawerComponent implements OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Array of the two connected stations. */
  connectedStations: StationMapElement[] = [];

  /** Name of the station where the connection begins. */
  connectionStartStationName = 'StartStationName';

  /** Name of the station where the connection ends. */
  connectionEndStationName = 'EndStationName';

  /** Id of the station where the connection begins. */
  connectionStartStationId = '';

  /** Id of the station where the connection ends. */
  connectionEndStationId = '';

  /** Modes for canvas element used for the map. */
  mapMode = MapMode.View;

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private mapService: MapService,
    private errorService: ErrorService,
    private popupService: PopupService
  ) {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const stationIds = data as ConnectionLineInfo;
        if (stationIds) {
          this.connectedStations = this.mapService.stationElements.filter(e =>
            e.rithmId === stationIds.connectionStartStationRithmId || e.rithmId === stationIds.connectionEndStationRithmId);
          this.connectedStations.sort((a) => a.rithmId === stationIds.connectionStartStationRithmId ? -1 : 1);
          this.connectionStartStationName = this.connectedStations[0].stationName;
          this.connectionEndStationName = this.connectedStations[1].stationName;
          this.connectionStartStationId = this.connectedStations[0].rithmId;
          this.connectionEndStationId = this.connectedStations[1].rithmId;
        }
      });

    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mapMode) => {
        this.mapMode = mapMode;
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

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Removes the connections from a station, and removes that station from the connections of previous and next stations.
   *
   */
   async removeConnectionLine(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Remove Connection Line',
      message: `Remove connection line from ${this.connectionStartStationName} to ${this.connectionEndStationName} ?`,
      okButtonText: 'Remove',
    });
    if (confirm) {
      this.mapService.removeConnectionLine(this.connectionStartStationId, this.connectionEndStationId);
      this.sidenavDrawerService.toggleDrawer('connectionInfo');
    }
  }

}
