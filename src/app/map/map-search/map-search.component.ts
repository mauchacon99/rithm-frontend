import { Component, Input } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';
import { StationMapElement } from 'src/helpers';
import { MapMode, StationInfoDrawerData } from 'src/models';
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
  filteredStations: StationMapElement[] = [];

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
  displayStationName(displayItem: StationMapElement): string {
    return displayItem?.stationName;
  }

  /**
   * Search for the stations based on search text.
   *
   */
  searchStations(): void {
    this.searchText === '' || this.searchText.length === 0
      ? (this.filteredStations = [])
      : (this.filteredStations = this.mapService.stationElements.filter(
          (item) => {
            return item.stationName.toLowerCase().includes(this.searchText);
          }
        ));
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
  openDrawer(drawerItem: StationMapElement): void {
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
    this.sidenavDrawerService.openDrawer('stationInfo', dataInformationDrawer);
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
  }
}
