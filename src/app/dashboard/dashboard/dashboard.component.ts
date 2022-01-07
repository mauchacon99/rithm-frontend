import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { Station } from 'src/models';

/**
 * Main component for the dashboard screens.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // TODO: remove when admin users can access stations through map
  /** The list of all stations for an admin to view. */
  stations: Station[] = [];

  viewNewDashboard = false;

  constructor(
    private stationService: StationService,
    private userService: UserService,
    private splitService: SplitService,
    private errorService: ErrorService
  ) {
    // TODO: remove when admin users can access stations through map
    if (this.isAdmin) {
      this.stationService
        .getAllStations()
        .pipe(first())
        .subscribe((stations) => {
          this.stations = stations;
        });
    }
  }

  /**
   * Initialize split on page load.
   */
  ngOnInit(): void {
    const user = this.userService.user;
    if (user) {
      this.splitService.initSdk(user.rithmId);
    }

    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        const treatment = this.splitService.getDashboardTreatment();
        treatment === 'on'
          ? (this.viewNewDashboard = true)
          : (this.viewNewDashboard = false);
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

  /**
   * Whether the signed in user is an admin or not.
   *
   * @returns True if the user is an admin, false otherwise.
   */
  get isAdmin(): boolean {
    return this.userService.user.role === 'admin';
  }
}
