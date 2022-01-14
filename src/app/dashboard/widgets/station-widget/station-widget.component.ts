import { Component, Input, OnInit } from '@angular/core';
import { finalize, first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { StationWidgetData } from 'src/models';

/**
 * Component for Station widget.
 */
@Component({
  selector: 'app-station-widget[stationRithmId]',
  templateUrl: './station-widget.component.html',
  styleUrls: ['./station-widget.component.scss'],
})
export class StationWidgetComponent implements OnInit {
  /** Station rithmId. */
  @Input() stationRithmId = '';

  /** Data to station widget. */
  dataStationWidget!: StationWidgetData;

  /** Loading documents of station. */
  isLoading = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
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
    this.isLoading = true;
    this.documentService
      .getStationWidgetDocuments(this.stationRithmId)
      .pipe(
        first(),
        finalize(() => (this.isLoading = false))
      )
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
}
