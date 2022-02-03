import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DashboardData, RoleDashboardMenu, Station } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { GridsterConfig } from 'angular-gridster2';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

/**
 * Main component for the dashboard screens.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  /** The component for the side nav on the dashboard. */
  @ViewChild('drawer', { static: true })
  drawer!: MatDrawer;

  /** Show the dashboard menu. */
  drawerContext = 'menuDashboard';

  /** Dashboard type. */
  dashboardRole!: RoleDashboardMenu;

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  // TODO: remove when admin users can access stations through map
  /** The list of all stations for an admin to view. */
  stations: Station[] = [];

  /** View new dashboard. */
  viewNewDashboard = false;

  private destroyed$ = new Subject<void>();

  /** If it needs to create new dashboard. */
  isCreateNewDashboard = false;

  /** Dashboard data, default dashboard general. */
  dashboardData!: DashboardData;

  /** Error Loading loading widget. */
  errorLoadingWidgets = false;

  /** Load indicator in dashboard. */
  isLoading = false;

  /** Edit mode toggle for widgets and dashboard name. */
  editMode = false;

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

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  constructor(
    private stationService: StationService,
    private userService: UserService,
    private splitService: SplitService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
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

    this.dashboardService.isLoadingDashboard$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        this.isLoading = status;
        this.errorLoadingWidgets = false;
        this.isCreateNewDashboard = false;
      });
  }

  /**
   * Initialize split on page load.
   */
  ngOnInit(): void {
    this.getParams();
    this.sidenavDrawerService.setDrawer(this.drawer);
    const user = this.userService.user;
    if (user) {
      this.splitService.initSdk(user.rithmId);
    }

    //Sets height using a css variable. This allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dashboardvh', `${vh}px`);
  }

  /** Split. */
  private split(): void {
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        const treatment = this.splitService.getDashboardTreatment();
        this.viewNewDashboard = treatment === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
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
   * Toggles the editMode to allow editing.
   */
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  /**
   * Gets widgets for dashboard.
   *
   * @param dashboardRithmId String of rithmId of dashboard.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getDashboardWidgets(dashboardRithmId: string): void {
    this.errorLoadingWidgets = false;
    this.isLoading = true;
    this.dashboardService
      .getDashboardWidgets()
      .pipe(first())
      .subscribe({
        next: (widgets) => {
          this.dashboardData = {
            rithmId: '',
            name: 'General',
            widgets,
          };
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.errorLoadingWidgets = true;
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
          this.router.navigate(['/', 'dashboard']);
        },
      });
  }

  /**
   * Update personal dashboard.
   */
  updatePersonalDashboard(): void {
    this.dashboardService
      .updatePersonalDashboard(this.dashboardData)
      .pipe(first())
      .subscribe({
        next: (dashboardUpdate) => {
          this.dashboardData = dashboardUpdate;
        },
        error: (error: unknown) => {
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
    //Sets height using a css variable. This allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dashboardvh', `${vh}px`);
  }

  /**
   * Attempts to retrieve the document info from the query params in the URL and make the requests.
   */
  private getParams(): void {
    this.route.params.pipe(first()).subscribe({
      next: (params) => {
        if (
          Object.keys(params).length &&
          params.dashboardId &&
          params.typeDashboard
        ) {
          if (
            params.typeDashboard === this.roleDashboardMenu.PersonalDashboard ||
            params.typeDashboard ===
              this.roleDashboardMenu.OrganizationDashboard
          ) {
            this.split();
            this.dashboardRole = params.typeDashboard;
            this.getDashboardWidgets(params.dashboardId);
          } else {
            this.router.navigate(['/', 'dashboard']);
          }

          // TODO: if no route params get the first company dashboard
        } else {
          this.split();
          this.dashboardRole = this.roleDashboardMenu.OrganizationDashboard;
          this.getOrganizationDashboard();
        }
      },
      error: (error: unknown) => {
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /** Get organization dashboard. */
  private getOrganizationDashboard(): void {
    this.isLoading = true;
    this.errorLoadingWidgets = false;
    this.isCreateNewDashboard = false;
    this.dashboardService
      .getOrganizationDashboard()
      .pipe(first())
      .subscribe({
        next: (dashboardData) => {
          if (dashboardData.length) {
            this.dashboardData = dashboardData[0];
          } else {
            this.isCreateNewDashboard = true;
          }
          this.isLoading = false;
          this.errorLoadingWidgets = false;
          this.isCreateNewDashboard = false;
        },
        error: (error: unknown) => {
          this.errorLoadingWidgets = true;
          this.isLoading = false;
          this.isCreateNewDashboard = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
