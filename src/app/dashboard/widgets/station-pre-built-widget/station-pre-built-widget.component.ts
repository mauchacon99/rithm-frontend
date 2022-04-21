import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { ContainerWidgetPreBuilt, StationWidgetPreBuilt } from 'src/models';
/**
 * Component for station prebuilt.
 */
@Component({
  selector: 'app-station-pre-built-widget',
  templateUrl: './station-pre-built-widget.component.html',
  styleUrls: ['./station-pre-built-widget.component.scss'],
})
export class StationPreBuiltWidgetComponent implements OnInit {
  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /* User station data. */
  stationWidgetData: StationWidgetPreBuilt[] = [];

  /** Containers widget pre built. */
  containers: ContainerWidgetPreBuilt[] = [];

  /** Whether the action to get station prebuilt is loading. */
  isLoading = false;

  /** Whether the action to get station prebuilt fails. */
  errorStationPrebuilt = false;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.getStationWidgetPreBuiltData();
  }

  /**
   * Get stations data.
   *
   */
  getStationWidgetPreBuiltData(): void {
    this.isLoading = true;
    this.errorStationPrebuilt = false;
    this.stationService
      .getStationWidgetPreBuiltData()
      .pipe(first())
      .subscribe({
        next: (stationWidgetData) => {
          this.isLoading = false;
          this.errorStationPrebuilt = false;
          this.stationWidgetData = stationWidgetData;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorStationPrebuilt = true;
          this.errorService.logError(error);
        },
      });
  }
}
