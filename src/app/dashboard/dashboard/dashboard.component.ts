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
import { DashboardData, Station } from 'src/models';
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
  toggleEditMode(statusEditMode:boolean): void {
      if (!statusEditMode) {
        const confirm = this.popupService.confirm({
          title: 'Cancel?',
          message: 'All unsaved changes will be lost',
          important: true,
          okButtonText: 'Yes',
          cancelButtonText: 'No',
        });

        confirm
          .then((status) => {
            if (status){
             this.editMode = false;
              this.dashboardData = JSON.parse(JSON.stringify(this.dashboardDataCopy));
              this.changedOptions();
            }
          })
          .catch((error) => {
            console.log(error);
          });

      } else this.editMode = statusEditMode;
  }


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
            console.log(this.dashboardData);
            this.dashboardDataCopy = JSON.parse(JSON.stringify(this.dashboardData));
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

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
