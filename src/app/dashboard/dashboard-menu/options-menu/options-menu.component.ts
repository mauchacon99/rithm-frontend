import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { RoleDashboardMenu } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { PopupService } from 'src/app/core/popup.service';

/**
 * Options menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-options-menu[dashboardRole]',
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.scss'],
})
export class OptionsMenuComponent {
  /**
   * Dashboard type from expansion-menu.
   */
  @Input() dashboardRole!: RoleDashboardMenu;

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  /** Display or not mat menu when its generate new dashboard. */
  isGenerateNewDashboard = false;

  /** Show option. */
  @Input() isDashboardListOptions!: boolean;

  /** Dashboard rithmId. */
  @Input() rithmId!: string;

  /** Update dashboard list.  */
  @Output() updateDashboardList = new EventEmitter();

  /** Allows functionality of MatMenu to toggle the menu open. */
  @ViewChild(MatMenuTrigger)
  private optionsMenuTrigger!: MatMenuTrigger;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private router: Router,
    private sidenavDrawerService: SidenavDrawerService,
    private popupService: PopupService
  ) {}

  /**
   * Opens the option menu on the dashboard menu.
   *
   * @param event The click event.
   */
  openOptionsMenu(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
    event.stopPropagation();
  }

  /**
   * Generate a new dashboard.
   */
  generateNewDashboard(): void {
    this.isGenerateNewDashboard = true;
    this.sidenavDrawerService.toggleDrawer('menuDashboard');
    this.dashboardService.toggleLoadingDashboard(true);
    const generateDashboard$ =
      this.dashboardRole === this.roleDashboardMenu.Personal
        ? this.dashboardService.generateNewPersonalDashboard()
        : this.dashboardService.generateNewOrganizationDashboard();
    generateDashboard$.pipe(first()).subscribe({
      next: (newDashboard) => {
        this.isGenerateNewDashboard = false;
        this.dashboardService.toggleLoadingDashboard(false);
        this.router.navigate(['/', 'dashboard', newDashboard.rithmId]);
      },
      error: (error: unknown) => {
        this.dashboardService.toggleLoadingDashboard(false);
        this.isGenerateNewDashboard = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Delete dashboard.
   *
   * @param rithmId The dashboard rithmId to delete.
   */
  deleteDashboard(rithmId: string): void {
    const deleteDashboard$ =
      this.dashboardRole === this.roleDashboardMenu.Company
        ? this.dashboardService.deleteOrganizationDashboard(rithmId)
        : this.dashboardService.deletePersonalDashboard(rithmId);

    deleteDashboard$.pipe(first()).subscribe({
      next: () => {
        this.updateDashboardList.emit();
        this.router.navigate(['/', 'dashboard']);
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
   * Initiate a confirmation popup for either dashboard delete methods.
   */
  async confirmDashboardDelete(): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Delete dashboard?',
      message: 'This cannot be undone!',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      important: true,
    });

    if (response && this.rithmId) this.deleteDashboard(this.rithmId);
  }
}
