import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MapService } from '../map.service';
import { PopupService } from 'src/app/core/popup.service';
import { FormBuilder } from '@angular/forms';
import { MapMode, StationGroupInfoDrawerData } from 'src/models';

/**
 * Component for station group info drawer.
 */
@Component({
  selector: 'app-station-group-info-drawer',
  templateUrl: './station-group-info-drawer.component.html',
  styleUrls: ['./station-group-info-drawer.component.scss'],
})
export class StationGroupInfoDrawerComponent implements OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** A boolean to note if drawer is viewed in Build mode. */
  editMode = false;

  /** Station group name. */
  stationGroupRithmId = '';

  /** Station group name. */
  /** The name of the group which can be edited while in build mode. */
  groupName = '';

  /** Station group is chained or not. */
  isChained = false;

  /** The current mode of the map. */
  currentMode = MapMode.View;

  /** The drawer context for station group info. */
  drawerContext = '';

  /** Number of stations included in station group. */
  numberOfStations = 0;

  /** Number of sub groups included in station group. */
  numberOfSubgroups = 0;

  /**
   * Whether the map is in build mode.
   *
   * @returns True if the map is in build mode, false otherwise.
   */
  get isBuilding(): boolean {
    return this.currentMode === MapMode.Build;
  }

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private mapService: MapService,
    private fb: FormBuilder,
    private popupService: PopupService
  ) {
    //Subscribe to the mapMode on the mapService.
    this.mapService.mapMode$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (mapMode) => {
        //set this.currentMode to the subscribed mapMode.
        this.currentMode = mapMode;
      },
      error: (error: unknown) => {
        throw new Error(`Map overlay subscription error: ${error}`);
      },
    });

    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.drawerContext = data;
      });

    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const infoData = data as StationGroupInfoDrawerData;
        if (infoData && this.drawerContext === 'stationGroupInfo') {
          this.stationGroupRithmId = infoData.stationGroupRithmId;
          this.groupName = infoData.stationGroupName;
          this.numberOfStations = infoData.numberOfStations;
          this.numberOfSubgroups = infoData.numberOfSubgroups;
          this.editMode = infoData.editMode;
          this.isChained = infoData.isChained;
        }
      });
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationGroupInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Set the changes made to the current station group.
   */
  setStationGroupChanges(): void {
    const index = this.mapService.stationGroupElements.findIndex(
      (stGroup) => stGroup.rithmId === this.stationGroupRithmId
    );
    this.mapService.stationGroupElements[index].title = this.groupName;
    this.mapService.stationGroupElements[index].markAsUpdated();
    this.mapService.stationGroupElementsChanged$.next(true);
  }
}
