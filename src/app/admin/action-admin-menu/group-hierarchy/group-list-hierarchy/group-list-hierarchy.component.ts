import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationGroupData, StationListGroup } from 'src/models';

/**
 * Component to show options list.
 */
@Component({
  selector: 'app-group-list-hierarchy[stationGroupRithmId][depthGroup][search]',
  templateUrl: './group-list-hierarchy.component.html',
  styleUrls: ['./group-list-hierarchy.component.scss'],
})
export class GroupListHierarchyComponent implements OnInit {
  /** RithmId of station or stationGroup to search. */
  @Input() stationGroupRithmId = '';

  /** Depth of the sub-stationGroups. */
  @Input() depthGroup = 1;

  /** Param for search. */
  @Input() set search(value: string) {
    this._search = value;
    this.searchStationGroups();
  }

  /**
   * Get parameter search.
   *
   * @returns Value for search.
   */
  get search(): string {
    return this._search;
  }

  /** Value search. */
  private _search = '';

  /** Output value of selected item. */
  @Output() getSelectedItem = new EventEmitter<
    StationGroupData | StationListGroup
  >();

  /** Data of stationGroup. */
  stationGroups!: StationGroupData;

  /** Data to station group widget to show filtered results. */
  stationsFilter: StationListGroup[] = [];

  /** Data to station group widget to show filtered results. */
  groupsFilter: StationGroupData[] = [];

  /** Load indicator get groups. */
  isLoading = false;

  /** Show error if get groups fail. */
  isErrorGetGroups = false;

  /** RithmId Item selected. */
  itemSelectedRithmId = '';

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.getStationGroups();
  }

  /** Get stationGroups. */
  getStationGroups(): void {
    this.isLoading = true;
    this.isErrorGetGroups = false;
    this.stationService
      .getStationGroups(this.stationGroupRithmId, this.depthGroup)
      .pipe(first())
      .subscribe({
        next: (stationGroup) => {
          this.isLoading = false;
          this.isErrorGetGroups = false;
          this.stationGroups = stationGroup;
          this.stationsFilter = stationGroup.stations;
          this.groupsFilter = stationGroup.subStationGroups;
          this.searchStationGroups();
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.isErrorGetGroups = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Emit data StationGroupData | StationListGroup of item selected.
   *
   * @param itemSelected Selected item data.
   */
  selectedListItem(itemSelected: StationGroupData | StationListGroup): void {
    this.itemSelectedRithmId = itemSelected.rithmId;
    this.getSelectedItem.emit(itemSelected);
  }

  /**
   * Search similitude stations by name and substations.
   */
  searchStationGroups(): void {
    if (this.stationGroups) {
      this.stationsFilter = this.stationGroups?.stations.filter((station) =>
        station.name.toLowerCase().includes(this.search.toLowerCase())
      );
      this.groupsFilter = this.stationGroups?.subStationGroups.filter(
        (subStation) =>
          subStation.title.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  }
}
