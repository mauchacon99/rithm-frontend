import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DashboardData, DashboardItem, Station } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { GridsterConfig } from 'angular-gridster2';

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
  @ViewChild('drawer', { static: true })
  drawer!: MatDrawer;

  /** Show the dashboard menu. */
  drawerContext = 'menuDashboard';

  // TODO: remove when admin users can access stations through map
  /** The list of all stations for an admin to view. */
  stations: Station[] = [];

  viewNewDashboard = false;

  /** Widgets for dashboard. */
  widgetsOfDashboard: DashboardItem[] = [];

  /** Error Loading loading widget. */
  errorLoadingWidgets = false;

  /** Load indicator in dashboard. */
  dashboardLoading = false;

  /** Config grid. */
  options: GridsterConfig = {
    gridType: 'verticalFixed',
    displayGrid: 'onDrag&Resize',
    pushItems: true,
    draggable: {
      enabled: true,
      start: () => {
        /** Do something. */
      },
      stop: () => {
        /** Do something. */
      },
    },
    resizable: {
      enabled: true,
      start: () => {
        /** Do something. */
      },
      stop: () => {
        /** Do something. */
      },
    },
    margin: 16,
    minCols: 12,
    maxCols: 12,
  };

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
    this.sidenavDrawerService.setDrawer(this.drawer);
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
    //Sets height using a css variable. this allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dashboardvh', `${vh}px`);
  }

  /**
   * Opens side nav on the dashboard.
   *
   * @param drawerItem The information that will be displayed in the side drawer.
   */
  toggleMenu(drawerItem: 'menuDashboard'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }

  /**
   * Gets widgets for dashboard.
   */
  private getDashboardWidgets(): void {
    this.errorLoadingWidgets = false;
    this.dashboardLoading = true;
    this.dashboardService
      .getDashboardWidgets()
      .pipe(first())
      .subscribe({
        next: (widgets) => {
          this.widgetsOfDashboard = widgets;
          this.dashboardLoading = false;
        },
        error: (error: unknown) => {
          this.errorLoadingWidgets = true;
          this.dashboardLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Update dashboard name.
   *
   * @param dashboardData The dashboard data for update name.
   */
  updateOrganizationDashboard(dashboardData: DashboardData): void {
    this.dashboardService
      .updateOrganizationDashboard(dashboardData)
      .pipe(first())
      .subscribe({
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Needed to resize a mobile browser when the scrollbar hides.
   */
  @HostListener('window:resize', ['$event'])
  windowResize(): void {
    //Sets height using a css variable. this allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dashboardvh', `${vh}px`);
  }
}
