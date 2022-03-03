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

  /* List document tab Widget Modal. */
  itemsListDocument: ItemListWidgetModal[] = [];

  /* List station tab widget Modal. */
  itemsListStation: ItemListWidgetModal[] = [];

  /** Index default in tabs. */
  indexTab = 0;

  /** List table documents. */
  dataSourceTableDocument!: MatTableDataSource<ItemListWidgetModal>;

  /** List table stations. */
  dataSourceTableStations!: MatTableDataSource<ItemListWidgetModal>;

  /** List table Group. */
  dataSourceTableGroup!: MatTableDataSource<ItemListWidgetModal>;

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
    this.dashboardService
      .getDocumentTabList(this.dashboardRithmId)
      .pipe(first())
      .subscribe({
        next: (itemsListDocument) => {
          this.dataSourceTableDocument = new MatTableDataSource(
            itemsListDocument
          );
          this.itemsListDocument = itemsListDocument;
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
   * Get the station tab list.
   */
  private getStationTabList(): void {
    this.dashboardService
      .getStationTabList(this.dashboardRithmId)
      .pipe(first())
      .subscribe({
        next: (itemsListStation) => {
          this.dataSourceTableStations = new MatTableDataSource(
            itemsListStation
          );
          this.itemsListStation = itemsListStation;
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
