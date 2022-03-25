import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationGroupData } from 'src/models';

/**
 * Component to show options list.
 */
@Component({
  selector: 'app-group-list-hierarchy',
  templateUrl: './group-list-hierarchy.component.html',
  styleUrls: ['./group-list-hierarchy.component.scss'],
})
export class GroupListHierarchyComponent implements OnInit {
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

  /**
   * Get stationGroups.
   *
   * @param idStationOrGroup RithmId of station or stationGroup.
   */
  private getStationGroups(idStationOrGroup = ''): void {
    this.stationService
      .getStationGroups(idStationOrGroup)
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
}
