import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private fb: FormBuilder
  ) {
    this.forgotPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Send email to the address entered by user.
   */
  sendEmail(): void {
    // do the thing
  }

}
