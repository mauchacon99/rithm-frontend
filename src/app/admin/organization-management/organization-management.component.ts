import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
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

  /** The users of the organization. */
  users!: User[];

  /** Total number of users in this organization. */
  totalNumUsers = 0;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private errorService: ErrorService
  ) { }

  /**
   * Gets the first page of users on load.
   */
  ngOnInit(): void {
    this.getUsers(1);
  }

  /**
   * Gets a page list of users.
   *
   * @param pageNum The desired page of user results.
   */
  getUsers(pageNum: number): void {
    this.activeNum = pageNum;
    this.isLoading = true;
    const organizationId = this.userService.user?.organizations[0];
    this.userService.getUsersForOrganization(organizationId, pageNum)
      .pipe(first())
      .subscribe((users) => {
        if (users) {
          this.users = users;
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

  /**
   * Removes a user from the organization.
   *
   * @param userRithmId The ID of the selected user to remove.
   */
  removeUser(userRithmId: string): void {
    this.isLoading = true;
    this.userService.removeUserFromOrganization(userRithmId)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        this.popupService.notify('User removed from organization.');
      }, (error: unknown) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }
}
