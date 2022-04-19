import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardItem, GroupTrafficData } from 'src/models';
import { StationService } from 'src/app/core/station.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ChartConfiguration, LegendItem } from 'chart.js';

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
    this.valueShowGraphic = value ? 5 : this.copyValueShowGraphic;

    if (this.groupTrafficData) {
      this.paginationChart = 0;
      this.setConfigChart();
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
  valueShowGraphic = 5;

  /** Copy value Selected for show data in chart. */
  copyValueShowGraphic = 5;

  /** Value of page to chart. */
  paginationChart = 0;

  /** With of chart. */
  private widthChart = 400;

  /** StationGroupRithmId for station groups traffic widget. */
  stationGroupRithmId = '';

  /** Whether the action to get group traffic is loading. */
  isLoading = false;

  /** Whether the action to get group traffic fails. */
  errorGroupTraffic = false;

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
          hoverBackgroundColor: '#8DA1C3',
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
          hoverBackgroundColor: '#8DA1C3',
          pointBorderColor: '#294F8E',
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
          barThickness:
            this.widthChart <= 430 ? (this.widthChart <= 305 ? 9 : 15) : 25,
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
            chart.width <= 430 ? (chart.width <= 305 ? 9 : 15) : 25;
          this.widthChart = chart.width;
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
    this.valueShowGraphic = dataWidget.valueShowGraphic || 5;
    this.copyValueShowGraphic = this.valueShowGraphic;
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
          this.setConfigChart();
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

  /** Set and update data in widget specific. */
  updateDataWidget(): void {
    const setShowSelect = JSON.parse(this.dataWidget);
    setShowSelect.valueShowGraphic = this.valueShowGraphic;
    this.widgetItem.data = JSON.stringify(setShowSelect);
    this.dashboardService.updateDashboardWidgets({
      widgetItem: this.widgetItem,
      widgetIndex: this.indexWidget,
      quantityElementsWidget: this.groupTrafficData.labels.length,
    });
    this.paginationChart = 0;
    this.setConfigChart();
  }

  /** Set data and config to chart. */
  private setConfigChart(): void {
    const { labels, averageDocumentFlow, stationDocumentCounts, formData } =
      this.groupTrafficData;
    const startSlice = this.paginationChart;
    const endSlice = this.paginationChart
      ? this.valueShowGraphic + this.valueShowGraphic
      : this.valueShowGraphic;

    this.configChart.data.labels = labels.slice(startSlice, endSlice);
    // position 0 are documents
    this.configChart.data.datasets[0].data = stationDocumentCounts.slice(
      startSlice,
      endSlice
    );
    // position 1 are documents flow
    this.configChart.data.datasets[1].data = averageDocumentFlow.slice(
      startSlice,
      endSlice
    );
    this.configChart.data.datasets[1].label = JSON.stringify(
      formData.slice(startSlice, endSlice) || []
    );

    // set custom tooltips
    this.setTooltips();
  }

  /** Set custom tooltips. */
  private setTooltips(): void {
    if (this.configChart.options) {
      this.configChart.options.plugins = {
        legend: {
          labels: {
            boxWidth: 15,
            generateLabels: () => {
              return [
                {
                  text: 'Document Count',
                  datasetIndex: 0,
                  fillStyle: '#8DA1C3',
                },
                {
                  text: 'Avg. Document completion time',
                  datasetIndex: 1,
                  fillStyle: '#294F8E',
                  lineWidth: 2,
                },
              ] as LegendItem[];
            },
          },
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: (tooltipItem) => {
              const { label, dataset } = tooltipItem[0];
              const title =
                dataset.type === 'line'
                  ? 'Avg. Document completion time'
                  : 'Document Count';
              return [title, label];
            },
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
      };
    }
  }

  /**
   * Paginate chart.
   *
   * @param type Of pagination 'next' | 'previous.
   */
  paginate(type: 'next' | 'previous'): void {
    this.paginationChart =
      type === 'next'
        ? this.paginationChart + this.valueShowGraphic
        : this.paginationChart - this.valueShowGraphic;

    this.setConfigChart();
  }
}
