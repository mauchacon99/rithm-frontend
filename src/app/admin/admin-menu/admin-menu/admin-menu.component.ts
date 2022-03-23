import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { OrganizationInfo } from 'src/models';
import { ListAdminOptionMenuType } from 'src/models/enums/admin-option-menu-type';
import { ListAdminOptionsMenu } from 'src/models/index';

/**
 * Admin menu component.
 */
@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
})
export class AdminMenuComponent implements OnInit {
  /** Emit widgetIndex to widget-drawer. */
  @Output() itemMenuSelected = new EventEmitter<ListAdminOptionMenuType>();

  /* Current item selected.  */
  itemSelected!: ListAdminOptionMenuType;

  /* Types admin option menu.  */
  listAdminOptionMenuType = ListAdminOptionMenuType;

  /** Information about organization. */
  organizationInfo!: OrganizationInfo;

  /** Show error if fail get organization info.*/
  failedGetOrganization = false;

  /** Organization information loading inline. */
  isLoading = true;

  /* Admin options menu.  */
  listAdminItemMenu: ListAdminOptionsMenu[] = [
    {
      name: 'Account Settings',
      type: this.listAdminOptionMenuType.AccountSettings,
      show: true,
    },
    {
      name: 'Group Hierarchy',
      type: this.listAdminOptionMenuType.GroupHierarchy,
      show: false,
    },
    {
      name: 'Directory',
      type: this.listAdminOptionMenuType.Directory,
      show: true,
    },
    {
      name: 'Integrations',
      type: this.listAdminOptionMenuType.Integrations,
      show: true,
    },
  ];

  constructor(
    private splitService: SplitService,
    private userService: UserService,
    private errorService: ErrorService,
    private organizationService: OrganizationService
  ) {}

  /** Get signed in user and information about organization. */
  ngOnInit(): void {
    this.getOrganizationInfo(this.userService.user.organization);
    this.split();
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

  /**
   * Get item selected item menu.
   *
   * @param optionSelected Option list menu selected.
   */
  getItemSelected(optionSelected: ListAdminOptionMenuType): void {
    this.itemMenuSelected.emit(optionSelected);
  }

  /**
   * Split Service for show or hidden section Admin Portal.
   */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.listAdminItemMenu[1].show =
          this.splitService.getGroupHierarchyMenuTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }
}
