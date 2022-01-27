import { Component, Input, OnInit } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardData } from 'src/models';

/**
 * Expansion menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-expansion-menu[dashboardRole]',
  templateUrl: './expansion-menu.component.html',
  styleUrls: ['./expansion-menu.component.scss'],
})
export class ExpansionMenuComponent implements OnInit {
  /** Dashboards list. */
  dashboardsList: DashboardData[] = [];

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = false;

  /** Type dashboard. */
  @Input() dashboardRole!: RoleDashboardMenu;

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) {}

  /** Init live cycle component. */
  ngOnInit(): void {
    const petitionDashboard$ =
      this.dashboardRole === this.roleDashboardMenu.OrganizationDashboard
        ? this.dashboardService.getOrganizationDashboard()
        : this.dashboardService.getPersonalDashboard();

    petitionDashboard$.pipe(first()).subscribe({
      next: (dashboards) => {
        this.dashboardsList = dashboards;
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
