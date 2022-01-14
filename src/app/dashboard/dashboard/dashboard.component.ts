import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { SidenavDrawerService } from '../../core/sidenav-drawer.service';
import { MatSidenav } from '@angular/material/sidenav';
import { DashboardItem, Station } from 'src/models';
import { DashboardService } from '../dashboard.service';

/**
 * Main component for the dashboard screens.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  /** The component for the side nav on the dashboard. */
  @ViewChild('menu', { static: false })
  menu!: MatSidenav;

  // TODO: remove when admin users can access stations through map
  /** The list of all stations for an admin to view. */
  stations: Station[] = [];

  viewNewDashboard = false;

  /** Widgets for dashboard. */
  widgetsOfDashboard: DashboardItem[] = [];

  /**
   * Whether the signed in user is an admin or not.
   *
   * @returns True if the user is an admin, false otherwise.
   */
  get isAdmin(): boolean {
    return this.userService.user.role === 'admin';
  }

  /**
   * Whether to show the backdrop for the menu drawer.
   *
   * @returns Whether to show the backdrop.
   */
  get drawerHasBackdrop(): boolean {
    return this.sidenavDrawerService.drawerHasBackdrop;
  }

  constructor(
    private stationService: StationService,
    private userService: UserService,
    private splitService: SplitService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private dashboardService: DashboardService
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

    this.getDashboardWidgets();
  }

  /**
   * Opens side nav on the dashboard.
   */
  toggleSideNav(): void {
    this.sidenavDrawerService.setSidenav(this.menu);
    this.sidenavDrawerService.toggleSidenav();
  }

  /**
   * Gets widgets for dashboard.
   */
  private getDashboardWidgets(): void {
    this.dashboardService
      .getDashboardWidgets()
      .pipe(first())
      .subscribe({
        next: (widgets) => {
          this.widgetsOfDashboard = widgets;
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
