import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  DashboardData,
  DashboardItem,
  EditDataWidget,
  ReloadStationFlow,
  RoleDashboardMenu,
  WidgetType,
} from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { PopupService } from 'src/app/core/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { AddWidgetModalComponent } from 'src/app/dashboard/widget-modal/add-widget-modal/add-widget-modal.component';
import { MobileBrowserChecker } from 'src/helpers';
import { HttpErrorResponse } from '@angular/common/http';

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
   * Get disable close drawer with Esc or click outside.
   *
   * @returns If is disabled the drawer.
   */
  get drawerDisableClose(): boolean {
    return this.sidenavDrawerService.getDisableCloseDrawerOutside;
  }

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Dashboard data, default dashboard general. */
  dashboardData!: DashboardData;

  /** Dashboard data Copy for save original data in mode edit. */
  dashboardDataCopy!: DashboardData;

  /** Reload station when document has flow. */
  stationFlow!: ReloadStationFlow;

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  /** Enum widget type. */
  enumWidgetType = WidgetType;

  /** If it needs to create new dashboard. */
  isCreateNewDashboard = false;

  /** Error Loading dashboard. */
  errorLoadingDashboard = false;

  /** View the button Add Widget in edit mode. */
  isAddWidget = false;

  /** If can assign user. */
  canAssignUserWidget = false;

  /** Load indicator in dashboard. */
  isLoading = false;

  /** Edit mode toggle for widgets and dashboard name. */
  editMode = false;

  /** Show setting button widget. */
  showButtonSetting = false;

  /** Show only button delete widget in drawer. */
  deleteWidget = false;

  /** Permission dashboard. */
  dashboardPermission = false;

  /** Show detail dashboard popover. */
  showDetailWidgetPopover = false;

  /** If user can update grid. */
  isUpdateGrid = false;

  /** Show the dashboard menu. */
  drawerContext: 'menuDashboard' | 'widgetDashboard' = 'menuDashboard';

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
    disableWarnings: true,
  };

  constructor(
    private userService: UserService,
    private splitService: SplitService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private popupService: PopupService,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public mobileBrowserChecker: MobileBrowserChecker
  ) {}

  /**
   * Initialize split on page load.
   */
  ngOnInit(): void {
    this.setConfigMobileGridster();
    this.subscribeIsLoadingDashboardService$();
    this.subscribeDrawerContext$();
    this.subscribeDrawerDataWidget$();
    this.split();
    this.getParams();
    this.sidenavDrawerService.setDrawer(this.drawer);

    //Sets height using a css variable. This allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dashboardvh', `${vh}px`);
  }

  /** Set config break point in mobile. */
  private setConfigMobileGridster(): void {
    this.options.mobileBreakpoint = this.mobileBrowserChecker.isMobileDevice
      ? 1920
      : 640;
    this.changedOptions();
  }

  /** Get loading in service dashboard for show loading in dashboard component. */
  private subscribeIsLoadingDashboardService$(): void {
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
  }

  /** Get drawer context. */
  private subscribeDrawerContext$(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerContext) => {
        if (
          drawerContext === 'menuDashboard' ||
          drawerContext === 'widgetDashboard'
        ) {
          this.drawerContext = drawerContext;
        }
      });
  }

  /** Update data in specific widget. */
  private subscribeDrawerDataWidget$(): void {
    this.dashboardService.updateDataWidget$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((editDataWidget) => {
        this.updateDashboardWidget(editDataWidget);
      });
  }

  /** Split Service. */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.showButtonSetting =
          this.splitService.getConfigWidgetsTreatment() === 'on';
        this.isAddWidget =
          this.splitService.getDashboardLibraryTreatment() === 'on';
        this.canAssignUserWidget =
          this.splitService.getAssignUserWidgetTreatment() === 'on';
        this.showDetailWidgetPopover =
          this.splitService.getFieldDetailDashboardPopoverTreatment() === 'on';
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
    drawerItem: 'menuDashboard' | 'widgetDashboard',
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
   * @param quantityElementsWidget Number of items to be displayed in the widget.
   */
  toggleWidgetDrawer(
    widgetItem: DashboardItem,
    widgetIndex: number,
    quantityElementsWidget: number
  ): void {
    const contextDrawerWidget = 'widgetDashboard';
    this.toggleDrawer(contextDrawerWidget, {
      widgetItem,
      widgetIndex,
      quantityElementsWidget,
      deleteWidget: this.deleteWidget,
    });
    this.deleteWidget = false;
  }

  /** Open drawer only button delete widget. */
  removeWidget(): void {
    this.deleteWidget = true;
    this.editMode = true;
    this.configEditMode();
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

        if (
          this.returnWidgetsCompared(this.dashboardDataCopy.widgets) ===
          this.returnWidgetsCompared(this.dashboardData.widgets)
        ) {
          this.dashboardData = JSON.parse(
            JSON.stringify(this.dashboardDataCopy)
          );
        } else {
          this.getParams();
        }
        this.configEditMode();
        this.toggleDrawerOnlyForWidgets();
      }
    } else {
      this.dashboardData = JSON.parse(JSON.stringify(this.dashboardDataCopy));
      this.editMode = true;
      for (const gridsterItem of this.elementRef.nativeElement.querySelectorAll(
        'gridster-item'
      )) {
        this.renderer.removeClass(
          gridsterItem,
          'gridster-item-mobile-expanded'
        );
      }
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
   * @param isDefault Boolean if the dashboard to load is default.
   */
  private getDashboardByRithmId(
    dashboardRithmId: string,
    isDefault = false
  ): void {
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
          this.dashboardPermission =
            this.dashboardData.isEditable || this.isAdmin;
          this.isLoading = false;
          this.getQueryParams();
        },
        error: (error: unknown) => {
          this.errorLoadingDashboard = true;
          this.isLoading = false;
          const { status } = error as HttpErrorResponse;
          if (isDefault && status === 400) {
            this.getOrganizationDashboard();
            this.setNullDashboardUser();
          } else {
            this.router.navigateByUrl('dashboard');
          }
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
    this.setConfigMobileGridster();
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
          this.getDefaultDashboard();
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

  /** Get query params to toggle edit mode. */
  private getQueryParams(): void {
    this.route.queryParams.pipe(first()).subscribe((queryParams) => {
      this.editMode =
        this.isAdmin ||
        (this.dashboardData.type === this.roleDashboardMenu.Personal &&
          this.dashboardData.isEditable)
          ? queryParams['editMode'] === 'true'
          : false;
      this.configEditMode();
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
            this.dashboardPermission =
              this.dashboardData.isEditable || this.isAdmin;
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
   * Parse dashboardData widgets rithmId.
   *
   * @returns DashboardData parsed.
   */
  private parseDashboardData(): DashboardData {
    const dashboardData = JSON.parse(
      JSON.stringify(this.dashboardData)
    ) as DashboardData;
    dashboardData.widgets.map((widget, index) => {
      if (widget.rithmId.includes('TEMPID')) {
        dashboardData.widgets[index].rithmId = '';
      }
    });
    dashboardData.name = dashboardData.name.trim()
      ? dashboardData.name.trim()
      : 'Untitled Dashboard';
    return dashboardData;
  }

  /** Update dashboard. */
  updateDashboard(): void {
    this.toggleDrawerOnlyForWidgets();
    this.isLoading = true;
    this.errorLoadingDashboard = false;
    const bodyDashboardData = this.parseDashboardData();
    const updateDashboard$ =
      this.dashboardData.type === this.roleDashboardMenu.Company
        ? this.dashboardService.updateOrganizationDashboard(bodyDashboardData)
        : this.dashboardService.updatePersonalDashboard(bodyDashboardData);
    updateDashboard$.pipe(first()).subscribe({
      next: (dashboardUpdate) => {
        this.dashboardData = dashboardUpdate;
        this.dashboardDataCopy = JSON.parse(JSON.stringify(this.dashboardData));
        this.editMode = false;
        this.configEditMode();
        this.errorLoadingDashboard = false;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.errorLoadingDashboard = true;
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
  }

  /**
   * Expand widget selected.
   *
   * @param widgetIndex String of the rithmId widget.
   * @param isExpandWidget Boolean if is expand widget.
   */
  toggleExpandWidget(widgetIndex: number, isExpandWidget: boolean): void {
    const gridsterItem = this.elementRef.nativeElement.querySelector(
      '#gridster-item-' + widgetIndex
    );
    if (isExpandWidget) {
      this.dashboardData.widgets[widgetIndex].rows++;
      this.dashboardData.widgets[widgetIndex].layerIndex = 2;
      this.renderer.addClass(gridsterItem, 'gridster-item-mobile-expanded');
    } else {
      this.dashboardData.widgets[widgetIndex].layerIndex = 1;
      this.dashboardData.widgets[widgetIndex] = JSON.parse(
        JSON.stringify(this.dashboardDataCopy)
      ).widgets[widgetIndex];
      this.renderer.removeClass(gridsterItem, 'gridster-item-mobile-expanded');
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

  /**
   * Open dialog add widget.
   */
  openDialogAddWidget(): void {
    const dialog = this.dialog.open(AddWidgetModalComponent, {
      panelClass: [
        'w-11/12',
        'sm:w-4/5',
        'h-[95%]',
        'sm:h-5/6',
        'custom-margin-modal',
      ],
      maxWidth: '1500px',
      data: {
        dashboardRithmId: this.dashboardData.rithmId,
        showDetailWidgetPopover: this.showDetailWidgetPopover,
        canAssignUserWidget: this.canAssignUserWidget,
      },
    });
    dialog
      .afterClosed()
      .pipe(first())
      .subscribe((widgetItem: DashboardItem) => {
        if (widgetItem) {
          this.dashboardData.widgets.push(widgetItem);
        }
      });
  }

  /** Load dashboard by default dashboard by user. */
  private getDefaultDashboard(): void {
    const user = this.userService.user;
    if (user && user.defaultDashboardId && user.defaultDashboardType) {
      this.getDashboardByRithmId(user.defaultDashboardId, true);
    } else {
      this.getOrganizationDashboard();
    }
  }

  /** Set dashboard to null when the dashboard default does not exist. */
  private setNullDashboardUser(): void {
    this.userService
      .updateUserAccount({
        defaultDashboardType: '',
        defaultDashboardId: '',
      })
      .pipe(first())
      .subscribe({
        error: (error: unknown) => {
          this.errorService.logError(error);
        },
      });
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.sidenavDrawerService.setDisableCloseDrawerOutside();
  }
}
