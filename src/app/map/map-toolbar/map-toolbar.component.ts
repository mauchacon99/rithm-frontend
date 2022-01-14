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
  /** The users of the organization. */
  users: User[] = [];

  /** Whether the organization is being loaded. */
  isLoading = true;

  /** The organization information object. */
  orgInfo?: OrganizationInfo;

  /** Variable to store current map mode. */
  mapMode = MapMode.View;

  /** Destroyed. */
  private destroyed$ = new Subject<void>();

  /**
   * Whether the map is in any building mode.
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
    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mode) => {
        this.mapMode = mode;
      });
  }

  /**
   * Gets the first page of users on load.
   */
  ngOnInit(): void {
    this.getOrganizationInfo();
  }

  /**
   * Sets the map to add station group mode in preparation for a station group to be selected.
   */
  addStationGroup(): void {
    if (!this.stationGroupAddActive) {
      this.mapService.mapMode$.next(MapMode.StationGroupAdd);
      this.mapService.matMenuStatus$.next(true);
    } else {
      this.mapService.mapMode$.next(MapMode.Build);
    }
    // TODO: Implement add station group.
  }

  /**
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
   * Gets organization information.
   */
  getOrganizationInfo(): void {
    const organizationId: string = this.userService.user?.organization;
    this.organizationService
      .getOrganizationInfo(organizationId)
      .pipe(first())
      .subscribe({
        next: (organization) => {
          this.isLoading = false;
          if (organization) {
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
          this.isLoading = false;
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
