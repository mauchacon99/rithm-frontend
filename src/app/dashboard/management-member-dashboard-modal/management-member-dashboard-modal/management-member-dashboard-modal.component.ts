import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { MemberDashboard, RoleDashboardMenu } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

/**Interface data modal. */
interface ModalData {
  /** Selected dashboardRithmId. */
  dashboardRithmId: string;
  /** Selected dashboardType. */
  dashboardType: RoleDashboardMenu;
}

/** Manage members modal. */
@Component({
  selector: 'app-management-member-dashboard-modal',
  templateUrl: './management-member-dashboard-modal.component.html',
  styleUrls: ['./management-member-dashboard-modal.component.scss'],
})
export class ManagementMemberDashboardModalComponent implements OnInit {
  /** Members dashboard personal. */
  membersDashboard!: MemberDashboard[];

  /** Selected dashboardRithmId. */
  dashboardRithmId!: string;

  /** Selected dashboardType. */
  dashboardType!: RoleDashboardMenu;

  /** Enum type of role dashboard. */
  enumRoleDashboardMenu = RoleDashboardMenu;

  /** Loading get user members. */
  isLoadingGetUserMembers = false;

  /** Show error if get users members. */
  errorGetUsersMember = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: ModalData,
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.dashboardRithmId = this.modalData.dashboardRithmId;
    this.dashboardType = this.modalData.dashboardType;
    if (this.dashboardType === this.enumRoleDashboardMenu.Personal) {
      this.getUsersDashboardPersonal();
    }
  }

  /** Get users to dashboard personal. */
  getUsersDashboardPersonal(): void {
    this.isLoadingGetUserMembers = true;
    this.errorGetUsersMember = false;
    this.dashboardService
      .getUsersDashboardPersonal()
      .pipe(first())
      .subscribe({
        next: (membersDashboard) => {
          this.isLoadingGetUserMembers = false;
          this.errorGetUsersMember = false;
          this.membersDashboard = membersDashboard;
        },
        error: (error: unknown) => {
          this.isLoadingGetUserMembers = false;
          this.errorGetUsersMember = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
