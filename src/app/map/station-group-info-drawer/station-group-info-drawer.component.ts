import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MapService } from '../map.service';
import { PopupService } from 'src/app/core/popup.service';
import {
  CenterPanType,
  MapItemStatus,
  MapMode,
  StationGroupInfoDrawerData,
} from 'src/models';

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

  /** Status of station group. */
  statusOfSubgroup = MapItemStatus.Normal;

  /** Status of station group. */
  readonly isPendingStatus = MapItemStatus.Pending;

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
    private popupService: PopupService
  ) {
    //Subscribe to the mapMode on the mapService.
    this.mapService.mapHelper.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
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
          this.statusOfSubgroup = infoData.stationGroupStatus;

          this.mapService.handleDrawerClose();
          const currentStationIndex =
            this.mapService.stationGroupElements.findIndex(
              (e) => e.rithmId === this.stationGroupRithmId
            );
          this.mapService.stationGroupElements[
            currentStationIndex
          ].drawerOpened = true;
          this.mapService.mapHelper.mapDataReceived$.next(true);
        }
      });
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationGroupInfo'): void {
    this.mapService.mapHelper.isDrawerOpened$.next(false);
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
   * Whether the drawer is opened or not.
   *
   * @returns True if any drawer is opened, false otherwise.
   */
  get drawerOpened(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  /**
   * Whether the station group is selected and it's in center of the map.
   *
   * @returns True if the selected station in center of the map, false otherwise.
   */
  get stationGroupCenter(): boolean {
    const drawer = document.getElementsByTagName('mat-drawer');
    //Call method to selected station is in center of the map.
    return this.mapService.centerHelper.checkCenter(
      CenterPanType.StationGroup,
      drawer[0] ? drawer[0].clientWidth : 0
    );
  }

  /**
   * Set the changes made to the current station group.
   * Reporting if the name or isChained on a station group changed.
   */
  reportNewStationGroupMapChange(): void {
    const index =
      this.mapService.mapStationGroupHelper.stationGroupElements.findIndex(
        (stGroup) => stGroup.rithmId === this.stationGroupRithmId
      );
    this.mapService.mapStationGroupHelper.stationGroupElements[index].title =
      this.groupName
        .trimStart()
        .trimEnd();
    this.mapService.mapStationGroupHelper.stationGroupElements[
      index
    ].isChained = this.isChained;
    this.mapService.mapStationGroupHelper.stationGroupElements[
      index
    ].markAsUpdated();
    this.mapService.mapStationGroupHelper.stationGroupElementsChanged$.next(
      true
    );
  }

  /**
   * Set the changes made to the current station group.
   */
  setStationGroupChanges(): void {
    this.groupName =
      this.groupName.trim().length > 0
        ? this.groupName.trimStart().trimEnd()
        : 'Untitled Group';
    if (
      this.currentMode === MapMode.Build ||
      this.currentMode === MapMode.StationGroupAdd ||
      this.currentMode === MapMode.StationGroupEdit
    ) {
      this.reportNewStationGroupMapChange();
    }
  }

  /**
   * Remove the current station group.
   */
  async removeStationGroup(): Promise<void> {
    //Open a popup and store the user response as a boolean.
    const confirm = await this.popupService.confirm({
      title: 'Remove Station Group',
      message: `Are you sure you want to delete this station group?`,
      okButtonText: 'Remove',
    });
    //If user confirms.
    if (confirm) {
      //Remove the station group using the method in map.service.
      this.mapService.mapStationGroupHelper.removeStationGroup(
        this.stationGroupRithmId
      );
      //Close the drawer.
      this.sidenavDrawerService.toggleDrawer('stationGroupInfo');
    }
  }

  /**
   * While station group is selected & drawer opened, Method called for selected station to centering in the map.
   */
  centerStationGroup(): void {
    this.mapService.mapHelper.isDrawerOpened$.next(true);
    //Close any open station option menus.
    this.mapService.mapHelper.matMenuStatus$.next(true);
    //Note that centering is beginning, this is necessary to allow recursive calls to the centerStation() method.
    this.mapService.centerHelper.centerActive$.next(true);
    //Get the map drawer element.
    const drawer = document.getElementsByTagName('mat-drawer');
    //Increment centerCount to show that more centering of station needs to be done.
    this.mapService.centerHelper.centerCount$.next(1);
    //Call method to run logic for centering of the station.
    this.mapService.centerHelper.center(
      CenterPanType.StationGroup,
      drawer[0] ? drawer[0].clientWidth : 0
    );
  }
}
