import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { StationRosterMember, User } from 'src/models';
/**
 * Reusable component to display a modal with the list of user.
 */
@Component({
  selector: 'app-user-list-modal',
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.scss'],
})
export class UserListModalComponent implements OnInit {
  /** The user roster for the current station. */
  userRoster: StationRosterMember[] | User[] = [];

  seasons: number[] = [1, 2, 3, 4, 5, 6];

  /** The station Id. */
  stationRithmId = '';

  /** Loading/Error variable section. */
  allowAllOrgWorkers = false;

  /** Loading/Error variable section. */
  userRosterLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: string,
    private stationService: StationService,
    private orgService: OrganizationService,
    private errorService: ErrorService,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserListModalComponent>
  ) {
    this.stationRithmId = data;
  }

  /** Init Method. */
  ngOnInit(): void {
    this.getAllowAllOrgWorkers();
  }

  /**
   * Get getAllowAllOrgWorkers for the current station.
   */
  private getAllowAllOrgWorkers(): void {
    this.userRosterLoading = true;
    this.stationService
      .getAllowAllOrgWorkers(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (allow) => {
          this.allowAllOrgWorkers = allow;
          this.getUserList();
        },
        error: (error: unknown) => {
          this.userRosterLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Get a list of users according to allowAllOrgWorkers.
   */
  private getUserList(): void {
    if (this.allowAllOrgWorkers) {
      this.getOrganizationUsers();
    } else {
      this.getStationAllRoster();
    }
  }

  /**
   * Get Station All Roster.
   */
  private getStationAllRoster(): void {
    this.stationService
      .getStationAllRoster(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (users) => {
          this.userRoster = users;
        },
        error: (error: unknown) => {
          this.userRosterLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Get All Organization users.
   */
  private getOrganizationUsers(): void {
    this.orgService
      .getUsersForOrganization(this.userService.user?.organization, 1)
      .pipe(first())
      .subscribe({
        next: (orgData) => {
          this.userRoster = orgData.users;
        },
        error: (error: unknown) => {
          this.userRosterLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
