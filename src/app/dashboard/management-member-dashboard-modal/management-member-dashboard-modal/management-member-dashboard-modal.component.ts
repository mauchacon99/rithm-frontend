import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterOptionTypeMemberDashboard } from 'src/models/enums/filter-option-type-member-dashboard';

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
    public modalData: ModalData
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.dashboardRithmId = this.modalData.dashboardRithmId;
    this.dashboardType = this.modalData.dashboardType;
  }

  /**
   * Detected change in mat-select.
   */
  matSelectChange(): void {
    /** Detected change here with selectedFilterValue. */
  }
}
