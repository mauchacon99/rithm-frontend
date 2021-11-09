import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
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
  private passwordRequirements: PasswordRequirements;

  /** Password reset form. */
  passResetForm: FormGroup;

  /** Are password requirements visible. */
  passReqVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  /** Show loading indicator while request is being made. */
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private router: Router
  ) {
    this.passwordRequirements = new PasswordRequirements();
    this.passResetForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          this.passwordRequirements.isGreaterThanEightChars(),
          this.passwordRequirements.hasOneLowerCaseChar(),
          this.passwordRequirements.hasOneUpperCaseChar(),
          this.passwordRequirements.hasOneDigitChar(),
          this.passwordRequirements.hasOneSpecialChar()
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.passwordRequirements.isGreaterThanEightChars(),
          this.passwordRequirements.hasOneLowerCaseChar(),
          this.passwordRequirements.hasOneUpperCaseChar(),
          this.passwordRequirements.hasOneDigitChar(),
          this.passwordRequirements.hasOneSpecialChar(),
          this.passwordRequirements.passwordsMatch()
        ]
      ]
    });
  }

  /**
   * Checks for necessary query params.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParamMap
      .pipe(first())
      .subscribe({
        next: (params) => {
          this.isLoading = false;
          this.email = params.get('email') as string;
          this.guid = params.get('guid') as string;
        }, error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            'The link you followed was invalid. Please double check the link in your email and try again.',
            error
          );
        }
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
    this.isLoading = true;
    this.userService.resetPassword(this.guid, this.email, this.passResetForm.value.password)
    .pipe(first())
    .subscribe({
      next: () => {
        this.isLoading = false;
        this.openAlert();
      }, error: (error: unknown) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong and we were unable to reset your password. Please try again in a little while.',
          error
        );
      }
    });
  }

  /**
   * Open the alert that tells user to check email.
   */
   openAlert(): void {
    const data = {
      title: 'Success',
      message: `Your password has been reset. Please sign in with your new password.`
    };

    this.popupService.alert(data).then(() => {
      this.router.navigate(['']);
    });
  }
}
