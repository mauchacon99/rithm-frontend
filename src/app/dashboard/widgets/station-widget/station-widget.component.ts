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
  private getStationWidgetDocuments(): void {
    this.documentService
      .getStationWidgetDocuments(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (dataStationWidget) => {
          this.dataStationWidget = dataStationWidget;
        },
        error: (error: unknown) => {
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
    return this.utcTimeConversion.getElapsedTimeText(
      this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
    );
  }
}
