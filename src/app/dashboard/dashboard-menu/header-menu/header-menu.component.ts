import { Component, OnInit } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/core/user.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { OrganizationInfo } from 'src/models';
import { ErrorService } from 'src/app/core/error.service';

/**
 * Header for dashboard menu drawer.
 */
@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  /** Information about organization. */
  organizationInfo!: OrganizationInfo;

  /** Organization information loading inline. */
  isLoading = true;

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private errorService: ErrorService,
    private organizationService: OrganizationService
  ) {}

  /**
   * Opens side nav on the dashboard.
   *
   * @param drawerItem The information that will be displayed in the side drawer.
   */
  toggleMenu(drawerItem: 'menuDashboard'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }

  /** Get signed in user and information about organization. */
  ngOnInit(): void {
    this.getOrganizationInfo(this.userService.user.organization);
  }

  /**
   * Get information about organization.
   *
   * @param organizationId String of user organization.
   */
  private getOrganizationInfo(organizationId: string): void {
    this.isLoading = true;
    this.organizationService
      .getOrganizationInfo(organizationId)
      .pipe(first())
      .subscribe({
        next: (organization) => {
          this.isLoading = false;
          this.organizationInfo = organization;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
