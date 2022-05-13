import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { StationWidgetPreBuilt } from 'src/models';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
/**
 * Component for station prebuilt.
 */
@Component({
  selector: 'app-station-pre-built-widget[showButtonSetting][editMode]',
  templateUrl: './station-pre-built-widget.component.html',
  styleUrls: ['./station-pre-built-widget.component.scss'],
})
export class StationPreBuiltWidgetComponent implements OnInit, OnDestroy {
  /** Reference to sort table. */
  @ViewChild(MatSort) set tableSort(value: MatSort) {
    if (value) {
      this.dataSourceTable.sort = value;
    }
  }

  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Open drawer. */
  @Output() toggleDrawer = new EventEmitter<number>();

  /** Remove widget fron drawer if this widget has been deleted. */
  @Output() deleteWidget = new EventEmitter();

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Type of drawer opened. */
  drawerContext!: string;

  /* User station data. */
  stationWidgetData: StationWidgetPreBuilt[] = [];

  /** Interface for list data in widget. */
  dataSourceTable!: MatTableDataSource<StationWidgetPreBuilt>;

  /** Whether the action to get station prebuilt is loading. */
  isLoading = false;

  /** Whether the action to get station prebuilt fails. */
  errorStationPrebuilt = false;

  /** Display error if user have permissions to see widget. */
  permissionError = true;

  /** Show error if this widget has been removed. */
  widgetDeleted = false;

  /** Columns static to show on table. */
  displayedColumns = ['name', 'totalContainers', 'groupName', 'stationOwners'];

  constructor(
    private stationService: StationService,
    private dialog: MatDialog,
    private sidenavDrawerService: SidenavDrawerService
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.subscribeDrawerContext$();
    this.getStationWidgetPreBuiltData();
  }

  /** Get context drawer. */
  private subscribeDrawerContext$(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerContext) => {
        this.drawerContext = drawerContext;
      });
  }

  /** Get stations data. */
  getStationWidgetPreBuiltData(): void {
    this.isLoading = true;
    this.errorStationPrebuilt = false;
    this.permissionError = true;
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
          const { status } = error as HttpErrorResponse;
          switch (status) {
            case 400:
              this.widgetDeleted = true;
              break;
            case 403:
              this.permissionError = false;
              break;
          }
          this.isLoading = false;
          this.errorStationPrebuilt = true;
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
        minWidth: '300px',
        data: {
          stationName: station.name,
          stationId: station.rithmId,
        },
      });
    }
  }

  /** Toggle drawer when click on edit group search widget. */
  toggleEditStation(): void {
    this.toggleDrawer.emit(+this.stationWidgetData.length);
  }

  /** Emit event for delete widget. */
  removeWidget(): void {
    this.deleteWidget.emit();
    this.toggleEditStation();
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
