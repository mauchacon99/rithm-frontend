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
import {
  DashboardData,
  DashboardItem,
  EditDataWidget,
  RoleDashboardMenu,
  Station,
} from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
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
  drawerContext: 'menuDashboard' | 'stationWidget' = 'menuDashboard';

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  // TODO: remove when admin users can access stations through map
  /** The list of all stations for an admin to view. */
  stations: Station[] = [];

  /** View new dashboard. */
  viewNewDashboard = false;

  /** Observable for when the component is destroyed. */
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
    },
    resizable: {
      enabled: false,
    },
    margin: 16,
    minCols: 12,
    maxCols: 12,
    allowMultiLayer: true,
    defaultLayerIndex: 1,
    maxLayerIndex: 2,
    baseLayerIndex: 1,
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
      .subscribe(({ statusLoading, getParams }) => {
        this.isLoading = statusLoading;
        this.errorLoadingDashboard = false;
        this.isCreateNewDashboard = false;
        if (getParams) {
          this.getParams();
        }
      });

    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerContext) => {
        if (
          drawerContext === 'menuDashboard' ||
          drawerContext === 'stationWidget'
        ) {
          this.drawerContext = drawerContext;
        }
      });

    this.dashboardService.updateDataWidget$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((editDataWidget) => {
        this.updateDashboardWidget(editDataWidget);
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
   * Open drawers on the dashboard.
   *
   * @param drawerItem The information that will be displayed in the side drawer.
   * @param drawerData Data optional of the drawer.
   */
  toggleDrawer(
    drawerItem: 'menuDashboard' | 'stationWidget',
    drawerData?: EditDataWidget
  ): void {
    if (this.isDrawerOpen) {
      this.sidenavDrawerService.toggleDrawer(this.drawerContext);
      this.drawer.close().then(() => {
        this.drawerContext = drawerItem;
        this.sidenavDrawerService.toggleDrawer(drawerItem, drawerData);
      });
    } else {
      this.drawerContext = drawerItem;
      this.sidenavDrawerService.toggleDrawer(drawerItem, drawerData);
    }
  }

  /**
   * Toggle drawer of the station widget.
   *
   * @param widgetItem String of the data station.
   * @param widgetIndex Number of the position the widget.
   */
  toggleWidgetDrawer(widgetItem: DashboardItem, widgetIndex: number): void {
    this.toggleDrawer('stationWidget', {
      widgetItem,
      widgetIndex,
    });
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
        this.editMode = false;
        const oldWidgets = this.returnWidgetsCompared(
          this.dashboardDataCopy.widgets
        );
        const currentWidgets = this.returnWidgetsCompared(
          this.dashboardData.widgets
        );

        if (oldWidgets === currentWidgets)
          this.dashboardData = JSON.parse(
            JSON.stringify(this.dashboardDataCopy)
          );
        else this.getParams();

        this.configEditMode();
        this.toggleDrawerOnlyForWidgets();
      }
    } else {
      this.dashboardData = JSON.parse(JSON.stringify(this.dashboardDataCopy));
      this.editMode = true;
      this.configEditMode();
    }
  }

  /**
   * Returns widgets without the data attribute to compare if the widget has changed in edit mode.
   *
   * @returns The widgets without the data attribute and how string.
   * @param  items Widget items.
   */
  private returnWidgetsCompared(items: DashboardItem[]): string {
    const newItems: string[] = [];
    items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, ...widget } = item;
      newItems.push(JSON.stringify(widget));
    });
    return JSON.stringify(newItems);
  }

  /**
   * Enable or disable resizable and draggable in  gridster2.
   */
  private configEditMode(): void {
    this.options.draggable = {
      enabled: this.editMode,
    };
    this.options.resizable = {
      enabled: this.editMode,
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
          this.dashboardDataCopy = JSON.parse(
            JSON.stringify(this.dashboardData)
          );
          this.isLoading = false;
          this.configEditMode();
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
    this.route.params.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (params) => {
        const dashboardId = params['dashboardId'];
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
            this.dashboardDataCopy = JSON.parse(
              JSON.stringify(this.dashboardData)
            );
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

  /** Toggle drawer only for all widgets. */
  private toggleDrawerOnlyForWidgets(): void {
    if (this.isDrawerOpen && this.drawerContext !== 'menuDashboard') {
      this.sidenavDrawerService.toggleDrawer(this.drawerContext);
    }
  }

  /**
   * Update dashboard.
   *
   * @param isCloseDrawer If close drawer, only used by drawer widgets.
   */
  updateDashboard(isCloseDrawer = true): void {
    this.dashboardService.toggleLoadingDashboard(true);
    if (isCloseDrawer) {
      this.toggleDrawerOnlyForWidgets();
    }
    this.isLoading = true;
    this.errorLoadingDashboard = false;
    const updateDashboard$ =
      this.dashboardData.type === this.roleDashboardMenu.Company
        ? this.dashboardService.updateOrganizationDashboard(this.dashboardData)
        : this.dashboardService.updatePersonalDashboard(this.dashboardData);
    updateDashboard$.pipe(first()).subscribe({
      next: (dashboardUpdate) => {
        this.dashboardData = dashboardUpdate;
        this.dashboardDataCopy = JSON.parse(JSON.stringify(this.dashboardData));
        this.dashboardService.toggleLoadingDashboard(false);
        if (isCloseDrawer) {
          this.editMode = false;
          this.configEditMode();
        }
        this.errorLoadingDashboard = false;
      },
      error: (error: unknown) => {
        this.errorLoadingDashboard = true;
        this.dashboardService.toggleLoadingDashboard(false);
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Update data of the widget since drawer station.
   *
   * @param editDataWidget Data to edit widget.
   */
  updateDashboardWidget(editDataWidget: EditDataWidget): void {
    this.dashboardData.widgets[editDataWidget.widgetIndex] =
      editDataWidget.widgetItem;
    this.updateDashboard(editDataWidget.isCloseDrawer);
  }

  /**
   * Expand widget selected.
   *
   * @param widgetIndex String of the rithmId widget.
   * @param isExpandWidget Boolean if is expand widget.
   */
  toggleExpandWidget(widgetIndex: number, isExpandWidget: boolean): void {
    if (isExpandWidget) {
      this.dashboardData.widgets[widgetIndex].rows++;
      this.dashboardData.widgets[widgetIndex].layerIndex = 2;
    } else {
      this.dashboardData.widgets[widgetIndex].layerIndex = 1;
      this.dashboardData.widgets[widgetIndex] = JSON.parse(
        JSON.stringify(this.dashboardDataCopy)
      ).widgets[widgetIndex];
    }
    this.changedOptions();
  }

  /**
   * TrackBy in *ngFor, to widgets.
   *
   * @param index Number of index *ngFor.
   * @param item Item of the interface GridsterItem.
   * @returns Item id of the GridsterItem.
   */
  trackBy(index: number, item: GridsterItem): string {
    return item.rithmId;
  }

  /**
   * Remove widget on dashboardData for the index.
   *
   * @param widgetIndex Index of widget that opened widget-drawer.
   */
  removeWidgetIndex(widgetIndex: number): void {
    this.dashboardData.widgets.splice(widgetIndex, 1);
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
