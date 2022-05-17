import { Component, Input, OnInit } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardData, User } from 'src/models';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user.service';

/**
 * Expansion menu for dashboard menu drawer.
 */
@Component({
  selector:
    'app-expansion-menu[dashboardRole][isManageMember][showDefaultDashboard]',
  templateUrl: './expansion-menu.component.html',
  styleUrls: ['./expansion-menu.component.scss'],
})
export class ExpansionMenuComponent implements OnInit {
  /** Parameter for hide or show option manage member. */
  @Input() isManageMember = false;

  /** Type dashboard. */
  @Input() dashboardRole!: RoleDashboardMenu;

  /**
   * Show default dashboard.
   */
  @Input() showDefaultDashboard = false;

  /**
   * Current user.
   *
   * @returns Current user .
   */
  get user(): User {
    return this.userService.user;
  }

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = true;

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

  /** Is admin. */
  isAdmin = false;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private router: Router,
    private userService: UserService
  ) {}

  /** Init live cycle component. */
  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin;
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
