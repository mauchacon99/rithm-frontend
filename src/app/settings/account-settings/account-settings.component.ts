import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserAccountInfo, NotificationSettings } from 'src/models';
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
  isLoading = false;

  /** User Account Info model. */
  userAccountInfo: UserAccountInfo;

  /** Notification settings model. */
  notificationSettings: NotificationSettings;

  constructor(private userService: UserService,
    private popupService: PopupService,
    private errorService: ErrorService,) {
    this.userAccountInfo = {
      firstName: 'James',
      lastName: 'Anderson',
      newPassword: 'mamamia'
    };
    this.notificationSettings = {
      comments: true,
      commentMentions: false
    };
  }

  /**
   * Update user account settings data.
   */
  updateUserAccount(): void {
    this.userService.updateUserAccount(this.userAccountInfo)
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

  /**
   * Update notification settings info.
   */
  updateNotificationSettings(): void {
    this.userService.updateNotificationSettings(this.notificationSettings)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        this.popupService.notify('Your notification settings are updated.');
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
