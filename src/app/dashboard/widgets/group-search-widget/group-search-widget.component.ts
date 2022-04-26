import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MapService } from 'src/app/map/map.service';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { StationListGroup, WidgetType } from 'src/models';
import { StationGroupData } from 'src/models/station-group-data';
import { SidenavDrawerService } from '../../../core/sidenav-drawer.service';

/**
 * Component for list field the groups how widget.
 */
@Component({
  selector:
    'app-group-search-widget[dataWidget][editMode][showButtonSetting][widgetType]',
  templateUrl: './group-search-widget.component.html',
  styleUrls: ['./group-search-widget.component.scss'],
})
export class GroupSearchWidgetComponent implements OnInit, OnDestroy {
  /** To load dom by WidgetType. */
  @Input() widgetType: WidgetType = WidgetType.StationGroup;

  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Set data for group widget. */
  @Input() dataWidget!: string;

  /** Open drawer. */
  @Output() toggleDrawer = new EventEmitter<number>();

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Data to station group widget. */
  dataStationGroup!: StationGroupData;

  /** Data to station group widget to show filtered results. */
  stations!: StationListGroup[];

  /** Data subStationGroupData for show filtered results. */
  subStationGroupData!: StationGroupData[];

  /** Type of drawer opened. */
  drawerContext!: string;

  /** StationGroupRithmId for station widget. */
  stationGroupRithmId = '';

  /** Param for search. */
  search = '';

  /** Whether the action to get list station group is loading. */
  isLoading = false;

  /** Whether the action to get list station group fails. */
  errorStationGroup = false;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private dialog: MatDialog,
    private router: Router,
    private mapService: MapService,
    private sidenavDrawerService: SidenavDrawerService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    const dataWidget = JSON.parse(this.dataWidget);
    this.stationGroupRithmId = dataWidget.stationGroupRithmId;
    this.subscribeDrawerContext$();
    this.getStationGroups();
  }

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  /** Get context drawer. */
  private subscribeDrawerContext$(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerContext) => {
        this.drawerContext = drawerContext;
      });
  }

  /**
   * Get station groups.
   */
  getStationGroups(): void {
    this.isLoading = true;
    this.errorStationGroup = false;
    this.stationService
      .getStationGroups(this.stationGroupRithmId)
      .pipe(first())
      .subscribe({
        next: (dataStationGroup) => {
          this.dataStationGroup = dataStationGroup;
          this.isLoading = false;
          this.errorStationGroup = false;
          this.stations = this.dataStationGroup.stations;
          this.subStationGroupData = this.dataStationGroup.subStationGroups;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorStationGroup = true;
          this.errorService.logError(error);
        },
      });
  }

  /** Toggle drawer when click on edit group search widget. */
  toggleEditStation(): void {
    this.toggleDrawer.emit(
      +Object.keys(this.dataStationGroup.subStationGroups).length +
        Object.keys(this.dataStationGroup).length
    );
  }

  /** Search similitude stations by name and substations .*/
  searchStation(): void {
    this.stations = this.dataStationGroup.stations.filter((station) =>
      station.name.toLowerCase().includes(this.search.toLowerCase())
    );

    this.subStationGroupData = this.dataStationGroup.subStationGroups.filter(
      (subStation) =>
        subStation.title.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  /**
   * Opens Station Docs Modal with document information.
   *
   * @param station Station specific for render modal and documents.
   */
  openDocsModal(station: StationListGroup): void {
    if (!this.editMode) {
      this.dialog.open(StationDocumentsModalComponent, {
        minWidth: '370px',
        data: {
          stationName: station.name,
          stationId: station.rithmId,
        },
      });
    }
  }

  /**
   * Navigate the user to the group on the map.
   *
   * @param stationGroupRithmId RithmId specified station.
   */
  goToStationGroupOnMap(stationGroupRithmId: string): void {
    this.mapService.mapStationGroupHelper.centerStationGroupRithmId$.next(
      stationGroupRithmId
    );
    this.mapService.mapHelper.viewStationButtonClick$.next(true);
    this.router.navigate([`/map`]);
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
