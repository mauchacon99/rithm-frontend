import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { groupTrafficData } from 'src/models';
import { DashboardService } from '../../dashboard.service';
/**
 * Component for station group traffic.
 */
@Component({
  selector: 'app-group-traffic-widget[showButtonSetting][dataWidget][editMode]',
  templateUrl: './group-traffic-widget.component.html',
  styleUrls: ['./group-traffic-widget.component.scss'],
})
export class GroupTrafficWidgetComponent implements OnInit {
  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Set data for group traffic widget. */
  @Input() dataWidget!: string;

  groupTrafficData!: groupTrafficData;

  /** StationGroupRithmId for station groups traffic widget. */
  stationGroupRithmId = '';

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    const dataWidget = JSON.parse(this.dataWidget);
    this.stationGroupRithmId = dataWidget.stationGroupRithmId;
    this.getGroupTrafficData();
  }

  /** Get traffic data document in stations. */
  getGroupTrafficData(): void {
    this.dashboardService
      .getGroupTrafficData('')
      .pipe(first())
      .subscribe({
        next: (trafficData) => {
          this.groupTrafficData = trafficData;
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
