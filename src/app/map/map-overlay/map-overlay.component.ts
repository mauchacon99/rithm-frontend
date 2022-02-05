import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { MapItemStatus, MapMode, Point, User } from 'src/models';
import { MapService } from 'src/app/map/map.service';
import { PopupService } from 'src/app/core/popup.service';
import { StationMapElement } from 'src/helpers';
import {
  BUTTON_ZOOM_COUNT_INCREMENT,
  DEFAULT_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_RENDER_STATION_ELEMENTS,
  ZOOM_VELOCITY,
} from '../map-constants';
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
  styleUrls: ['./map-overlay.component.scss'],
})
export class MapOverlayComponent implements OnInit, OnDestroy {
  /** The current signed-in user. */
  currentUser!: User;

  /** Is the user an admin? */
  isAdmin = false;

  /** The component for the drawer that will show the info for a map element. */
  @ViewChild('mapElementDrawer', { static: true })
  mapElementDrawer!: MatDrawer;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** The current mode of the map. */
  currentMode = MapMode.View;

  /** Map data request loading indicator. */
  mapDataLoading = true;

  /** User has selected and opened the dropdown menu on a station. */
  private openedMenuStation?: StationMapElement;

  /** Map scale. */
  mapScale = DEFAULT_SCALE;

  /** Used to track the X coord of the cursor while interacting with option button. */
  menuX = 0;

  /** Used to track the Y coord of the cursor while interacting with option button. */
  menuY = 0;

  /** The MatMenu displayed on option button click. */
  @ViewChild(MatMenuTrigger, { static: false })
  menu!: MatMenuTrigger;

  /** Store the Zoom level that build mode can be enabled at. */
  zoomBuild = SCALE_RENDER_STATION_ELEMENTS;

  /**Track zoomCount. This count determines the number of times to run a zoom function and whether to zoom in or out.*/
  zoomCount = 0;

  /** Notes when no station option menu is open. */
  optionMenuNone = false;

  /** A variable that allows us to compare against the current Map mode in html. */
  mapMode = MapMode;

  /** Whether the called info-drawer is documentInfo type or stationInfo. */
  drawerMode: '' | 'stationInfo' | 'connectionInfo' | 'stationGroupInfo' = '';

  /**
   * Whether the map is in any building mode.
   *
   * @returns True if the map is in any building mode, false otherwise.
   */
  get isBuilding(): boolean {
    return (
      this.currentMode === MapMode.Build ||
      this.currentMode === MapMode.StationAdd ||
      this.currentMode === MapMode.StationGroupAdd
    );
  }

  /**
   * Whether the map is in stationAdd or StationGroupAdd mode.
   *
   * @returns True if the map is in stationAdd or StationGroupAdd mode, false otherwise.
   */
  get isStationOrStationGroupAdd(): boolean {
    return (
      this.currentMode === MapMode.StationAdd ||
      this.currentMode === MapMode.StationGroupAdd
    );
  }

  /**
   * Whether to show the backdrop for the drawer.
   *
   * @returns Whether to show the backdrop.
   */
  get drawerHasBackdrop(): boolean {
    return this.sidenavDrawerService.drawerHasBackdrop;
  }

  /**
   * Disable publish button until there are some changes in map/station.
   *
   * @returns Returns true if no stations are updated and false if any station is updated.
   * TODO: Am I crazy or is this backwards of how it should work?
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
    //Track map mode as it changes.
    this.mapService.mapMode$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (mapMode) => {
        this.currentMode = mapMode;
      },
      error: (error: unknown) => {
        throw new Error(`Map overlay subscription error: ${error}`);
      },
    });

    //Track when new map changes are made.
    this.mapService.mapDataReceived$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((received) => {
        //Hide loading indicator once new map data has be received.
        if (received === true) {
          this.mapDataLoading = false;
        }
      });

    //Track the map scale as it changes.
    this.mapService.mapScale$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((scale) => {
        this.mapScale = scale;
      });

    //Track which, if any, station option button is clicked.
    this.mapService.stationButtonClick$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((clickRes) => {
        //If a button was clicked and the map is in build mode.
        if (
          clickRes.click &&
          this.mapService.mapMode$.value === MapMode.Build
        ) {
          //Open where the mouse currently is.
          this.optionMenuTrigger(this.mapService.currentMousePoint$.value);
          //Set openedMenuStation.
          this.openedMenuStation = clickRes.data as StationMapElement;
          //Reset stationButtonClick.
          this.mapService.stationButtonClick$.next({ click: false, data: {} });
        }
      });

    //Track the current zoomCount.
    this.mapService.zoomCount$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((count) => {
        this.zoomCount = count;
      });

    //Note if cursor clicks somewhere that will close the option menu.
    this.mapService.matMenuStatus$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((click) => {
        if (click) {
          //Close the menu.
          this.closeOptionMenu();
          //Note there is no menu open.
          this.mapService.matMenuStatus$.next(false);
        }
      });

    //Track the current drawerContext.
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        //If the drawerContext is a usable context.
        if (
          data === 'connectionInfo' ||
          data === 'stationInfo' ||
          data === 'stationGroupInfo'
        ) {
          //Set drawerMode to the current data.
          this.drawerMode = data;
        }
      });
  }

  /**
   * Gets info about the mat-drawer toggle and determines user permissions.
   */
  ngOnInit(): void {
    //Store the user information.
    this.currentUser = this.userService.user;
    //Check if user is an admin.
    this.isAdmin = this.currentUser.role === 'admin';
    //Set which drawer type to open.
    this.sidenavDrawerService.setDrawer(this.mapElementDrawer);
  }

  /**
   * Cleans up subscription.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.mapService.mapMode$.next(MapMode.View);
    this.mapService.mapDataReceived$.next(false);
  }

  /**
   * Zoom in/out button state Enable and disable when limits has been reached.
   *
   * @param zoom Zoom in/out buttons.
   * @returns Disable zoom button state if limits are reached.
   */
  isZoomEnabled(zoom: number): boolean {
    //Zoom in button.
    if (zoom === 1) {
      //If mapScale is at max, disable zoom in button.
      return this.mapScale >= MAX_SCALE;
    }
    //Zoom out button.
    if (zoom === 0) {
      //disable zooming out past a certain point when not in view mode.
      if (
        this.mapScale <= this.zoomBuild / ZOOM_VELOCITY &&
        this.currentMode !== MapMode.View
      ) {
        return true;
      }
      //If mapScale is at min, disable zoom out button.
      return this.mapScale <= MIN_SCALE;
    }
    //Return false by default.
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
    //Close any open station option menus.
    this.mapService.matMenuStatus$.next(true);
    //Open popup and store user response as boolean.
    const confirm = await this.popupService.confirm({
      title: 'Publish Map Changes',
      // eslint-disable-next-line max-len
      message: `The map changes that you have made will be published and be made available for all users of the organization. Are you ready to do this?`,
      okButtonText: 'Okay',
    });
    //If user accepts.
    if (confirm) {
      //Show loading indicator.
      this.mapDataLoading = true;
      //Set the map mode to view.
      this.mapService.mapMode$.next(MapMode.View);
      //Call the api to post changes to the server.
      this.mapService
        .publishMap()
        .pipe(first())
        .subscribe({
          next: () => {
            //Hide loading indicator.
            this.mapDataLoading = false;
            this.popupService.notify('Map data published successfully.');
          },
          error: (error: unknown) => {
            //Reset title of station group if API fails.
            const updatedStationGroups =
              this.mapService.stationGroupElements.filter(
                (stationGroup) => stationGroup.status !== MapItemStatus.Normal
              );
            updatedStationGroups.forEach((stGroup) => {
              const index =
                this.mapService.storedStationGroupElements.findIndex(
                  (group) => group.rithmId === stGroup.rithmId
                );
              stGroup.title =
                this.mapService.storedStationGroupElements[index].title;
            });
            //Hide loading indicator.
            this.mapDataLoading = false;
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error,
              true
            );
          },
        });
    }
  }

  /**
   * Cancels the map changes and returns to view mode.
   */
  async cancel(): Promise<void> {
    //Close any open station option menus.
    this.mapService.matMenuStatus$.next(true);
    //If map doesn't have changes allow cancel, otherwise popup and store user response as boolean.
    const confirm = !this.mapHasChanges
      ? true
      : await this.popupService.confirm({
          title: 'Confirmation',
          message: `Are you sure you want to cancel these changes? All map changes will be lost`,
          okButtonText: 'Confirm',
        });
    //If user accepts, or there are no changes.
    if (confirm) {
      //Call method to run logic for cancelling.
      this.mapService.cancelMapChanges();
    }
  }

  /**
   * Center the map on its center point.
   */
  center(): void {
    //Close any open station option menus.
    this.mapService.matMenuStatus$.next(true);
    //Note that centering is beginning, this is necessary to allow recursive calls to the center() method.
    this.mapService.centerActive$.next(true);
    //Increment centerCount to show that more centering needs to be done.
    this.mapService.centerCount$.next(1);
    //Call method to run logic for centering.
    this.mapService.center();
  }

  /**
   * Zooms the map in to center of screen.
   */
  zoomIn(): void {
    //Close any open station option menus.
    this.mapService.matMenuStatus$.next(true);
    //Increment zoomCount so handleZoom knows how much zoom in is needed.
    this.mapService.zoomCount$.next(
      this.zoomCount + BUTTON_ZOOM_COUNT_INCREMENT
    );
    //Call method to run logic for zoom.
    this.mapService.handleZoom(false);
  }

  /**
   * Zooms the map out from center of screen.
   */
  zoomOut(): void {
    //Close any open station option menus.
    this.mapService.matMenuStatus$.next(true);
    //Decrement zoomCount so handleZoom knows how much zoom out is needed.
    this.mapService.zoomCount$.next(
      this.zoomCount - BUTTON_ZOOM_COUNT_INCREMENT
    );
    //Call method to run logic for zoom.
    this.mapService.handleZoom(false);
  }

  /**
   * Display option menu for station after option button is clicked.
   *
   * @param point The points coordinates values.
   */
  optionMenuTrigger(point: Point): void {
    //Note that an option menu is now open.
    this.optionMenuNone = false;
    //Tells menu where to open up.
    this.menuX = point.x - 15;
    this.menuY = point.y + 63;
    //Run methods to see if menu should be opened or closed.
    this.menu.closeMenu();
    this.menu.openMenu();
  }

  /**
   * Close option option for station.
   *
   */
  closeOptionMenu(): void {
    //Note that no option menu is open.
    this.optionMenuNone = true;
    //Resets menu location to default
    this.menuX = -1;
    this.menuY = -1;
    //Run method to close the menu.
    this.menu.closeMenu();
    //Reset property where station where menu should be opened was stored.
    this.openedMenuStation = undefined;
  }

  /**
   * Sets the status of a station to delete.
   */
  async deleteStation(): Promise<void> {
    //Open popup and store user response as boolean.
    const confirm = await this.popupService.confirm({
      title: 'Are you sure?',
      message: `The station will be deleted for everyone and any documents not moved to another station beforehand will be deleted.`,
      okButtonText: 'Confirm',
      important: true,
    });
    //If user accepts.
    if (confirm) {
      if (!this.openedMenuStation) {
        throw new Error(
          `Attempting to delete a station and remove all connections for a station that has not been defined.`
        );
      }
      //Before we delete the station we need to remove any connections to it.
      this.mapService.removeAllStationConnections(
        this.openedMenuStation.rithmId
      );
      //Delete the station.
      this.mapService.deleteStation(this.openedMenuStation.rithmId);
      //TODO: Update to check that the drawer being closed is the drawer that is deleted.
      //Close drawer so that user can't access deleted station anymore.
      this.sidenavDrawerService.closeDrawer();
    }
  }

  /**
   * Removes all connections for a station.
   */
  async removeStationConnections(): Promise<void> {
    //Open popup and store user response as boolean.
    const confirm = await this.popupService.confirm({
      title: 'Are you sure?',
      message: `This will remove all connections to and from this station and any associated flow logic. This action cannot be undone.`,
      okButtonText: 'Confirm',
      important: true,
    });
    //If user accepts.
    if (confirm) {
      if (!this.openedMenuStation) {
        throw new Error(
          'Attempting to remove connections for a station that has not been defined'
        );
      }
      //Remove any connections to this station.
      this.mapService.removeAllStationConnections(
        this.openedMenuStation.rithmId
      );
    }
  }

  /**
   * Creates a new station with connection line from the current/selected station.
   */
  createConnectedStation(): void {
    //run logic to see if connected station mode should be enabled.
    this.mapService.disableConnectedStationMode();
    if (!this.openedMenuStation) {
      throw new Error(
        `Attempting to create a new connected station for a station that has not been defined`
      );
    }
    //Find the station who's menu is open.
    const index = this.mapService.stationElements.findIndex(
      (station) => station.rithmId === this.openedMenuStation?.rithmId
    );
    // If index was set properly.
    if (index >= 0) {
      //Set isAddingConnected to true for station.
      this.mapService.stationElements[index].isAddingConnected = true;
      //Set mapMode to stationAdd.
      this.mapService.mapMode$.next(MapMode.StationAdd);
    } else {
      throw new Error(
        `No index found to create connected station ${this.openedMenuStation.rithmId}`
      );
    }
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationGroupInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }
}
