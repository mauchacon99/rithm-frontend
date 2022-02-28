import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemListWidgetModal } from 'src/models';
import { DashboardService } from '../../dashboard.service';

/** Component for Tab Custom in modal add widget. */
@Component({
  selector: 'app-custom-tab-widget-modal',
  templateUrl: './custom-tab-widget-modal.component.html',
  styleUrls: ['./custom-tab-widget-modal.component.scss'],
})
export class CustomTabWidgetModalComponent {
  constructor(private dashboardService: DashboardService) {}

  /**
   * Get list tab documents.
   *
   * @param dashboardRithmId The specific dashboard rithmId to get item list widget.
   * @returns The item list widget modal.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getListTabDocuments(
    dashboardRithmId: string
  ): Observable<ItemListWidgetModal[]> {
    return this.dashboardService.getListTabDocuments(dashboardRithmId);
  }
}
