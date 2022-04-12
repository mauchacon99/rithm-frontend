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
    this.searchStation(value);
  }

  /** Output value of selected item. */
  @Output() getSelectedItem = new EventEmitter<
    StationGroupData | StationListGroup
  >();

  /** Output value to disabled search input. */
  @Output() isSearchDisabled = new EventEmitter<boolean>();

  /** Data of stationGroup. */
  stationGroups!: StationGroupData;

  /** Data to station group widget to show filtered results. */
  stations!: StationListGroup[];

  /** Data to station group widget to show filtered results. */
  stationGroupsFiltered!: StationGroupData;

  /** Load indicator get groups. */
  isLoading!: boolean;

  /** Show error if get groups fail. */
  isErrorGetGroups = false;

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
          this.isSearchDisabled.emit(true);
          this.isLoading = false;
          this.isErrorGetGroups = false;
          this.stationGroups = JSON.parse(
            JSON.stringify(stationGroup)
          ) as StationGroupData;
          this.stationGroupsFiltered = stationGroup;
        },
        error: (error: unknown) => {
          this.isSearchDisabled.emit(false);
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
    this.getSelectedItem.emit(itemSelected);
  }

  /**
   * Search similitude stations by name and substations.
   *
   * @param search Value to search.
   */
  searchStation(search: string): void {
    const _localStationGroups = this.stationGroups;
    if (this.isLoading !== undefined && !this.isLoading) {
      if (search.length) {
        this.stationGroupsFiltered.stations =
          _localStationGroups?.stations.filter((station) =>
            station.name.toLowerCase().includes(search.toLowerCase())
          );

        this.stationGroupsFiltered.subStationGroups =
          _localStationGroups?.subStationGroups.filter((subStation) =>
            subStation.title.toLowerCase().includes(search.toLowerCase())
          );
      } else {
        /* console.log(this.stationGroupsFiltered);
        console.log(this.stationGroups);
        this.stationGroupsFiltered = this.stationGroups;
        console.log(this.stationGroupsFiltered);*/
      }
    }
  }
}
