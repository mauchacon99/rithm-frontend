import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardItem, GroupTrafficData } from 'src/models';
import { StationService } from 'src/app/core/station.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
/**
 * Component for station group traffic.
 */
@Component({
  selector:
    'app-group-traffic-widget[showButtonSetting][dataWidget][editMode][isMobileDevice]',
  templateUrl: './group-traffic-widget.component.html',
  styleUrls: ['./group-traffic-widget.component.scss'],
})
export class GroupTrafficWidgetComponent implements OnInit {
  /** Detect if is mobile device. */
  @Input() set isMobileDevice(value: boolean) {
    this._isMobileDevice = value;
    if (this._isMobileDevice) {
      this.valueShowGraffic = 5;
    } else {
      this.valueShowGraffic = this.copyValueShowGraffic;
    }
  }

  /**
   * Get data if is device mobile.
   *
   * @returns Data boolean if is mobile device.
   */
  get isMobileDevice(): boolean {
    return this._isMobileDevice;
  }

  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Set data for group traffic widget. */
  @Input() set dataWidget(value: string) {
    this._dataWidget = value;
    this.setDataWidget();
  }

  /**
   * Get parameter dataWidget.
   *
   * @returns Data string in widget.
   */
  get dataWidget(): string {
    return this._dataWidget;
  }

  /** Data the all widget Group. */
  @Input() widgetItem!: DashboardItem;

  /** Index Widget. */
  @Input() indexWidget!: number;

  /** Parameter private for save if is mobile device. */
  private _isMobileDevice!: boolean;

  /** Parameter private for save if is mobile device. */
  private _dataWidget!: string;

  /** Data for traffic in group. */
  groupTrafficData!: GroupTrafficData;

  /** Options for show traffic in chart. */
  optionsShowTraffic: number[] = [5, 10, 20, 30, 40, 50];

  /** Value Selected for show data in chart. */
  valueShowGraffic = 5;

  /** Copy value Selected for show data in chart. */
  copyValueShowGraffic = 5;

  /** StationGroupRithmId for station groups traffic widget. */
  stationGroupRithmId = '';

  /** Whether the action to get group traffic is loading. */
  isLoading = false;

  /** Whether the action to get group traffic fails. */
  errorGroupTraffic = false;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private dashboardService: DashboardService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.setDataWidget();
    this.getGroupTrafficData();
  }

  /** Set data in widget. */
  private setDataWidget(): void {
    const dataWidget = JSON.parse(this.dataWidget);
    this.stationGroupRithmId = dataWidget.stationGroupRithmId;
    this.valueShowGraffic = dataWidget.valueShowGraffic;
    this.copyValueShowGraffic = this.valueShowGraffic;
  }

  /** Get traffic data document in stations. */
  getGroupTrafficData(): void {
    this.isLoading = true;
    this.errorGroupTraffic = false;
    this.stationService
      .getGroupTrafficData(this.stationGroupRithmId)
      .pipe(first())
      .subscribe({
        next: (trafficData) => {
          this.isLoading = false;
          this.errorGroupTraffic = false;
          this.groupTrafficData = trafficData;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorGroupTraffic = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Set and update data in widget specific.
   */
  updateDataWidget(): void {
    const setShowSelect = JSON.parse(this.dataWidget);
    setShowSelect.valueShowGraffic = this.valueShowGraffic;
    this.widgetItem.data = JSON.stringify(setShowSelect);
    this.dashboardService.updateDashboardWidgets({
      widgetItem: this.widgetItem,
      widgetIndex: this.indexWidget,
      quantityElementsWidget: this.groupTrafficData.labels.length,
    });
  }
}
