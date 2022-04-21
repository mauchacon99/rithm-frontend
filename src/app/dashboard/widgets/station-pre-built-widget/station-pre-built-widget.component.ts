import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { StationWidgetPreBuilt } from 'src/models';
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

  /** Interface for list data in widget. */
  dataSourceTable!: MatTableDataSource<StationWidgetPreBuilt>;

  /** Whether the action to get station prebuilt is loading. */
  isLoading = false;

  /** Whether the action to get station prebuilt fails. */
  errorStationPrebuilt = false;

  /** Columns static to show on table. */
  displayedColumns = [
    'stationName',
    'totalContainers',
    'stationGroup',
    'stationOwners',
  ];

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private dialog: MatDialog
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.getStationWidgetPreBuiltData();
  }

  /** Get stations data. */
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
          this.dataSourceTable = new MatTableDataSource(stationWidgetData);
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorStationPrebuilt = true;
          this.errorService.logError(error);
        },
      });
  }

  /**
   * Opens Station Docs Modal with document information.
   *
   * @param station Station specific for render modal and documents.
   */
  openDocsModal(station: StationWidgetPreBuilt): void {
    if (!this.editMode) {
      this.dialog.open(StationDocumentsModalComponent, {
        minWidth: '370px',
        data: {
          stationName: station.stationName,
          stationId: station.stationRithmId,
        },
      });
    }
  }
}
