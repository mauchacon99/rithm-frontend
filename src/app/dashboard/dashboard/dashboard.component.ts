import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { Station } from 'src/models';

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
  stations: Station[] = [];

  constructor(
    private stationService: StationService
  ) {

    // TODO: remove when admin users can access stations through map
    this.stationService.getAllStations()
      .pipe(first())
      .subscribe((stations) => {
        this.stations = stations;
      }, (error: unknown) => {
        console.error(error);
      });
  }
}
