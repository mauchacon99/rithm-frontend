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

  /** Set search input disabled or not. */
  @Output() isInputSearchDisabled = new EventEmitter<boolean>();

  /** Data of stationGroup. */
  stationGroups!: StationGroupData;

  /** Data to station group widget to show filtered results. */
  stations!: StationListGroup[];

  /** Data to station group widget to show filtered results. */
  stationGroupsFiltered!: StationGroupData;

  /** Load indicator get groups. */
  set isLoading(value: boolean) {
    this.getIsInputSearchDisabled(value);
  }

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
          this.isLoading = false;
          this.isErrorGetGroups = false;
          this.stationGroups = stationGroup;
          this.stationGroupsFiltered = stationGroup;
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
    this.getSelectedItem.emit(itemSelected);
  }

  /**
   * Search similitude stations by name and substations.
   *
   * @param search Value to search.
   */
  searchStation(search: string): void {
    if (search.length){
      this.stationGroupsFiltered.stations = this.stationGroups?.stations.filter((station) =>
      station.name.toLowerCase().includes(search.toLowerCase()));

      this.stationGroupsFiltered.subStationGroups = this.stationGroups?.subStationGroups.filter(
      (subStation) =>
        subStation.title.toLowerCase().includes(search.toLowerCase())
    );
    } else {
      this.getStationGroups();
    }
  }

  /**
   * Emit value of is input disabled.
   *
   * @param isLoading IsLoading item data.
   */
  private getIsInputSearchDisabled(isLoading: boolean): void {
    this.isInputSearchDisabled.emit(isLoading);
  }
}
