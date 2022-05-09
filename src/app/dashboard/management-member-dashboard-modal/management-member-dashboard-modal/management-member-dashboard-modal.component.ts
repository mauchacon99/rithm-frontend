import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterOptionTypeMemberDashboard } from 'src/models/enums/filter-option-type-member-dashboard';
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

  /** Show error if get users members fails. */
  errorGetUsersMember = false;

  /** Users to add to dashboard. */
  usersAdd!: MemberDashboard[];

  /** Selected filter. */
  selectedFilterValue: FilterOptionTypeMemberDashboard =
    FilterOptionTypeMemberDashboard.All;

  /** Filter options. */
  optionsSelectList: FilterOptionTypeMemberDashboard[] = [
    FilterOptionTypeMemberDashboard.All,
    FilterOptionTypeMemberDashboard.ViewOnly,
    FilterOptionTypeMemberDashboard.CanEdit,
  ];

  /** Search value. */
  search = '';

  /** Select all checked. */
  checkedSelectAll = false;

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

  /**
   * Add members to dashboard.
   *
   */
  addDashboardMembers(): void {
    this.dashboardService
      .addDashboardMembers(this.usersAdd)
      .pipe(first())
      .subscribe({
        next: (currentUsers) => {
          this.membersDashboard = currentUsers;
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
   * Detected change in mat-select.
   */
  matSelectChange(): void {
    /** Detected change here with selectedFilterValue. */
  }
}
