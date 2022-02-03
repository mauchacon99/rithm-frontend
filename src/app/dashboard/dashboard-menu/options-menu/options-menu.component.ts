import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { RoleDashboardMenu } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

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

  /** Allows functionality of MatMenu to toggle the menu open. */
  @ViewChild(MatMenuTrigger)
  private optionsMenuTrigger!: MatMenuTrigger;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private router: Router,
    private sidenavDrawerService: SidenavDrawerService
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
    this.dashboardService.toggleLoadingNewDashboard(true);
    const generateDashboard$ =
      this.dashboardRole === this.roleDashboardMenu.PersonalDashboard
        ? this.dashboardService.generateNewPersonalDashboard()
        : this.dashboardService.generateNewOrganizationDashboard();
    generateDashboard$.pipe(first()).subscribe({
      next: (newDashboard) => {
        this.isGenerateNewDashboard = false;
        this.dashboardService.toggleLoadingNewDashboard(false);
        this.router.navigate([
          '/',
          'dashboard',
          newDashboard.rithmId,
          this.dashboardRole,
        ]);
      },
      error: (error: unknown) => {
        this.dashboardService.toggleLoadingNewDashboard(false);
        this.isGenerateNewDashboard = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }
}
