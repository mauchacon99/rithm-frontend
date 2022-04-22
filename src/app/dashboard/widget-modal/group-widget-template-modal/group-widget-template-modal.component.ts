import { Component, Input } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { WidgetType } from 'src/models';
import { ChartConfiguration } from 'chart.js';

/**
 * The component for templates widgets of the groups.
 */
@Component({
  selector: 'app-group-widget-template-modal[widgetType]',
  templateUrl: './group-widget-template-modal.component.html',
  styleUrls: ['./group-widget-template-modal.component.scss'],
})
export class GroupWidgetTemplateModalComponent {
  /** Type of widget to show. */
  @Input() widgetType: WidgetType = WidgetType.StationGroupSearch;

  /** Enum widgetType. */
  enumWidgetType = WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate;

  /** Data static to show chart only group-traffic. */
  configChart: ChartConfiguration = {
    type: 'bar',
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
          label: 'Containers Count',
          data: [5, 10, 7, 8, 15, 18, 12],
          backgroundColor: '#8DA1C3',
          hoverBackgroundColor: '#8DA1C3',
          stack: 'combined',
          type: 'bar',
          yAxisID: 'y',
          order: 2,
        },
        {
          // Documents Flow
          type: 'line',
          label: 'Avg. Container completion time',
          data: [50, 20, 10, 60, 120, 40, 140],
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
      responsive: true,
      maintainAspectRatio: false,
      datasets: {
        bar: {
          barThickness: 8,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          titleFont: {
            size: 8,
          },
          bodyFont: {
            size: 7,
          },
          callbacks: {
            title: (tooltipItem) => {
              const { label, dataset } = tooltipItem[0];
              const title =
                dataset.type === 'line'
                  ? 'Avg. Container completion time'
                  : 'Container Count';
              return [title, label];
            },
            label: (tooltipItem) => {
              if (tooltipItem.dataset.type === 'line') {
                return ['2 days'];
              }
              return `${tooltipItem.dataset.data[tooltipItem.dataIndex]} ${
                tooltipItem.dataset.label
              }`;
            },
          },
        },
      },
      scales: {
        y: {
          stacked: true,
          position: 'left',
          beginAtZero: true,
          ticks: {
            font: {
              size: 8,
            },
          },
        },
        y2: {
          stacked: true,
          position: 'right',
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
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
}
