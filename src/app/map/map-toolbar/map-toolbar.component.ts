import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { OrganizationService } from 'src/app/core/organization.service';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { User, OrganizationInfo, MapMode, DialogData } from 'src/models';
import { MapService } from '../map.service';
import { Subject } from 'rxjs';
import { PopupService } from '../../core/popup.service';

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

  /** The organization information object. */
  orgInfo?: OrganizationInfo;

  /** Variable to store current map mode. */
  mapMode = MapMode.view;

  /** Destroyed. */
  private destroyed$ = new Subject();

  /**
   * Add station mode active.
   *
   * @returns Boolean.
   */
  get stationAddActive(): boolean {
    if (this.mapMode === MapMode.stationAdd) {
      return true;
    }
    return false;
  }

	constructor(
		private userService: UserService,
		private organizationService: OrganizationService,
		private errorService: ErrorService,
    private mapService: MapService,
    private popupService: PopupService
	) {
    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mode) => {
        this.mapMode = mode;
      }, (error: unknown) => {
        console.error(error);
      });
  }

  /**
   * Gets the first page of users on load.
   */
  ngOnInit(): void {
    this.getOrganizationInfo();
  }

	/**
	 * Sets the map to add flow mode in preparation for a flow to be selected.
	 */
	addFlow(): void {
		// TODO: Implement add flow
	}

	/**
	 * Sets the map to add station mode in preparation for a station to be selected.
	 */
	addStation(): void {
    const dialogData: DialogData = {
      title: 'New station',
      message: 'Select a location for this new station',
      okButtonText: 'Add',
      cancelButtonText: 'Cancel',
      promptLabel: 'Station name'
    };
    this.popupService.prompt(dialogData);
    if (!this.stationAddActive) {
      this.mapService.mapMode$.next(MapMode.stationAdd);
    } else {
      this.mapService.mapMode$.next(MapMode.view);
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
      .subscribe(
        (organization) => {
          if (organization) {
            this.orgInfo = organization;
          }
        },
        (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      );
  }

  /**
   * Cleanup method.
   */
   ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
