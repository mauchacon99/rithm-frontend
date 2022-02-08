import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardData } from 'src/models';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/**
 * Expansion menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-expansion-menu[dashboardRole]',
  templateUrl: './expansion-menu.component.html',
  styleUrls: ['./expansion-menu.component.scss'],
})
export class ExpansionMenuComponent implements OnInit, OnDestroy {
  /** Dashboards list. */
  dashboardsList: DashboardData[] = [];

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = false;

  /** Type dashboard. */
  @Input() dashboardRole!: RoleDashboardMenu;

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  /** Loading for list menu. */
  isLoading = false;

  /** Show error in list the dashboard. */
  showError = false;

  /** Dashboard selected. */
  dashboardSelected = '';

  /** Destroyed subscription. */
  private destroyed$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private sidenavDrawerService: SidenavDrawerService
  ) {}

  /** Init live cycle component. */
  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe((param) => {
      const dashboardRithmId = param.get('dashboardId');
      if (dashboardRithmId) {
        this.dashboardSelected = dashboardRithmId;
      }
    });
    this.getToListDashboards();
  }

  /** Get list to dashboard in expansion menu. */
  private getToListDashboards(): void {
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
   * Navigate to dashboard.
   *
   * @param dashboard This Dashboard to navigate.
   */
  navigateToDashboard(dashboard: DashboardData): void {
    this.router.navigate(['/', 'dashboard', dashboard.rithmId]);
    this.sidenavDrawerService.toggleDrawer('menuDashboard');
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
