import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserAccountInfo } from 'src/models';
import { UserService } from '../../core/user.service';

/**
 * Component for all of the account settings.
 */
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent {

  /** Whether the account settings is loading. */
  isLoading = true;

  /** User Account Info modal. */
  userAccountInfo: UserAccountInfo;

  constructor(private userService: UserService,
    private popupService: PopupService,
    private errorService: ErrorService,) {
    this.userAccountInfo = {
      firstName: 'James',
      lastName: 'Anderson',
      newPassword: 'mamamia'
    };
  }

  /**
   * Update user account settings data.
   */
  updateUserAccount(): void {
    this.userService.updateUserAccount(<string>this.userAccountInfo.firstName,
      <string>this.userAccountInfo.lastName, <string>this.userAccountInfo.newPassword)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        this.popupService.notify('Your account settings are updated.');
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }

}
