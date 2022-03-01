import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { ItemListWidgetModal } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

/** Component for Tab Custom in modal add widget. */
@Component({
  selector: 'app-custom-tab-widget-modal[dashboardRithmId]',
  templateUrl: './custom-tab-widget-modal.component.html',
  styleUrls: ['./custom-tab-widget-modal.component.scss'],
})
export class CustomTabWidgetModalComponent implements OnInit {
  @Input() dashboardRithmId!: string;

  /* List Widget Modal */
  itemsListDocument: ItemListWidgetModal[] = [];

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
   * Get list tab documents.
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getDocumentTabList(): void {
    this.dashboardService
      .getDocumentTabList(this.dashboardRithmId)
      .pipe(first())
      .subscribe({
        next: (itemsListDocument) => {
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
}
