import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationGroupWidgetData, WidgetType } from 'src/models';

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
  dataStationGroupWidget!: StationGroupWidgetData;

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
    this.getStationGroupsWidget();
  }

  /**
   * Get station groups.
   */
  getStationGroupsWidget(): void {
    this.isLoading = true;
    this.errorStationGroup = false;
    this.stationService
      .getStationGroupsWidget(this.stationGroupRithmId)
      .pipe(first())
      .subscribe({
        next: (dataStationGroupWidget) => {
          this.isLoading = false;
          this.errorStationGroup = false;
          this.dataStationGroupWidget = dataStationGroupWidget;
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
    this.dataStationGroupWidget.stations.filter((station) =>
      station.name.includes(this.search)
    );
  }
}
