import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { ConnectionMapElement, StationMapElement } from 'src/helpers';
import { MapMode } from 'src/models';
import { MapService } from '../map.service';
import { PopupService } from 'src/app/core/popup.service';

/**
 * Component for connection info drawer.
 */
@Component({
  selector: 'app-connection-info-drawer',
  templateUrl: './connection-info-drawer.component.html',
  styleUrls: ['./connection-info-drawer.component.scss'],
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

  /** The different modes available. */
  mapModeEnum = MapMode;

  /** The drawer context for connectionInfo. */
  drawerContext = '';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private mapService: MapService,
    private popupService: PopupService
  ) {
    //Subscribe to the drawerContext so we can open the correct drawer type.
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.drawerContext = data;
      });

    //Subscribe to the drawerData so we can update what is displayed in the drawer.
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        //Set up the const to reference.
        const connection = data as ConnectionMapElement;
        //If connection is defined and drawerContext is correct context.
        if (connection && this.drawerContext === 'connectionInfo') {
          //Set an array containing the starting and ending station in the connection.
          this.connectedStations = this.mapService.stationElements.filter(
            (e) =>
              e.rithmId === connection.startStationRithmId ||
              e.rithmId === connection.endStationRithmId
          );
          //Sort the array so that we can correctly reference the starting vs the ending stations.
          this.connectedStations.sort((a) =>
            a.rithmId === connection.startStationRithmId ? -1 : 1
          );
          //Get the name of the starting station.
          this.connectionStartStationName =
            this.connectedStations[0].stationName;
          //Get the name of the ending station.
          this.connectionEndStationName = this.connectedStations[1].stationName;
          //Get the id of the starting station.
          this.connectionStartStationId = this.connectedStations[0].rithmId;
          //Get the id of the ending station.
          this.connectionEndStationId = this.connectedStations[1].rithmId;
        }
      });

    //Subscribe to the mapMode so that we can track it.
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
   * Remove this connection line, and remove it from the nextStations
   * array of the starting station and previousStations array of the ending station.
   */
  async removeConnectionLine(): Promise<void> {
    //Open a popup and store the user response as a boolean.
    const confirm = await this.popupService.confirm({
      title: 'Remove Connection Line',
      message: `Remove connection line from ${this.connectionStartStationName} to ${this.connectionEndStationName}?`,
      okButtonText: 'Remove',
    });
    //If user confirms.
    if (confirm) {
      //Remove the line using the method in map.service.
      this.mapService.removeConnectionLine(
        this.connectionStartStationId,
        this.connectionEndStationId
      );
      //Close the drawer.
      this.sidenavDrawerService.toggleDrawer('connectionInfo');
    }
  }
}
