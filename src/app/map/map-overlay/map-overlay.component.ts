import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { MapMode, Point, User } from 'src/models';
import { MapService } from 'src/app/map/map.service';
import { PopupService } from 'src/app/core/popup.service';
import { StationMapElement } from 'src/helpers';
import { DEFAULT_SCALE, MAX_SCALE, MIN_SCALE, SCALE_RENDER_STATION_ELEMENTS, ZOOM_VELOCITY } from '../map-constants';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDrawer } from '@angular/material/sidenav';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component for the elements overlaid on top of the map canvas.
 */
@Component({
  selector: 'app-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.scss']
})
export class MapOverlayComponent implements OnInit, OnDestroy {

  /** The current signed-in user. */
  currentUser!: User;

  /** Is the user an admin? */
  isAdmin = false;

  /** The component for the drawer that houses comments and history. */
  @ViewChild('deleteDrawer', { static: true })
  deleteDrawer!: MatDrawer;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** The current mode of the map. */
  currentMode = MapMode.View;

  /** Map data request loading indicator. */
  mapDataLoading = true;

  /** Station user has selected and opened the dropdown menu. */
  private openedMenuStation?: StationMapElement;

  /** Map scale. */
  mapScale = DEFAULT_SCALE;

  /** Used to track map cursor point option button. */
  menuX = 0;

  /** Used to track map cursor point option button. */
  menuY = 0;

  /** The MatMenu displayed on option button click. */
  @ViewChild(MatMenuTrigger, { static: false })
  menu!: MatMenuTrigger;

  /** Zoom level build enabled. */
  zoomBuild = SCALE_RENDER_STATION_ELEMENTS;

  /**Track zoomCount. */
  zoomCount = 0;

  /** Option menu button cursor handler. */
  optionMenuNone = false;

  /** Map mode variable form comparison in html. */
  mapMode = MapMode;

  /** Whether the called info-drawer is documentInfo type or stationInfo. */
  drawerMode: '' | 'stationInfo' | 'connectionInfo' = '';

  /**
   * Whether the map is in any building mode.
   *
   * @returns True if the map is in any building mode, false otherwise.
   */
  get isBuilding(): boolean {
    return this.currentMode === MapMode.Build || this.currentMode === MapMode.StationAdd || this.currentMode === MapMode.StationGroupAdd;
  }

  /**
   * Station the map is in stationAdd or FlowAdd mode.
   *
   * @returns True if the map is in stationAdd or FlowAdd mode, false otherwise.
   */
  get isStationOrFlowAdd(): boolean {
    return this.currentMode === MapMode.StationAdd || this.currentMode === MapMode.StationGroupAdd;
  }

  /**
   * Whether to show the backdrop for the comment and history drawers.
   *
   * @returns Whether to show the backdrop.
   */
  get drawerHasBackdrop(): boolean {
    return this.sidenavDrawerService.drawerHasBackdrop;
  }

  /**
   * Disable publish button until some changes in map/station.
   *
   * @returns Returns true if no stations are updated and false if any station is updated.
   */
  get mapHasChanges(): boolean {
    return this.mapService.mapHasChanges;
  }

  constructor(
    private mapService: MapService,
    private popupService: PopupService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService
  ) {
    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (mapMode) => {
          this.currentMode = mapMode;
        }, error: (error: unknown) => {
          throw new Error(`Map overlay subscription error: ${error}`);
        }
      });

    this.mapService.mapDataReceived$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((received) => {
        if (received === true) {
          this.mapDataLoading = false;
        }
      });

    this.mapService.mapScale$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((scale) => {
        this.mapScale = scale;
      });

    this.mapService.stationButtonClick$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((clickRes) => {
        if (clickRes.click && this.mapService.mapMode$.value === MapMode.Build) {
          this.optionMenuTrigger(this.mapService.currentMousePoint$.value);
          this.openedMenuStation = clickRes.data as StationMapElement;
          this.mapService.stationButtonClick$.next({ click: false, data: {} });
        }
      });

    this.mapService.zoomCount$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((count) => {
        this.zoomCount = count;
      });
    this.mapService.matMenuStatus$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((click) => {
        if (click) {
          this.closeOptionMenu();
          this.mapService.matMenuStatus$.next(false);
        }
      });
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data === 'connectionInfo' || data === 'stationInfo') {
          this.drawerMode = data;
        }
      }
      );
  }

  /**
   * Gets info about the mat-drawer toggle and determines user permissions.
   */
  ngOnInit(): void {
    this.currentUser = this.userService.user;
    this.isAdmin = this.currentUser.role === 'admin' ? true : false;
    this.sidenavDrawerService.setDrawer(this.deleteDrawer);
  }

  /**
   * Cleans up subscription.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.mapService.mapMode$.next(MapMode.View);
  }

  /**
   * Zoom in/out button state Enable and disable when limits has been reached.
   *
   * @param zoom Zoom in/out buttons.
   * @returns Disable zoom button state if limits are reached.
   */
  isZoomEnabled(zoom: number): boolean {
    //TODO: Simplify this. What is zoom?
    if (zoom === 1) {
      return this.mapScale >= MAX_SCALE;
    }
    if (zoom === 0) {
      //disable zooming out past a certain point when in build mode.
      if (this.mapScale <= this.zoomBuild / ZOOM_VELOCITY && this.currentMode !== MapMode.View) {
        return true;
      }
      return this.mapScale <= MIN_SCALE;
    }
    return false;
  }

  /**
   * Enters build mode for the map.
   */
  build(): void {
    this.mapService.buildMap();
  }

  /**
   * Publishes map changes.
   */
  async publish(): Promise<void> {
    this.mapService.matMenuStatus$.next(true);
    const confirm = await this.popupService.confirm({
      title: 'Publish Map Changes',
      // eslint-disable-next-line max-len
      message: `The map changes that you have made will be published and be made available for all users of the organization. Are you ready to do this?`,
      okButtonText: 'Okay',
    });
    if (confirm) {
      this.mapDataLoading = true;
      this.mapService.publishMap()
        .pipe(first())
        .subscribe({
          next: () => {
            this.mapDataLoading = false;
            this.mapService.mapMode$.next(MapMode.View);
            this.popupService.notify('Map data published successfully.');
          }, error: (error: unknown) => {
            this.mapDataLoading = false;
            this.errorService.displayError(
              'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
              error,
              true
            );
          }
        });
    }
  }

  /**
   * Cancels the map changes and returns to view mode.
   *
   */
  async cancel(): Promise<void> {
    this.mapService.matMenuStatus$.next(true);
    const confirm = !this.mapHasChanges ? true : await this.popupService.confirm({
      title: 'Confirmation',
      message: `Are you sure you want to cancel these changes? All map changes will be lost`,
      okButtonText: 'Confirm',
    });
    if (confirm) {
      this.mapService.cancelMapChanges();
    }
  }

  /**
   * Center the map on its center point.
   */
  center(): void {
    this.mapService.centerActive$.next(true);
    this.mapService.centerCount$.next(1);
    this.mapService.center();
  }

  /**
   * Zooms the map in to center of screen.
   */
  zoomIn(): void {
    this.mapService.matMenuStatus$.next(true);
    this.mapService.zoomCount$.next(this.zoomCount + 50); //TODO: Magic number. Also in zoomOut.
    this.mapService.handleZoom(false);
  }

  /**
   * Zooms the map out from center of screen.
   */
  zoomOut(): void {
    this.mapService.matMenuStatus$.next(true);
    this.mapService.zoomCount$.next(this.zoomCount - 50);
    this.mapService.handleZoom(false);
  }

  /**
   * Display menu option for station on option button is clicked.
   *
   * @param point The points coordinates values.
   */
  optionMenuTrigger(point: Point): void { //TODO: Add more specific name.
    this.optionMenuNone = false;
    this.menuX = point.x - 15;
    this.menuY = point.y + 63;
    this.menu.closeMenu();
    this.menu.openMenu();
  }

  /**
   * Close display menu option to default state.
   *
   */
  closeOptionMenu(): void {
    this.optionMenuNone = true;
    this.menuX = -1;
    this.menuY = -1;
    this.menu.closeMenu();
    this.openedMenuStation = undefined;
  }

  /**
   * Updates station status to delete.
   */
  async deleteStation(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Are you sure?',
      message: `The station will be deleted for everyone and any documents not moved to another station beforehand will be deleted.`,
      okButtonText: 'Confirm',
      important: true
    });
    if (confirm) {
      if (!this.openedMenuStation) {
        throw new Error(`Attempting to delete a station and remove all connections for a station that has not been defined.`);
      }
      this.mapService.removeAllStationConnections(this.openedMenuStation.rithmId);
      this.mapService.deleteStation(this.openedMenuStation.rithmId);
      //TODO: Update to check that the drawer being closed is the drawer that is deleted.
      this.sidenavDrawerService.closeDrawer();
    }
  }

  /**
   * Removes all connections for a station.
   */
  async removeStationConnections(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Are you sure?',
      message: `This will remove all connections to and from this station and any associated flow logic. This action cannot be undone.`,
      okButtonText: 'Confirm',
      important: true
    });
    if (confirm) {
      if (!this.openedMenuStation) {
        throw new Error('Attempting to remove connections for a station that has not been defined');
      }
      this.mapService.removeAllStationConnections(this.openedMenuStation.rithmId);
    }
  }

  /**
   * Creates a new station with connection line from the current/selected station.
   */
  createConnectedStation(): void {
    this.mapService.disableConnectedStationMode();
    if (!this.openedMenuStation) {
      throw new Error(`Attempting to create a new connected station for a station that has not been defined`);
    }
    const index = this.mapService.stationElements.findIndex(station => station.rithmId === this.openedMenuStation?.rithmId);
    if (index >= 0) {
        this.mapService.stationElements[index].isAddingConnected = true;
        this.mapService.mapMode$.next(MapMode.StationAdd);
    } else {
      throw new Error(`No index found to create connected station ${this.openedMenuStation.rithmId}`);
    }
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'connectionInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }
}
