import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { RoleDashboardMenu } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { PopupService } from 'src/app/core/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { ManagementMemberDashboardModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/management-member-dashboard-modal/management-member-dashboard-modal.component';

/**
 * Options menu for dashboard menu drawer.
 */
@Component({
  selector:
    'app-options-menu[dashboardRole][isManageMember][showDefaultDashboard]',
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.scss'],
})
export class OptionsMenuComponent implements OnInit, OnDestroy {
  /** Allows functionality of MatMenu to toggle the menu open. */
  @ViewChild(MatMenuTrigger)
  private optionsMenuTrigger!: MatMenuTrigger;

  /** Parameter for hide or show option manage member. */
  @Input() isManageMember = false;

  /**
   * Dashboard type from expansion-menu.
   */
  @Input() dashboardRole!: RoleDashboardMenu;

  /**
   * Show default dashboard.
   */
  @Input() showDefaultDashboard = false;

  /** Show option. */
  @Input() isDashboardListOptions!: boolean;

  /** Dashboard rithmId. */
  @Input() rithmId!: string;

  /** Index of dashboard . */
  @Input() index!: number;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  /** Rithm id get for params.*/
  paramRithmId!: string | null;

  /** Display or not mat menu when its generate new dashboard. */
  isGenerateNewDashboard = false;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private router: Router,
    private sidenavDrawerService: SidenavDrawerService,
    private popupService: PopupService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (params) => {
        this.paramRithmId = params.get('dashboardId');
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

  /**
   * Open dialog add widget.
   */
  openDialogManagementMembers(): void {
    this.dialog.open(ManagementMemberDashboardModalComponent, {
      panelClass: [
        'w-5/6',
        'sm:w-3/5',
        'h-[95%]',
        'sm:h-5/6',
        'custom-margin-modal',
      ],
      maxWidth: '1500px',
      disableClose: true,
      data: {
        dashboardRithmId: this.rithmId,
        dashboardType: this.dashboardRole,
      },
    });
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
