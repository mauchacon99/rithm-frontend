import { HttpErrorResponse } from '@angular/common/http';
import { Component, forwardRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserAccountInfo, NotificationSettings } from 'src/models';
import { UserService } from '../../core/user.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionsModalComponent } from 'src/app/shared/terms-conditions-modal/terms-conditions-modal.component';
import { FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Component for all of the account settings.
 */
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountSettingsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AccountSettingsComponent),
      multi: true
    }
  ]
})
export class AccountSettingsComponent {
  /** Settings form. */
  settingsForm: FormGroup;

  /** Whether the account settings is loading. */
  isLoading = false;

  /** User Account Info model. */
  userAccountInfo: UserAccountInfo;

  /** Notification settings model. */
  notificationSettings: NotificationSettings;

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private popupService: PopupService,
    private dialog: MatDialog,
    ) {
    this.userAccountInfo = {
      firstName: 'James',
      lastName: 'Anderson',
      newPassword: 'mamamia'
    };
    this.notificationSettings = {
      comments: true,
      commentMentions: false
    };

    this.settingsForm = this.fb.group({
      userForm: this.fb.control('')
    });
  }

  /**
   * Updates all settings for the user.
   */
  updateSettings(): void {
    this.isLoading = true;
    // eslint-disable-next-line max-len
    console.log(this.settingsForm.value.userForm.firstName + ' ' + this.settingsForm.value.userForm.password);
    this.updateUserAccount();
    this.updateNotificationSettings();
  }

  /**
   * Update user account settings data.
   */
  private updateUserAccount(): void {
    this.userService.updateUserAccount(this.userAccountInfo)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        this.popupService.notify('Your account settings are updated.');
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Update notification settings info.
   */
  private updateNotificationSettings(): void {
    this.userService.updateNotificationSettings(this.notificationSettings)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        this.popupService.notify('Your notification settings are updated.');
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Opens the terms and conditions in a modal.
   *
   */
  viewTermsAndConditions(): void {
    this.dialog.open(TermsConditionsModalComponent, {
      panelClass: 'terms-condition',
      data: {
        title: 'Terms and Conditions',
        message: '',
        okButtonText: 'Ok',
        width: '90%',
        showAgreeButton: false
      }
    });
  }

}
