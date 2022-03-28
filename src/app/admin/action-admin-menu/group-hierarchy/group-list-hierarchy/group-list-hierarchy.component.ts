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

  /** Output type of selected item. */
  @Output() getTypeSelectedItem = new EventEmitter<'group' | 'station'>();

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
  private getStationGroups(): void {
    this.stationService
      .getStationGroups(this.stationGroupRithmId)
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
   * Emit data of item selected to group-hierarchy.component.
   *
   * @param value Selected item data.
   * @param type Selected item type.
   */
  selectedListItem(
    value: StationGroupData | StationListGroup,
    type: 'group' | 'station'
  ): void {
    this.getSelectedItem.emit(value);
    this.getTypeSelectedItem.emit(type);
  }
}
