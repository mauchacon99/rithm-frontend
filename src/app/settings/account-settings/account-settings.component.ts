import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from '../../core/user.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AccountSettingsService } from 'src/app/core/account-settings.service';
import { firstValueFrom } from 'rxjs';

/**
 * Component for all of the account settings.
 */
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  /** Settings form. */
  settingsForm: FormGroup;

  /** Whether the account settings is loading. */
  isLoading = false;

  // TODO: Re-enable when addressing notification settings
  // /** Notification settings model. */
  // notificationSettings: NotificationSettings;

  /** The version number for the app. */
  readonly appVersionNumber = environment.appVersionNumber;

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private popupService: PopupService,
    private dialog: MatDialog,
    private accountSettingsService: AccountSettingsService
  ) {
    this.settingsForm = this.fb.group({
      userForm: this.fb.control(''),
    });
  }

  /**
   * Updates all settings for the user.
   */
  updateSettings(): void {
    this.isLoading = true;
    this.updateUserAccount();
    // TODO: enable when notifications settings are addressed
    // this.updateNotificationSettings();
  }

  /**
   * Update user account settings data.
   */
  private updateUserAccount(): void {
    const userFormData = this.settingsForm.get('userForm')?.value;
    const { firstName, lastName, confirmPassword } = userFormData;

    this.userService
      .updateUserAccount({ firstName, lastName, password: confirmPassword })
      .pipe(first())
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.settingsForm.reset();
          this.popupService.notify('Your account settings are updated.');
          this.accountSettingsService.setUser({ firstName, lastName });
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

  // TODO: Re-enable when addressing notification settings
  /**
   * Update notification settings info.
   */
  // private updateNotificationSettings(): void {
  //   this.userService.updateNotificationSettings(this.notificationSettings)
  //     .pipe(first())
  //     .subscribe(() => {
  //       this.isLoading = false;
  //       this.popupService.notify('Your notification settings are updated.');
  //     }, (error: HttpErrorResponse) => {
  //       this.isLoading = false;
  //       this.errorService.displayError(
  //         'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
  //         error
  //       );
  //     });
  // }

  /**
   * Open the terms and conditions modal.
   */
  async openTerms(): Promise<void> {
    let message = '';
    this.isLoading = true;
    try {
      const termsConditionsText = await firstValueFrom(
        this.userService.getTermsConditions()
      );
      if (termsConditionsText) {
        message = termsConditionsText;
        this.isLoading = false;
        await this.popupService.terms({
          title: 'Terms and Conditions',
          message,
        });
      }
    } catch (error) {
      this.isLoading = false;
      this.errorService.displayError(
        "Something went wrong on our end and we're looking into it. Please try again in a little while.",
        error
      );
    }
  }
}
