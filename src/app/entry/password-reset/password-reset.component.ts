import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { PasswordRequirements } from 'src/helpers/password-requirements';

/**
 * Component used for resetting a password.
 */
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  /** Password requirements helper. */
  private passwordReq: PasswordRequirements;

  /** Password reset form. */
  passResetForm: FormGroup;

  /** Are password requirements visible. */
  passReqVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService
  ) {
    this.passwordReq = new PasswordRequirements();
    this.passResetForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          this.passwordReq.isGreaterThanEightChars(),
          this.passwordReq.hasOneLowerCaseChar(),
          this.passwordReq.hasOneUpperCaseChar(),
          this.passwordReq.hasOneDigitChar(),
          this.passwordReq.hasOneSpecialChar()
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.passwordReq.isGreaterThanEightChars(),
          this.passwordReq.hasOneLowerCaseChar(),
          this.passwordReq.hasOneUpperCaseChar(),
          this.passwordReq.hasOneDigitChar(),
          this.passwordReq.hasOneSpecialChar(),
          this.passwordReq.passwordsMatch()
        ]
      ]
    });
  }

  /**
   * Toggle visibility of password requirements.
   *
   * @param errorsFieldToCheck What field to get errors for child component.
   */
  togglePassReq(errorsFieldToCheck: string): void {
    this.errorsToGet = errorsFieldToCheck;
    this.passReqVisible = !this.passReqVisible;
    this.showMatch = errorsFieldToCheck === 'confirmPassword';
  }

  /**
   * Attempts to reset the password for the user.
   */
  resetPassword(): void {
    this.userService.resetPassword('kjdf', 'kjdkf', this.passResetForm.value.password)
    .pipe(first())
    .subscribe(() => {
      // TODO: RIT-279
    }, (error) => {
      this.errorService.displayError(
        'Something went wrong and we were unable to reset your password. Please try again in a little while.',
        error,
        true
      );
    });
  }
}
