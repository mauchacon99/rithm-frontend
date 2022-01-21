import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { StationWidgetData } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';

/**
 * Component for Station widget.
 */
@Component({
  selector: 'app-station-widget[stationRithmId]',
  templateUrl: './station-widget.component.html',
  styleUrls: ['./station-widget.component.scss'],
  providers: [UtcTimeConversion],
})
export class StationWidgetComponent implements OnInit {
  /** Station rithmId. */
  @Input() stationRithmId = '';

  /** Data to station widget. */
  dataStationWidget!: StationWidgetData;

  /** Show error loading widget. */
  failedLoadWidget = false;

  /** Loading documents of station. */
  isLoading = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.stationRithmId = JSON.parse(this.stationRithmId).stationRithmId;
    this.getStationWidgetDocuments();
  }

  /**
   * Get document for station widgets.
   */
  getStationWidgetDocuments(): void {
    this.isLoading = true;
    this.documentService
      .getStationWidgetDocuments(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (dataStationWidget) => {
          this.isLoading = false;
          this.failedLoadWidget = false;
          this.dataStationWidget = dataStationWidget;
        },
        error: (error: unknown) => {
          this.failedLoadWidget = true;
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects time a document entered a station.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  getElapsedTime(timeEntered: string): string {
    let timeInStation = '';
    if (timeEntered && timeEntered !== 'Unknown') {
      timeInStation = this.utcTimeConversion.getElapsedTimeText(
        this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
      );
      if (timeInStation === '1 day') {
        timeInStation = ' Yesterday';
      } else {
        timeInStation += ' ago';
      }
    } else {
      timeInStation = 'None';
    }
    return timeInStation;
  }
}
