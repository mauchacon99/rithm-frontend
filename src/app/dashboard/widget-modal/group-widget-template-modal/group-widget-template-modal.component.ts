import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { WidgetType } from 'src/models';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);

/**
 * The component for templates widgets of the groups.
 */
@Component({
  selector: 'app-group-widget-template-modal[widgetType]',
  templateUrl: './group-widget-template-modal.component.html',
  styleUrls: ['./group-widget-template-modal.component.scss'],
})
export class GroupWidgetTemplateModalComponent
  implements OnDestroy, AfterViewInit
{
  /** Type of widget to show. */
  @Input() widgetType: WidgetType = WidgetType.StationGroupSearch;

  /** Enum widgetType. */
  enumWidgetType = WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate;

  /** Chart to group traffic. */
  chartGroupTraffic!: Chart;

  /** Data static to show chart only group-traffic. */
  dataChart: ChartConfiguration = {
    type: 'line',
    data: {
      labels: [
        'Station 1',
        'Station 2',
        'Station 3',
        'Station 4',
        'Station 5',
        'Station 6',
        'Station 7',
      ],
      datasets: [
        {
          // Documents
          label: 'Documents',
          data: [20, 50, 32, 45, 40, 51, 26],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.63)',
          stack: 'combined',
          type: 'bar',
          borderWidth: 0,
          barThickness: 8,
        },
        {
          // Documents Flow
          label: 'Documents Flow',
          data: [5, 20, 7, 5, 6, 8, 9],
          borderColor: '#294F8E',
          backgroundColor: '#8DA1C3',
          stack: 'combined',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          titleFont: {
            size: 8,
          },
          bodyFont: {
            size: 7,
          },
        },
      },
      scales: {
        y: {
          stacked: true,
          ticks: {
            font: {
              size: 8,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 6,
            },
          },
        },
      },
    },
  };

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = dashboardService.dataTemplatePreviewWidgetModal;
  }

  /** After view init. */
  ngAfterViewInit(): void {
    if (this.widgetType === this.enumWidgetType.StationGroupTraffic) {
      this.chartGroupTraffic = new Chart('chartTrafficGroup', this.dataChart);
    }
  }

  /** Destroy component. */
  ngOnDestroy(): void {
    if (this.widgetType === this.enumWidgetType.StationGroupTraffic) {
      this.chartGroupTraffic.destroy();
    }
  }
}
