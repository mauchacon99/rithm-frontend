import { Component } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { UserService } from 'src/app/core/user.service';
import { OrganizationInfo } from 'src/models';

/**
 * Main menu component for dashboard menu drawer.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  /** Information about organization. */
  organizationInfo!: OrganizationInfo;

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
   getOrganizationInfo(organizationId: string): void {
    this.organizationService
      .getOrganizationInfo(organizationId)
      .pipe(first())
      .subscribe({
        next: (organization) => {
          this.organizationInfo = organization;
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
