import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationGroupData, StationListGroup } from 'src/models';

/**
 * Component to show options list.
 */
@Component({
  selector: 'app-group-list-hierarchy',
  templateUrl: './group-list-hierarchy.component.html',
  styleUrls: ['./group-list-hierarchy.component.scss'],
})
export class GroupListHierarchyComponent implements OnInit {
  /** RithmId of station or stationGroup to search. */
  @Input() stationGroupRithmId = '';

  /** Output value of selected item. */
  @Output() getSelectedItem = new EventEmitter<
    StationGroupData | StationListGroup
  >();

  /** Data of stationGroup. */
  stationGroups!: StationGroupData;

  /** Load indicator get groups. */
  isLoading = false;

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
    this.stationService
      .getStationGroups(this.stationGroupRithmId)
      .pipe(first())
      .subscribe({
        next: (stationGroup) => {
          this.isLoading = false;
          this.isErrorGetGroups = false;
          this.stationGroups = stationGroup;
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
   * Emit data of item selected to group-hierarchy.component.
   *
   * @param value Selected item data.
   */
  selectedListItem(value: StationGroupData | StationListGroup): void {
    this.getSelectedItem.emit(value);
  }
}
