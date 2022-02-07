import { Component, Input } from '@angular/core';
import { StationMapElement } from 'src/helpers';
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

  constructor(private mapService: MapService) {}

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
}
