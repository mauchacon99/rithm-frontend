import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { User } from 'src/models';
import { DashboardService } from '../../dashboard.service';

/**Interface data modal. */
interface ModalData {
  /** Selected dashboardRithmId. */
  dashboardRithmId: string;
  /** Selected dashboardType. */
  dashboardType: string;
}

/** Manage members modal. */
@Component({
  selector: 'app-management-member-dashboard-modal',
  templateUrl: './management-member-dashboard-modal.component.html',
  styleUrls: ['./management-member-dashboard-modal.component.scss'],
})
export class ManagementMemberDashboardModalComponent implements OnInit {
  /** Selected dashboardRithmId. */
  dashboardRithmId!: string;

  /** Selected dashboardType. */
  dashboardType!: string;

  /** Users to add to dashboard. */
  usersAdd!: User[];

  /** Current users to add to dashboard. */
  currentUsers!: User[];

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
  }

  /**
   * Add members to dashboard.
   *
   */
  addDashboardMembers(): void {
    this.dashboardService
      .addDashboardMembers(this.dashboardRithmId, this.usersAdd)
      .pipe(first())
      .subscribe({
        next: (currentUsers) => {
          this.currentUsers = currentUsers;
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
