import { Component } from '@angular/core';
import { StationService } from 'src/app/core/station.service';

/**
 * Main component for the dashboard screens.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  // TODO: remove when admin users can access stations through map
  /** The list of all stations for an admin to view. */
  stations: any[] = [];

  constructor(
    private stationService: StationService
  ) {
    this.stationService.getAllStations()
      .subscribe((stations) => {
        this.stations = stations;
      });
  }
}
