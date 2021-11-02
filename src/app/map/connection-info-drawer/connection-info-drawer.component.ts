import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationMapElement } from 'src/helpers';

/**
 * Component for connection info drawer.
 */
@Component({
  selector: 'app-connection-info-drawer',
  templateUrl: './connection-info-drawer.component.html',
  styleUrls: ['./connection-info-drawer.component.scss']
})

export class ConnectionInfoDrawerComponent implements OnInit {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject();

  /** Whether the request to get the connection info is currently underway. */
  connectionLoading = false;

  /** Array of the two connected stations. */
  connectedStations: StationMapElement[] = [];

  /** Name of first station. */
  station1 = '';

  /** Name of second station. */
  station2 = '';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
  ) {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data;
        if (dataDrawer) {
          this.editMode = dataDrawer.editMode;
          this.stationInformation = dataDrawer.stationInformation as StationInformation;
          this.stationName = dataDrawer.stationName;
          this.isWorker = dataDrawer.isWorker;
        }
      });
  }

  /** On Init. */
  ngOnInit(): void {
    this.station1 = this.connectedStations[0].stationName;
    this.station2 = this.connectedStations[1].stationName;
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
