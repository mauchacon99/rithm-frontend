import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { RoleDashboardMenu } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { SplitService } from 'src/app/core/split.service';

/**
 * Options menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-options-menu[dashboardRole]',
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.scss'],
})
export class OptionsMenuComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  /**
   * Dashboard type from expansion-menu.
   */
  @Input() dashboardRole!: RoleDashboardMenu;

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  /** Display or not mat menu when its generate new dashboard. */
  isGenerateNewDashboard = false;

  /** Show or hidden option manage member. */
  isManageMember = false;

  /** Rithm id get for params.*/
  paramRithmId!: string | null;

  /** Show option. */
  @Input() isDashboardListOptions!: boolean;

  /** Dashboard rithmId. */
  @Input() rithmId!: string;

  /** Index of dashboard . */
  @Input() index!: number;

  /** Allows functionality of MatMenu to toggle the menu open. */
  @ViewChild(MatMenuTrigger)
  private optionsMenuTrigger!: MatMenuTrigger;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private router: Router,
    private sidenavDrawerService: SidenavDrawerService,
    private popupService: PopupService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private splitService: SplitService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.split(this.userService.user.organization);
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (params) => {
        this.paramRithmId = params.get('dashboardId');
      },
    });
  }

  /**
   * Split Service.
   *
   * @param rithmIdOrganization Organization id of logged in user.
   */
  private split(rithmIdOrganization: string): void {
    this.splitService.initSdk(rithmIdOrganization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.isManageMember =
          this.splitService.getManageUserTreatment() === 'on';
        console.log(this.splitService.getManageUserTreatment());
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

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
        this.router.navigate(['/', 'dashboard', newDashboard.rithmId], {
          queryParams: { editMode: true },
        });
        this.popupService.notify('Dashboard created successfully');
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
    const isCurrentDashboard = rithmId === this.paramRithmId;
    const isCurrentPrincipalDashboard = this.paramRithmId === null;
    /* Index is principal dashboard when is 0 this is specified in dashboard-component getOrganizationDashboard
      if this value is modified should modified this condition. */
    const isPrincipalDashboard =
      this.index === 0 && this.dashboardRole === this.roleDashboardMenu.Company;

    if (
      isCurrentDashboard ||
      (isCurrentPrincipalDashboard && isPrincipalDashboard)
    ) {
      this.dashboardService.toggleLoadingDashboard(true);
    }

    this.sidenavDrawerService.toggleDrawer('menuDashboard');

    const deleteDashboard$ =
      this.dashboardRole === this.roleDashboardMenu.Company
        ? this.dashboardService.deleteOrganizationDashboard(rithmId)
        : this.dashboardService.deletePersonalDashboard(rithmId);

    deleteDashboard$.pipe(first()).subscribe({
      next: () => {
        if (isCurrentPrincipalDashboard && isPrincipalDashboard)
          this.dashboardService.toggleLoadingDashboard(false, true);
        //dashboardService.toggleLoadingDashboard is to reload dashboard component
        else if (isCurrentDashboard) this.router.navigate(['/', 'dashboard']);

        this.popupService.notify('Dashboard removed successfully');
      },
      error: (error: unknown) => {
        this.sidenavDrawerService.toggleDrawer('menuDashboard');
        if (
          isCurrentDashboard ||
          (isCurrentPrincipalDashboard && isPrincipalDashboard)
        )
          this.dashboardService.toggleLoadingDashboard(false, true);

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

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
