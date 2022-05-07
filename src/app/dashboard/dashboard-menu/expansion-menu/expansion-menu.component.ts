import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardData } from 'src/models';
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

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

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

  /** Mark dashboard default. */
  indexDefaultDashboard!: number | undefined;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
    private router: Router,
    private user: UserService,
    private cd: ChangeDetectorRef
  ) {}

  /** Init live cycle component. */
  ngOnInit(): void {
    this.detectDefaultDashboard$();
    this.getToListDashboards();
    this.isPrincipalPageDashboard = this.router.url === '/dashboard';
  }

  /**
   * Detect when another dashboard is assigned as default between expansions.
   */
  private detectDefaultDashboard$(): void {
    this.user.userData$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (user) => {
        if (user.defaultDashboardType !== this.dashboardRole) {
          this.indexDefaultDashboard = undefined;
        }
      },
    });
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

  /**
   * Mark dashboard as default.
   *
   * @param isDefault Is default dashboard.
   * @param index Index of dashboard.
   */
  markDefaultDashboard(isDefault: boolean, index: number): void {
    if (isDefault) {
      this.indexDefaultDashboard = index;
      this.cd.detectChanges();
    }
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
