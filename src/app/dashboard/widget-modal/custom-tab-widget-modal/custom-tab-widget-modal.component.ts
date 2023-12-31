import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { ItemListWidgetModal, SelectedItemWidgetModel } from 'src/models';
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

  /** The type of item clicked on for list-widget-modal to display. */
  @Output() itemSelected = new EventEmitter<SelectedItemWidgetModel>();

  /** Index default in tabs. */
  indexTab = 0;

  /** List table documents. */
  dataSourceTableDocument!: MatTableDataSource<ItemListWidgetModal>;

  /** List table stations. */
  dataSourceTableStations!: MatTableDataSource<ItemListWidgetModal>;

  /** List table Groups. */
  dataSourceTableGroup!: MatTableDataSource<ItemListWidgetModal>;

  /** Init a timeout variable to be used in method get results. */
  timeout = setTimeout(() => '', 1000);

  /** Loading indicator tab station. */
  isLoadingStationTab = false;

  /** Whether the getting tab document list is loading. */
  isLoadingDocumentTab = false;

  /** Whether the getting tab group list is loading. */
  isLoadingGroupTab = false;

  /** Error loading petition station tab. */
  errorLoadingStationTab = false;

  /** Variable to show if the error getting tab document list. */
  errorLoadingDocumentTab = false;

  /** Variable to show if the error getting tab document list. */
  errorLoadingGroupTab = false;

  /** Value to search. */
  searchTab = '';

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.getDocumentTabList();
  }

  /**
   * Selected tab for index.
   *
   * @param index Index of tab.
   */
  selectedTab(index: number): void {
    this.indexTab = index;
    this.searchTab = '';
    this.getSearchResultTab();
  }

  /**
   * Get list tab documents.
   *
   */
  private getDocumentTabList(): void {
    this.errorLoadingDocumentTab = false;
    this.isLoadingDocumentTab = true;
    this.dashboardService
      .getDocumentTabList(this.searchTab)
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
   *
   */
  private getStationTabList(): void {
    this.isLoadingStationTab = true;
    this.errorLoadingStationTab = false;
    this.dashboardService
      .getStationTabList(this.searchTab)
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

  /**
   * Get the list for the groups the stations tabs.
   *
   */
  private getGroupStationTabList(): void {
    this.errorLoadingGroupTab = false;
    this.isLoadingGroupTab = true;
    this.dashboardService
      .getGroupStationTabList(this.searchTab)
      .pipe(first())
      .subscribe({
        next: (itemsListGroupsStation) => {
          this.errorLoadingGroupTab = false;
          this.dataSourceTableGroup = new MatTableDataSource(
            itemsListGroupsStation
          );
          this.isLoadingGroupTab = false;
        },
        error: (error: unknown) => {
          this.errorLoadingGroupTab = true;
          this.isLoadingGroupTab = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Sending the type for the selected element.
   *
   * @param element The type of element.
   */
  selectTypeElement(element: SelectedItemWidgetModel): void {
    this.itemSelected.emit(element);
  }

  /**
   * Sending search value to get mach result.
   */
  getSearchResult(): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getSearchResultTab();
    }, 750);
  }

  /**
   * Sending search value to get mach result depending active tab.
   */
  private getSearchResultTab(): void {
    switch (this.indexTab) {
      case 0:
        this.getDocumentTabList();
        break;
      case 1:
        this.getStationTabList();
        break;
      case 2:
        this.getGroupStationTabList();
        break;
      default:
        this.getDocumentTabList();
        this.getStationTabList();
        this.getGroupStationTabList();
        break;
    }
  }
}
