import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardItem, GroupTrafficData } from 'src/models';
import { StationService } from 'src/app/core/station.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { Chart, ChartConfiguration } from 'chart.js';

/**
 * Component for station group traffic.
 */
@Component({
  selector:
    'app-group-traffic-widget[showButtonSetting][dataWidget][editMode][isMobileDevice]',
  templateUrl: './group-traffic-widget.component.html',
  styleUrls: ['./group-traffic-widget.component.scss'],
})
export class GroupTrafficWidgetComponent implements OnInit, OnDestroy {
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

  /** Chart traffic. */
  chartGroupTraffic!: Chart;

  /** Options for show traffic in chart. */
  optionsShowTraffic: number[] = [5, 10, 20, 30, 40, 50];

  /** Value Selected for show data in chart. */
  valueShowGraffic = 5;

  /** Copy value Selected for show data in chart. */
  copyValueShowGraffic = 5;

  /** StationGroupRithmId for station groups traffic widget. */
  stationGroupRithmId = '';

  /** Config static chart data. */
  configChart: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          // Documents
          type: 'bar',
          label: 'Documents',
          data: [],
          backgroundColor: '#8DA1C3',
          stack: 'combined',
          yAxisID: 'y',
          order: 2,
        },
        {
          // Documents Flow
          type: 'line',
          label: '[]',
          data: [],
          borderColor: '#294F8E',
          backgroundColor: '#8DA1C3',
          stack: 'combined',
          borderWidth: 1.5,
          yAxisID: 'y2',
          order: 1,
        },
      ],
    },
    options: {
      datasets: {
        bar: {
          barThickness: 8,
        },
      },
      onResize: (chart) => {
        if (
          chart.options &&
          chart.options.datasets &&
          chart.options.datasets.bar &&
          chart.options.datasets.bar.barThickness
        ) {
          chart.options.datasets.bar.barThickness =
            chart.width <= 335 ? (chart.width <= 245 ? 9 : 15) : 25;
        }
      },
      scales: {
        y: {
          stacked: true,
          position: 'left',
          beginAtZero: true,
        },
        y2: {
          stacked: true,
          position: 'right',
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  };

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private dashboardService: DashboardService
  ) {}

  /** Whether the action to get group traffic is loading. */
  isLoading = false;

  /** Whether the action to get group traffic fails. */
  errorGroupTraffic = false;

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
          this.createChart();
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

  /** Parse data and generate char traffic. */
  createChart(): void {
    const {
      labels,
      averageDocumentFlow,
      stationDocumentCounts,
      formData,
      stationGroupRithmId,
    } = this.groupTrafficData;
    this.configChart.data.labels = labels;
    // position 0 are documents
    this.configChart.data.datasets[0].data = stationDocumentCounts;
    // position 1 are documents flow
    this.configChart.data.datasets[1].data = averageDocumentFlow;
    this.configChart.data.datasets[1].label = JSON.stringify(formData || []);
    // set tooltips
    this.setTooltips();
    const id = `${this.indexWidget}-${stationGroupRithmId}`;
    setTimeout(() => {
      this.chartGroupTraffic = new Chart(id, this.configChart);
    }, 1);
  }

  /** Set custom tooltips. */
  setTooltips(): void {
    this.configChart.options = {
      ...this.configChart.options,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: (tooltipItem) => {
              if (tooltipItem.dataset.type === 'line') {
                const dataLabels = JSON.parse(
                  tooltipItem.dataset.label || '[]'
                );
                return dataLabels[tooltipItem.dataIndex] || [''];
              }
              return `${tooltipItem.dataset.data[tooltipItem.dataIndex]} ${
                tooltipItem.dataset.label
              }`;
            },
          },
        },
      },
    };
  }

  /** Destroy component. */
  ngOnDestroy(): void {
    if (this.groupTrafficData) {
      this.chartGroupTraffic.destroy();
    }
  }
}
