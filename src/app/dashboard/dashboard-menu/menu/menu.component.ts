import { Component, OnInit } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';
import { UserService } from 'src/app/core/user.service';
import { SplitService } from 'src/app/core/split.service';
import { ErrorService } from 'src/app/core/error.service';
import { first } from 'rxjs';
/**
 * Main menu component for dashboard menu drawer.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  /** Type role for menu in dashboard. */
  dashboardRole = RoleDashboardMenu;

  /** Show or hidden option manage member. */
  isManageMember = false;

  constructor(
    private userService: UserService,
    private splitService: SplitService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.split();
  }

  /**
   * Split Service.
   */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.isManageMember =
          this.splitService.getManageUserTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }
}
