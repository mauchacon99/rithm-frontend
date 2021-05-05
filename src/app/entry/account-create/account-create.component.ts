import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordRequirements } from 'src/helpers/password-requirements';

/**
 * Component used for creating an account.
 */
@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent {
  /** Sign up form. */
  signUpForm: FormGroup;

  /** Are password requirements visible. */
  passReqVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  /** Init Password Requirements helper. */
  private passwordReqService: PasswordRequirements;

  constructor(
    private fb: FormBuilder
  ) {
    this.passwordReqService = new PasswordRequirements();

    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          this.passwordReqService.isGreaterThanEightChars(),
          this.passwordReqService.hasOneLowerCaseChar(),
          this.passwordReqService.hasOneUpperCaseChar(),
          this.passwordReqService.hasOneDigitChar(),
          this.passwordReqService.hasOneSpecialChar()
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.passwordReqService.isGreaterThanEightChars(),
          this.passwordReqService.hasOneLowerCaseChar(),
          this.passwordReqService.hasOneUpperCaseChar(),
          this.passwordReqService.hasOneDigitChar(),
          this.passwordReqService.hasOneSpecialChar(),
          this.passwordReqService.passwordsMatch()
        ]
      ],
      agreeToTerms: [false, [Validators.required]]
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

}
