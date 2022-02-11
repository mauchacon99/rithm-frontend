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
import { PopupService } from 'src/app/core/popup.service';

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

  /** Dashboard data Copy for save original data in mode edit. */
  dashboardDataCopy!: DashboardData;

  /** Error Loading dashboard. */
  errorLoadingDashboard = false;

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
      enabled: false,
      start: () => {
        /** Do something. */
      },
      stop: () => {
        /** Do something. */
      },
    },
    resizable: {
      enabled: false,
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
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private popupService: PopupService
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
        this.errorLoadingDashboard = false;
        this.isCreateNewDashboard = false;
      });
  }

  /**
   * Initialize split on page load.
   */
  ngOnInit(): void {
    this.split();
    this.sidenavDrawerService.setDrawer(this.drawer);
    const user = this.userService.user;
    if (user) {
      this.splitService.initSdk(user.organization);
    }

    //Sets height using a css variable. This allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dashboardvh', `${vh}px`);
  }

  /** Split Service. */
  private split(): void {
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        const treatment = this.splitService.getDashboardTreatment();
        this.viewNewDashboard = treatment === 'on';
        if (this.viewNewDashboard) {
          this.getParams();
        }
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
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
   *
   * @param statusEditMode Status mode edition.
   */
  async toggleEditMode(statusEditMode: boolean): Promise<void> {
    if (!statusEditMode) {
      const response = await this.popupService.confirm({
        title: 'Cancel?',
        message: 'All unsaved changes will be lost',
        important: true,
        okButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      if (response) {
        if (
          JSON.stringify(this.dashboardData) !==
          JSON.stringify(this.dashboardDataCopy)
        ) {
          this.dashboardData = JSON.parse(
            JSON.stringify(this.dashboardDataCopy)
          );
        }
        this.editMode = false;
        this.configEditMode(false, false);
      }
    } else {
      this.dashboardDataCopy = JSON.parse(JSON.stringify(this.dashboardData));
      this.editMode = true;
      this.configEditMode(true, true);
    }
  }

  /**
   * Enable or disable resizable and draggable in  gridster2.
   *
   * @param isDraggable Is enabled draggable.
   * @param isResizable Is enabled resizable.
   */
  private configEditMode(isDraggable: boolean, isResizable: boolean): void {
    this.options.draggable = {
      enabled: isDraggable,
      start: () => {
        /** Do something. */
      },
      stop: () => {
        /** Do something. */
      },
    };

    this.options.resizable = {
      enabled: isResizable,
      start: () => {
        /** Do something. */
      },
      stop: () => {
        /** Do something. */
      },
    };
    this.changedOptions();
  }

  /**
   * Change options of gridster2.
   */
  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  /**
   * Get dashboard by rithmId.
   *
   * @param dashboardRithmId String of rithmId of dashboard.
   */
  private getDashboardByRithmId(dashboardRithmId: string): void {
    this.editMode = false;
    this.errorLoadingDashboard = false;
    this.isLoading = true;
    this.dashboardService
      .getDashboardWidgets(dashboardRithmId)
      .pipe(first())
      .subscribe({
        next: (dashboardByRithmId) => {
          this.dashboardData = dashboardByRithmId;
          this.isLoading = false;
          this.configEditMode(false, false);
        },
        error: (error: unknown) => {
          this.errorLoadingDashboard = true;
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
          this.router.navigateByUrl('dashboard');
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
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (params) => {
        const dashboardId = params.get('dashboardId');
        if (dashboardId) {
          this.getDashboardByRithmId(dashboardId);
        } else {
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
    this.errorLoadingDashboard = false;
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
          this.errorLoadingDashboard = false;
        },
        error: (error: unknown) => {
          this.errorLoadingDashboard = true;
          this.isLoading = false;
          this.isCreateNewDashboard = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Update dashboard.
   */
  updateDashboard(): void {
    this.isLoading = true;
    this.errorLoadingDashboard = false;
    const updateDashboard$ =
      this.dashboardData.type === this.roleDashboardMenu.Company
        ? this.dashboardService.updateOrganizationDashboard(this.dashboardData)
        : this.dashboardService.updatePersonalDashboard(this.dashboardData);
    updateDashboard$.pipe(first()).subscribe({
      next: (dashboardUpdate) => {
        this.dashboardData = dashboardUpdate;
        this.isLoading = false;
        this.editMode = false;
        this.errorLoadingDashboard = false;
        this.configEditMode(false, false);
      },
      error: (error: unknown) => {
        this.errorLoadingDashboard = true;
        this.isLoading = false;
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
