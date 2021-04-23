import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Component for signing into the system.
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm: FormGroup;

  constructor ( ) {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  /**
   * Attempts to sign the user in using the provided credentials.
   */
  signIn(): void {
    // Sign the user in
  }

}
