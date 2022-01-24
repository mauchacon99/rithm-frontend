import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/core/user.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { OrganizationInfo } from 'src/models';
import { ErrorService } from 'src/app/core/error.service';

/**
 * Main menu component for dashboard menu drawer.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
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
  private getOrganizationInfo(organizationId: string): void {
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
