import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
export class PasswordResetComponent implements OnInit {
  /** The user's email address. */
  private email = '';

  /** The unique identifier used for validating a password reset. */
  private guid = '';

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
    private errorService: ErrorService,
    private route: ActivatedRoute
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
   * Checks for necessary query params.
   */
  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(first())
      .subscribe((params) => {
        this.email = params.get('email') as string;
        this.guid = params.get('guid') as string;
      }, (error) => {
        this.errorService.displayError(
          'The link you followed was invalid. Please double check the link in your email and try again.',
          error,
          true
        );
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
    this.userService.resetPassword(this.guid, this.email, this.passResetForm.value.password)
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
