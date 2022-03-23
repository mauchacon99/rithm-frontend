import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationListGroup, WidgetType } from 'src/models';
import { StationGroupData } from 'src/models/station-group-data';

/**
 * Component for list field the groups how widget.
 */
@Component({
  selector:
    'app-group-search-widget[dataWidget][editMode][showButtonSetting][widgetType]',
  templateUrl: './group-search-widget.component.html',
  styleUrls: ['./group-search-widget.component.scss'],
})
export class GroupSearchWidgetComponent implements OnInit {
  /** To load dom by WidgetType. */
  @Input() widgetType: WidgetType = WidgetType.StationGroup;

  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Set data for group widget. */
  @Input() dataWidget!: string;

  /** Data to station group widget. */
  dataStationGroup!: StationGroupData;

  /** Data to station group widget to show filtered results. */
  stations!: StationListGroup[];

  /** StationGroupRithmId for station widget. */
  stationGroupRithmId = '';

  /** Param for search. */
  search = '';

  /** Whether the action to get list station group is loading. */
  isLoading = false;

  /** Whether the action to get list station group fails. */
  errorStationGroup = false;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    const dataWidget = JSON.parse(this.dataWidget);
    this.stationGroupRithmId = dataWidget.stationGroupRithmId;
    this.getStationGroups();
  }

  /**
   * Get station groups.
   */
  getStationGroups(): void {
    this.isLoading = true;
    this.errorStationGroup = false;
    this.stationService
      .getStationGroups(this.stationGroupRithmId)
      .pipe(first())
      .subscribe({
        next: (dataStationGroup) => {
          this.dataStationGroup = dataStationGroup;
          this.isLoading = false;
          this.errorStationGroup = false;
          this.dataStationGroup = dataStationGroup;
          this.stations = this.dataStationGroup.stations;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorStationGroup = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Search similitude stations by name.*/
  searchStation(): void {
    this.stations = this.dataStationGroup.stations.filter((station) =>
      station.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }
}
