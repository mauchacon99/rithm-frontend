import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { UserService } from 'src/app/core/user.service';
import { OrganizationInfo } from 'src/models';
/**
 * Admin menu component.
 */
@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
})
export class AdminMenuComponent implements OnInit {
  /** Information about organization. */
  organizationInfo!: OrganizationInfo;

  /** Show error if fail get organization info.*/
  failedGetOrganization = false;

  /** Organization information loading inline. */
  isLoading = true;

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private organizationService: OrganizationService
  ) {}

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
          this.failedGetOrganization = false;
          this.organizationInfo = organization;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.failedGetOrganization = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
