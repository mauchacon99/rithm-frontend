import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { OrganizationService } from 'src/app/core/organization.service';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { User, OrganizationInfo, MapMode } from 'src/models';
import { MapService } from '../map.service';
import { Subject } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
/**
 * Component for managing the toolbar on the map.
 */
@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss'],
})
export class MapToolbarComponent implements OnInit, OnDestroy {
  /** The users of the current organization. */
  users: User[] = [];

  /** Whether the organization information is being loaded. */
  isLoading = true;

  /** The organization information object. */
  orgInfo?: OrganizationInfo;

  /** Variable to store current map mode. */
  mapMode = MapMode.View;

  /** Destroyed. */
  private destroyed$ = new Subject<void>();

  /**
   * Whether the map is in build, stationAdd, or stationGroupAdd mode.
   *
   * @returns True if the map is in any building mode, false otherwise.
   */
  get isBuilding(): boolean {
    return (
      this.mapMode === MapMode.Build ||
      this.mapMode === MapMode.StationAdd ||
      this.mapMode === MapMode.StationGroupAdd
    );
  }

  /**
   * Add station mode active.
   *
   * @returns Boolean.
   */
  get stationAddActive(): boolean {
    return this.mapMode === MapMode.StationAdd;
  }

  /**
   * Add station group mode active.
   *
   * @returns Boolean.
   */
  get stationGroupAddActive(): boolean {
    return this.mapMode === MapMode.StationGroupAdd;
  }

  constructor(
    private userService: UserService,
    private organizationService: OrganizationService,
    private errorService: ErrorService,
    private mapService: MapService
  ) {
    //Subscribe to mapMode in mapService.
    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mode) => {
        //Get local mapMode to match the mode from mapService.
        this.mapMode = mode;
      });
  }

  /**
   * Gets an organization's information to display on the toolbar on load.
   */
  ngOnInit(): void {
    //Get the information needed to display an organization's name.
    this.getOrganizationInfo();
  }

  /**
   * Method called when a user clicks the add group button.
   * Sets the map to add station group mode in preparation for a station group to be selected.
   */
  addStationGroup(): void {
    if (!this.stationGroupAddActive) {
      this.mapService.mapMode$.next(MapMode.StationGroupAdd);
      this.mapService.matMenuStatus$.next(true);
    } else {
      this.mapService.mapMode$.next(MapMode.Build);
      if (
        this.mapService.stationElements.some((station) => station.selected) ||
        this.mapService.stationGroupElements.some(
          (stationGroup) => stationGroup.selected
        )
      ) {
        this.mapService.resetSelectedStationGroupStationStatus();
      }
    }
    // TODO: Implement add station group.
  }

  /**
   * Method called when a user clicks the add station button.
   * Sets the map to add station mode in preparation for a station to be selected.
   */
  addStation(): void {
    if (!this.stationAddActive) {
      this.mapService.mapMode$.next(MapMode.StationAdd);
      this.mapService.matMenuStatus$.next(true);
    } else {
      this.mapService.mapMode$.next(MapMode.Build);
      if (this.mapService.stationElements.some((e) => e.isAddingConnected)) {
        this.mapService.disableConnectedStationMode();
        this.mapService.mapDataReceived$.next(true);
      }
    }
    // TODO: Implement add station
  }

  // MVP +1 below

  // undo(): void {}
  // redo(): void {}
  // search(): void {}

  /**
   * Gets an organization's information so that can be used for display.
   */
  getOrganizationInfo(): void {
    //get the id of the organization the signed-in user belongs to.
    const organizationId: string = this.userService.user?.organization;
    //Subscribe to the organization service.
    this.organizationService
      .getOrganizationInfo(organizationId)
      .pipe(first())
      .subscribe({
        next: (organization) => {
          //Note that information has been received.
          this.isLoading = false;
          //If there is a defined organization.
          if (organization) {
            //Set this.orgInfo to the org.
            this.orgInfo = organization;
          }
        },
        error: (error: unknown) => {
          let errorMessage =
            "Something went wrong on our end and we're looking into it. Please try again in a little while.";
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case HttpStatusCode.Unauthorized:
                errorMessage =
                  'The user does not have rights to access the map.';
            }
          }
          //Set isLoading to false after error.
          this.isLoading = false;
          //Display error for user.
          this.errorService.displayError(errorMessage, error);
        },
      });
  }

  /**
   * Cleanup method.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
