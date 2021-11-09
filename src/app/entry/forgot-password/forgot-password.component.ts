import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
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
    private errorService: ErrorService,
    private popupService: PopupService,
    private router: Router
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
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.openAlert();
        }, error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            'Something went wrong and we were unable to send you an email. Please try again in a little while.',
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
      title: 'Request Sent',
      // eslint-disable-next-line max-len
      message: `Please check your email for instructions on how to reset your password. If you don't receive an email within 10 minutes, please double check that your entered email is correct and try again.`
    };

    this.popupService.alert(data).then(() => {
      this.router.navigate(['']);
    });
  }

}
