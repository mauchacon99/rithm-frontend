import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      /** Selected dashboardRithmId. */
      dashboardRithmId: string;
      /** Selected dashboardType. */
      dashboardType: string;
    }
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.dashboardRithmId = this.modalData.dashboardRithmId;
    this.dashboardType = this.modalData.dashboardType;
  }
}
