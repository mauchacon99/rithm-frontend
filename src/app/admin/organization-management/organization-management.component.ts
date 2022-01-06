import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { User, OrganizationInfo } from 'src/models';
import { OrganizationService } from 'src/app/core/organization.service';

/**
 * Component for managing the users of an organization.
 */
@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss'],
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

  /** While edit button using the save & edit. */
  editName = false;

  /** Organization name form. */
  orgNameForm: FormGroup;

  /** The organization information object. */
  orgInfo?: OrganizationInfo;

  /** Whether the organization information is loading. */
  orgLoading = false;

  /** Admin promote or demote loading indicator. */
  roleLoading: boolean[] = [];

  /** Whether the organization name is loading. */
  orgNameLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService,
    private popupService: PopupService,
    private organizationService: OrganizationService
  ) {
    this.orgNameForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  /**
   * Gets the first page of users on load.
   */
  ngOnInit(): void {
    this.currentUser = this.userService.user;
    this.getUsers(this.activeNum);
    this.getOrganizationInfo();
  }

  /**
   * Gets a page list of users.
   *
   * @param pageNum The desired page of user results.
   */
  getUsers(pageNum: number): void {
    this.activeNum = pageNum;
    this.isLoading = true;
    const organizationId: string = this.userService.user?.organization;
    this.organizationService
      .getUsersForOrganization(organizationId, pageNum)
      .pipe(first())
      .subscribe({
        next: (orgUsers) => {
          if (orgUsers) {
            this.users = orgUsers.users;
            this.totalNumUsers = orgUsers.totalOrgUsers;
          }
          this.isLoading = false;
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
        this.organizationService
          .removeUserFromOrganization(
            this.userService.user?.organization,
            user.rithmId
          )
          .pipe(first())
          .subscribe({
            next: () => {
              this.popupService.notify('User removed from organization.');
              this.getUsers(this.activeNum);
            },
            error: (error: unknown) => {
              this.isLoading = false;
              this.errorService.displayError(
                "Something went wrong on our end and we're looking into it. Please try again in a little while.",
                error,
                true
              );
            },
          });
      }
    }
  }

  /**
   * Gets organization information.
   */
  getOrganizationInfo(): void {
    this.orgLoading = true;
    const organizationId: string = this.userService.user?.organization;
    this.organizationService
      .getOrganizationInfo(organizationId)
      .pipe(first())
      .subscribe({
        next: (organization) => {
          if (organization) {
            this.orgInfo = organization;
          }
          this.orgLoading = false;
        },
        error: (error: unknown) => {
          this.orgLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Promote or demote user from admin role.
   *
   * @param user User who has to be promoted or demoted.
   * @param userId The id of user for which role has to update.
   * @param index The index of the user in page.
   */
  async updateUserRole(
    user: User,
    userId: string,
    index: number
  ): Promise<void> {
    let role: 'admin' | null;
    let message,
      title,
      buttonText = '';
    if (!user.role || user.role.length === 0 || user.role !== 'admin') {
      role = 'admin';
      // eslint-disable-next-line max-len
      message = `Promoting ${user.firstName} ${user.lastName} to an admin will give this user additional privileges. Are you sure you want to do this?`;
      title = 'Promote to Admin';
      buttonText = 'Promote';
    } else {
      role = null;
      // eslint-disable-next-line max-len
      message = `${user.firstName} ${user.lastName} will lose their admin privileges and be restricted in certain functionality. Are you sure you want to do this?`;
      title = 'Remove Admin Privileges';
      buttonText = 'Remove';
    }
    const organizationId: string = this.userService.user?.organization;
    const confirm = await this.popupService.confirm({
      title: title,
      message: message,
      okButtonText: buttonText,
    });

    if (confirm) {
      this.roleLoading[index] = true;
      this.organizationService
        .updateUserRole(role, organizationId, userId)
        .pipe(first())
        .subscribe({
          next: () => {
            this.roleLoading[index] = false;
            !user.role || user.role.length === 0
              ? (user.role = 'admin')
              : (user.role = null);
            user.role && user.role.length > 0
              ? this.popupService.notify(
                'User has been promoted to admin role.'
              )
              : this.popupService.notify(
                'User has been de-promoted from admin role.'
              );
          },
          error: (error: unknown) => {
            this.roleLoading[index] = false;
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error,
              true
            );
          },
        });
    }
  }

  /**
   * Updates Organization details.
   */
  updateOrganization(): void {
    this.orgNameLoading = true;
    this.editName = !this.editName;
    const organizationId: string = this.userService.user?.organization;
    const orgData: OrganizationInfo = {
      name: this.orgNameForm.get('name')?.value,
      mainContactEmail: this.orgInfo?.mainContactEmail as string,
      mainContactPhoneNumber: this.orgInfo?.mainContactPhoneNumber as string,
      timeZone: this.orgInfo?.timeZone as string,
    };
    this.organizationService
      .updateOrganizationInfo(orgData, organizationId)
      .pipe(first())
      .subscribe({
        next: (organization) => {
          if (organization) {
            this.orgInfo = organization;
          }
          this.orgNameLoading = false;
          this.popupService.notify('Organization name has been updated.');
        },
        error: (error: unknown) => {
          this.orgNameLoading = false;
          this.editName = !this.editName;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error,
            true
          );
        },
      });
  }

  /**
   *Edit the organization name from view to edit.
   */
  editOrgName(): void {
    this.orgNameForm.get('name')?.setValue(this.orgInfo?.name);
    this.orgNameForm.markAsPristine();
    this.editName = !this.editName;
  }
}
