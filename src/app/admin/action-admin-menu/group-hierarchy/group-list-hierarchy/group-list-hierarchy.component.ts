import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationGroupData, StationListGroup } from 'src/models';

/**
 * Component to show options list.
 */
@Component({
  selector: 'app-group-list-hierarchy[stationGroupRithmId][depthGroup]',
  templateUrl: './group-list-hierarchy.component.html',
  styleUrls: ['./group-list-hierarchy.component.scss'],
})
export class GroupListHierarchyComponent implements OnInit {
  /** RithmId of station or stationGroup to search. */
  @Input() stationGroupRithmId = '';

  /** Depth of the sub-stationGroups. */
  @Input() depthGroup = 1;

  /** Output value of selected item. */
  @Output() getSelectedItem = new EventEmitter<
    StationGroupData | StationListGroup
  >();

  /** Data of stationGroup. */
  stationGroups!: StationGroupData;

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
    this.stationService
      .getStationGroups(this.stationGroupRithmId, this.depthGroup)
      .pipe(first())
      .subscribe({
        next: (stationGroup) => {
          this.stationGroups = stationGroup;
        },
        error: (error: unknown) => {
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
}
