import { Component, Input, OnInit } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardData } from 'src/models';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Router } from '@angular/router';

/**
 * Expansion menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-expansion-menu[dashboardRole][isManageMember]',
  templateUrl: './expansion-menu.component.html',
  styleUrls: ['./expansion-menu.component.scss'],
})
export class ExpansionMenuComponent implements OnInit {
  /** Parameter for hide or show option manage member. */
  @Input() isManageMember = false;

  /** Type dashboard. */
  @Input() dashboardRole!: RoleDashboardMenu;

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = false;

  /** Loading for list menu. */
  isLoading = false;

  /** Show error in list the dashboard. */
  showError = false;

  /** Show error in list the dashboard. */
  isPrincipalPageDashboard = false;

  /** Dashboards list. */
  dashboardsList: DashboardData[] = [];

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private router: Router
  ) {}

  /** Init live cycle component. */
  ngOnInit(): void {
    this.getToListDashboards();
    this.isPrincipalPageDashboard = this.router.url === '/dashboard';
  }

  /** Get list to dashboard in expansion menu. */
  getToListDashboards(): void {
    this.showError = false;
    this.isLoading = true;
    const petitionDashboard$ =
      this.dashboardRole === this.roleDashboardMenu.Company
        ? this.dashboardService.getOrganizationDashboard()
        : this.dashboardService.getPersonalDashboard();

    petitionDashboard$.pipe(first()).subscribe({
      next: (dashboards) => {
        this.showError = false;
        this.isLoading = false;
        this.dashboardsList = dashboards;
      },
      error: (error: unknown) => {
        this.showError = true;
        this.isLoading = false;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Hidden drawer menu dashboard.
   */
  hiddenDrawer(): void {
    this.sidenavDrawerService.toggleDrawer('menuDashboard');
  }
}
