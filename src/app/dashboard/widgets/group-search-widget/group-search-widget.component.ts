import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationGroupData, WidgetType } from 'src/models';

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
  dataStationGroupWidget!: StationGroupData;

  /** StationGroupRithmId for station widget. */
  stationGroupRithmId = '';

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
  private getStationGroupsWidget(): void {
    this.stationService
      .getStationGroupsWidget(this.stationGroupRithmId)
      .pipe(first())
      .subscribe({
        next: (dataStationGroupWidget) => {
          this.dataStationGroupWidget = dataStationGroupWidget;
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
