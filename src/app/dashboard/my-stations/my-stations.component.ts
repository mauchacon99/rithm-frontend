import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardStationData } from 'src/models';

/**
 * Component for housing the list of a worker's stations.
 */
@Component({
  selector: 'app-my-stations',
  templateUrl: './my-stations.component.html',
  styleUrls: ['./my-stations.component.scss']
})
export class MyStationsComponent implements OnInit {

  /** The stations where the user is part of the work roster. */
  stations: DashboardStationData[] = [];

  /** Whether the stations are being loaded. */
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) { }

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    this.dashboardService.getDashboardStations()
      .pipe(first())
      .subscribe({
        next: (stations) => {
          if (stations) {
            this.stations = stations;
          }
          this.isLoading = false;
        }, error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

}
