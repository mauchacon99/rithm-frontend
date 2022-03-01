import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { ItemListWidgetModal } from 'src/models';

/** Component for Tab Custom in modal add widget. */
@Component({
  selector: 'app-custom-tab-widget-modal',
  templateUrl: './custom-tab-widget-modal.component.html',
  styleUrls: ['./custom-tab-widget-modal.component.scss'],
})
export class CustomTabWidgetModalComponent implements OnInit {
  /** Dashboard RithmId from openDialogAddWidget function.*/
  @Input() dashboardRithmId = '';

  /** Data for the dashboard item list. */
  itemListWidgetModal!: ItemListWidgetModal[];

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.getStationTabList();
  }

  /**
   * Get the station tab list.
   */
  getStationTabList(): void {
    this.dashboardService
      .getStationTabList(this.dashboardRithmId)
      .pipe(first())
      .subscribe({
        next: (itemListWidgetModal) => {
          this.itemListWidgetModal = itemListWidgetModal;
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
