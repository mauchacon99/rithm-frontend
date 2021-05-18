import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component used for initiating a password reset.
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  /** Forgot password form. */
  forgotPassForm: FormGroup;

  /** Show loading indicator while request is being made. */
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService
  ) {
    this.forgotPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Send email to the address entered by user.
   */
  sendEmail(): void {
    this.isLoading = true;
    this.userService.sendPasswordResetEmail(this.forgotPassForm.value.email)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        // TODO: RIT-283
      }, (error) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong and we were unable to send you an email. Please try again in a little while.',
          error,
          true
        );
      });
  }

}
