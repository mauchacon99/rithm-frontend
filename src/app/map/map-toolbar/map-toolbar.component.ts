import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrganizationService } from 'src/app/core/organization.service';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { User, OrganizationInfo } from 'src/models';

/**
 * Component for managing the toolbar on the map.
 */
@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss'],
})
export class MapToolbarComponent implements OnInit {
  /** The users of the organization. */
  users: User[] = [];

  /** The organization information object. */
  orgInfo?: OrganizationInfo;

  constructor(
    private userService: UserService,
    private organizationService: OrganizationService,
    private errorService: ErrorService
  ) { }

  /**
   * Gets the first page of users on load.
   */
  ngOnInit(): void {
    this.getOrganizationInfo();
  }

  /**
   * Sets the map to add flow mode in preparation for a flow to be selected.
   */
  addFlow(): void {
    // TODO: Implement add flow
  }

  /**
   * Sets the map to add station mode in preparation for a station to be selected.
   */
  addStation(): void {
    // TODO: Implement add station
  }

  // MVP +1 below

  // undo(): void {}
  // redo(): void {}
  // search(): void {}

  /**
   * Gets organization information.
   */
  getOrganizationInfo(): void {
    const organizationId: string = this.userService.user?.organization;
    this.organizationService
      .getOrganizationInfo(organizationId)
      .pipe(first())
      .subscribe(
        (organization) => {
          if (organization) {
            this.orgInfo = organization;
          }
        },
        (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      );
  }
}
