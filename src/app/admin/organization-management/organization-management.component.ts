import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/core/user.service';
import { ErrorService } from 'src/app/core/error.service';
import { User } from 'src/models';

/**
 * Component for managing the users of an organization.
 */
@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss']
})
export class OrganizationManagementComponent implements OnInit {
  /** Whether the account settings is loading. */
  isLoading = false;

  /** The current page number. */
  activeNum = 1;

  /** Total number of users in this organization. */
  totalNumUsers = 0;

  /** The users in this organization. */
  users: User[] = [];

  constructor(private userService: UserService,
    private errorService: ErrorService) { }

  /**
   * Gets the first page of users on load.
   */
  ngOnInit(): void {
    this.getUsers(this.activeNum);
  }

  /**
   * Gets a page list of users.
   *
   * @param pageNum The desired page of user results.
   */
  getUsers(pageNum: number): void {
    this.activeNum = pageNum;
    this.isLoading = true;
    const organizationId: string = this.userService.user?.organizations[0];
    this.userService.getUsersForOrganization(organizationId, pageNum)
      .pipe(first())
      .subscribe((orgUsers) => {
        if (orgUsers) {
          this.users = orgUsers.users;
          this.totalNumUsers = orgUsers.totalOrgUsers;
        }
        this.isLoading = false;
      }, (error: unknown) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
