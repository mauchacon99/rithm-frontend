import { Component, Input } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';
import { StationGroupMapElement, StationMapElement } from 'src/helpers';
import {
  MapMode,
  StationGroupInfoDrawerData,
  StationInfoDrawerData,
} from 'src/models';
import { MapService } from '../map.service';

/**
 * Component for managing search on the map.
 */
@Component({
  selector: 'app-map-search[isLoading]',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss'],
})
export class MapSearchComponent {
  /** Search should be disabled when the map is loading. */
  @Input() isLoading = false;

  /** List of filtered stations based on search text. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filteredStations: any[] = [];

  /** Search text. */
  searchText = '';

  constructor(
    private mapService: MapService,
    private sidenavDrawerService: SidenavDrawerService,
    private stationService: StationService
  ) {}

  /**
   * Display station name when it's selected.
   *
   * @param displayItem The selected item.
   * @returns Returns station name.
   */
  displayStationName(
    displayItem: StationMapElement | StationGroupMapElement
  ): string {
    if (!displayItem) {
      return '';
    }
    return 'stationName' in displayItem
      ? displayItem?.stationName
      : displayItem?.title;
  }

  /**
   * Search for the stations based on search text.
   *
   */
  searchStations(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stationsStationGroups: any[] = [
      ...this.mapService.stationGroupElements,
      ...this.mapService.stationElements,
    ];
    this.searchText === '' || this.searchText.length === 0
      ? (this.filteredStations = [])
      : (this.filteredStations = stationsStationGroups.filter((item) => {
          if (item && (item.stationName || item.title)) {
            return item.stationName
              ? item.stationName
                  .toLowerCase()
                  .includes(this.searchText.toLowerCase())
              : item.title
                  .toLowerCase()
                  .includes(this.searchText.toLowerCase());
          }
        }));
  }

  /**
   * Clear search box text on click of close icon.
   *
   */
  clearSearchText(): void {
    this.searchText = '';
    this.filteredStations = [];
  }

  /**
   * Opens the drawer of selected map element.
   *
   * @param drawerItem The selected item.
   */
  // eslint-disable-next-line
  openDrawer(drawerItem: any): void {
    if (drawerItem instanceof Object && 'stationName' in drawerItem) {
      const dataInformationDrawer: StationInfoDrawerData = {
        stationRithmId: drawerItem.rithmId,
        stationName: drawerItem.stationName,
        editMode: this.mapService.mapMode$.value === MapMode.Build,
        stationStatus: drawerItem.status,
        mapMode: this.mapService.mapMode$.value,
        openedFromMap: true,
        notes: drawerItem.notes,
      };
      //Pass dataInformationDrawer to open the station info drawer.
      this.sidenavDrawerService.openDrawer(
        'stationInfo',
        dataInformationDrawer
      );
      const drawer = document.getElementsByTagName('mat-drawer');
      this.stationService.updatedStationNameText(drawerItem.stationName);
      drawerItem.drawerOpened = true;
      this.searchText = '';
      this.filteredStations = [];
      //Close any open station option menus.
      this.mapService.matMenuStatus$.next(true);
      //Note that centering is beginning, this is necessary to allow recursive calls to the centerStation() method.
      this.mapService.centerActive$.next(true);
      //Increment centerStationCount to show that more centering of station needs to be done.
      this.mapService.centerStationCount$.next(1);
      //Call method to run logic for centering of the station.
      setTimeout(() => {
        this.mapService.centerStation(
          drawerItem,
          drawer[0] ? drawer[0].clientWidth : 0
        );
      }, 1);
    } else if (drawerItem instanceof Object && 'title' in drawerItem) {
      this.searchText = '';
      this.filteredStations = [];
      const dataInformationDrawer: StationGroupInfoDrawerData = {
        stationGroupRithmId: drawerItem.rithmId,
        stationGroupName: drawerItem.title,
        editMode: this.mapService.mapMode$.value === MapMode.Build,
        numberOfStations: drawerItem.stations.length,
        numberOfSubgroups: drawerItem.subStationGroups.length,
        stationGroupStatus: drawerItem.status,
        isChained: false,
      };
      //Open station group info drawer when clicked on station group boundary or name.
      this.sidenavDrawerService.openDrawer(
        'stationGroupInfo',
        dataInformationDrawer
      );
    }
  }
}
