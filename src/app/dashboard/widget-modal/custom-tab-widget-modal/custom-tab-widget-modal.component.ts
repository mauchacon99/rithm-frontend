import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { ItemListWidgetModal } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';

/** Component for Tab Custom in modal add widget. */
@Component({
  selector: 'app-custom-tab-widget-modal[dashboardRithmId]',
  templateUrl: './custom-tab-widget-modal.component.html',
  styleUrls: ['./custom-tab-widget-modal.component.scss'],
})
export class CustomTabWidgetModalComponent implements OnInit {
  /* Dashboard rithm Id. */
  @Input() dashboardRithmId!: string;

  /** Index default in tabs. */
  indexTab = 0;

  /** List table documents. */
  dataSourceTableDocument!: MatTableDataSource<ItemListWidgetModal>;

  /** List table stations. */
  dataSourceTableStations!: MatTableDataSource<ItemListWidgetModal>;

  /** List table Groups. */
  dataSourceTableGroup!: MatTableDataSource<ItemListWidgetModal>;

  /** Variable to show if the error getting tab document list. */
  errorLoadingDocumentTab = false;

  /** Loading indicator tab station. */
  isLoadingStationTab = false;

  /** Whether the getting tab document list is loading. */
  isLoadingDocumentTab = false;

  /** Error loading petition station tab. */
  errorLoadingStationTab = false;

  /* Value to simulate list of groups waiting final method will be incorporated. */
  itemListWidgetModalGroups: ItemListWidgetModal[] = [
    {
      rithmId: '7',
      name: 'Groupygroup',
      isChained: false,
      totalStations: 2,
      totalSubGroups: 5,
    },
    {
      rithmId: '7',
      name: 'Groupygroup',
      isChained: true,
      totalStations: 2,
      totalSubGroups: 3,
    },
    {
      rithmId: '7',
      name: 'Groupygroup',
      isChained: false,
      totalStations: 2,
      totalSubGroups: 9,
    },
  ];

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.getDocumentTabList();
    this.getStationTabList();
    /*Temporal function to simulate list of groups waiting final method will be incorporated. */
    this.dataSourceTableGroup = new MatTableDataSource(
      this.itemListWidgetModalGroups
    );
  }

  /**
   * Selected tab for index.
   *
   * @param index Index of tab.
   */
  selectedTab(index: number): void {
    this.indexTab = index;
  }

  /**
   * Get list tab documents.
   *
   */
  private getDocumentTabList(): void {
    this.errorLoadingDocumentTab = false;
    this.isLoadingDocumentTab = true;
    this.dashboardService
      .getDocumentTabList()
      .pipe(first())
      .subscribe({
        next: (itemsListDocument) => {
          this.dataSourceTableDocument = new MatTableDataSource(
            itemsListDocument
          );
          this.errorLoadingDocumentTab = false;
          this.isLoadingDocumentTab = false;
        },
        error: (error: unknown) => {
          this.errorLoadingDocumentTab = true;
          this.isLoadingDocumentTab = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Get the station tab list.
   */
  private getStationTabList(): void {
    this.isLoadingStationTab = true;
    this.errorLoadingStationTab = false;
    this.dashboardService
      .getStationTabList(this.dashboardRithmId)
      .pipe(first())
      .subscribe({
        next: (itemsListStation) => {
          this.dataSourceTableStations = new MatTableDataSource(
            itemsListStation
          );
          this.isLoadingStationTab = false;
          this.errorLoadingStationTab = false;
        },
        error: (error: unknown) => {
          this.isLoadingStationTab = false;
          this.errorLoadingStationTab = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
