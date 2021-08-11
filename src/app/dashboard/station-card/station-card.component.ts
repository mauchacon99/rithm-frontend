import { Component, Input } from '@angular/core';
import { DashboardStationData } from 'src/models';
import { MatDialog } from '@angular/material/dialog';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user.service';

/**
 * Component for displaying a card with station information on the dashboard.
 */
@Component({
  selector: 'app-station-card[station]',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss']
})
export class StationCardComponent {
  /** The station info to display. */
  @Input() station!: DashboardStationData;

  /** Does the user have admin privileges? */
  isAdmin = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService
  ) {
    if (this.userService.user.role === 'admin') {
      this.isAdmin = true;
    }
  }

  /**
   * Determines if User has permission to proceed to a linked document.
   */
  checkStationEditPermission(): void {
    if (this.isAdmin) {
      this.router.navigate(
        [`/station`, this.station.rithmId]);
    }
  }

  /**
   * Opens Station Docs Modal with document information.
   */
  openDocsModal(): void {
    this.dialog.open(StationDocumentsModalComponent, {
      minWidth: '370px',
      data: { stationName: this.station.stationName, stationId: this.station.rithmId }
    });
  }

}
