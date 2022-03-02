import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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
export class MapSearchComponent implements OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Search should be disabled when the map is loading. */
  @Input() isLoading = false;

  /** Search input ID used for return to current search. */
  @ViewChild('inputText') search!: ElementRef;

  /** List of filtered stations based on search text. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filteredStations: any[] = [];

  /** Search text. */
  searchText = '';

  /** Place-holder text for return to previous search. */
  placeHolderText = '';

  /** On false used to store previous search text before station drawer opens. */
  searchInput = true;

  constructor(
    private mapService: MapService,
    private sidenavDrawerService: SidenavDrawerService,
    private stationService: StationService
  ) {
    //This subscribe shows if there are any drawers open.
    this.mapService.isDrawerOpened$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerOpened) => {
        if (!drawerOpened) {
          this.searchText = '';
        }
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return !!this.sidenavDrawerService.isDrawerOpen;
  }

  /**
   * Whether the screen width is below a certain amount.
   *
   * @returns True if width is below a certain amount.
   */
  get isMobile(): boolean {
    return window.innerWidth <= 380;
  }

  /**
   * Opens the mobile search overlay.
   */
  mobileSearch(): void {
    //toggle search.
  }

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
   * Search for the stations and station groups based on search text.
   *
   */
  searchStationsStationGroups(): void {
    this.searchText === '' || this.searchText.length === 0
      ? (this.filteredStations = [])
      : this.filterStationsStationGroups(
          this.searchText.toString().toLowerCase()
        );
  }

  /**
   * Clear search box text on click of close icon.
   *
   */
  clearSearchText(): void {
    if (this.searchText !== '' || this.searchText.length !== 0) {
      this.sidenavDrawerService.closeDrawer();
    }
    this.searchText = '';
    this.filteredStations = [];
    this.mapService.handleDrawerClose();
    this.searchInput = true;
  }

  /**
   * Filter stations and station groups based on search text.
   *
   * @param searchText Text to filter station and station group.
   */
  private filterStationsStationGroups(searchText: string): void {
    const stationsStationGroups: (
      | StationMapElement
      | StationGroupMapElement
    )[] = [
      ...this.mapService.stationElements,
      ...this.mapService.stationGroupElements,
    ];
    this.filteredStations = stationsStationGroups.filter((item) => {
      // If the item is a station.
      if (item instanceof StationMapElement) {
        return item.stationName
          .toLowerCase()
          .includes(searchText.toString().toLowerCase());
        // If the item is a station group.
      } else if (item instanceof StationGroupMapElement) {
        if (item.title) {
          return item.title
            .toLowerCase()
            .includes(searchText.toString().toLowerCase());
        } else {
          return;
        }
      } else {
        throw new Error('Item is not defined as a station or station group.');
      }
    });
  }

  /**
   * To get current search text words to store.
   *
   */
  onBlur(): void {
    if (this.searchInput) {
      this.placeHolderText = JSON.parse(
        JSON.stringify(this.search.nativeElement.value)
      );
      this.searchInput = false;
    }
  }

  /**
   * Returns to current search text on click of arrow icon & close the drawer.
   *
   */
  returnSearchText(): void {
    if (this.searchText !== '' || this.searchText.length !== 0) {
      this.sidenavDrawerService.closeDrawer();
      this.mapService.handleDrawerClose();
      this.searchInput = true;
    }
    this.filteredStations = [];
    setTimeout(() => {
      this.search.nativeElement.value = this.placeHolderText;
      this.search.nativeElement.focus();
      this.filterStationsStationGroups(
        this.placeHolderText.toString().toLowerCase()
      );
    }, 100);
  }

  /**
   * Opens the drawer of selected map element.
   *
   * @param drawerItem The selected item.
   */
  openDrawer(drawerItem: StationMapElement | StationGroupMapElement): void {
    this.mapService.isDrawerOpened$.next(true);
    //Close any open station option menus.
    this.mapService.matMenuStatus$.next(true);
    //Note that centering is beginning, this is necessary to allow recursive calls to the centerStation() method.
    this.mapService.centerActive$.next(true);
    //Get the map drawer element.
    const drawer = document.getElementsByTagName('mat-drawer');
    if (drawerItem instanceof StationMapElement) {
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
      this.stationService.updatedStationNameText(drawerItem.stationName);
      drawerItem.drawerOpened = true;
      //Increment centerStationCount to show that more centering of station needs to be done.
      this.mapService.centerStationCount$.next(1);
      //Call method to run logic for centering of the station.
      setTimeout(() => {
        this.mapService.centerStation(
          drawerItem,
          drawer[0] ? drawer[0].clientWidth : 0
        );
      }, 1);
    } else if (drawerItem instanceof StationGroupMapElement) {
      const dataInformationDrawer: StationGroupInfoDrawerData = {
        stationGroupRithmId: drawerItem.rithmId,
        stationGroupName: drawerItem.title,
        editMode: this.mapService.mapMode$.value === MapMode.Build,
        numberOfStations: drawerItem.stations.length,
        numberOfSubgroups: drawerItem.subStationGroups.length,
        stationGroupStatus: drawerItem.status,
        isChained: drawerItem.isChained,
      };
      //Open station group info drawer when clicked on station group boundary or name.
      this.sidenavDrawerService.openDrawer(
        'stationGroupInfo',
        dataInformationDrawer
      );
      drawerItem.drawerOpened = true;
      //Increment centerStationGroupCount to show that more centering of station needs to be done.
      this.mapService.centerStationGroupCount$.next(1);
      //Call method to run logic for centering of the station group.
      setTimeout(() => {
        this.mapService.centerStationGroup(
          drawerItem,
          drawer[0] ? drawer[0].clientWidth : 0
        );
      }, 1);
    } else {
      throw new Error('Item is not defined as a station or station group.');
    }
  }
}
