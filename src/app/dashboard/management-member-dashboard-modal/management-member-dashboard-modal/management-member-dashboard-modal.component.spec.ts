import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { RoleDashboardMenu } from 'src/models';
import { MemberDashboardListModalComponent } from 'src/app/dashboard/management-member-dashboard-modal/member-dashboard-list-modal/member-dashboard-list-modal.component';

import { ManagementMemberDashboardModalComponent } from './management-member-dashboard-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('ManagementMemberDashboardModalComponent', () => {
  let component: ManagementMemberDashboardModalComponent;
  let fixture: ComponentFixture<ManagementMemberDashboardModalComponent>;

  const DIALOG_TEST_DATA: {
    /** Selected dashboardRithmId. */
    dashboardRithmId: string;
    /** Selected dashboardType. */
    dashboardType: string;
  } = {
    dashboardRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
    dashboardType: RoleDashboardMenu.Company,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ManagementMemberDashboardModalComponent,
        MockComponent(MemberDashboardListModalComponent),
      ],
      imports: [MatDialogModule, MatCheckboxModule, MatFormFieldModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMemberDashboardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
