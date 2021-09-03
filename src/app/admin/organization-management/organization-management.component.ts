import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { User } from 'src/models';
import { OrganizationService } from 'src/app/core/organization.service';

/**
 * Component for managing the users of an organization.
 */
@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss']
})
export class OrganizationManagementComponent implements OnInit {

  /** The users of the organization. */
  users: User[] = [];

  /** The current signed in user. */
  currentUser!: User;

  /** The current page number. */
  activeNum = 1;

  /** Whether the account settings is loading. */
  isLoading = false;

  /** Total number of users in this organization. */
  totalNumUsers = 0;

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private popupService: PopupService,
    private organizationService: OrganizationService
  ) { }

  /**
   * Gets the first page of users on load.
   */
  ngOnInit(): void {
    this.currentUser = this.userService.user;
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
    this.organizationService.getUsersForOrganization(organizationId, pageNum)
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

  /**
   * Removes a user from the organization.
   *
   * @param user The selected user to remove.
   */
  async removeUser(user: User): Promise<void> {
    if (user.rithmId === this.currentUser.rithmId) {
      this.popupService.notify('Cannot remove self from organization.');
    } else {
      const confirm = await this.popupService.confirm({
        title: 'Remove User',
        message: `Remove ${user.firstName} ${user.lastName} from the organization?`,
        okButtonText: 'Remove',
      });
      if (confirm) {
        this.isLoading = true;
        this.organizationService.removeUserFromOrganization(this.userService.user?.organizations[0], user.rithmId)
          .pipe(first())
          .subscribe(() => {
            this.popupService.notify('User removed from organization.');
            this.getUsers(this.activeNum);
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
  }
}
