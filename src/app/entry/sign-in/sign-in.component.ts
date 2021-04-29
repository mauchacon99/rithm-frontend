import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component for signing into the system.
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  /** Whether the user entered invalid credentials. */
  invalidCredentials = false;

  /** Sign in form. */
  signInForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private popupService: PopupService,
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Attempts to sign the user in using the provided credentials.
   */
  signIn(): void {
    const formValues = this.signInForm.value;
    this.invalidCredentials = false;

    this.userService.signIn(formValues.email, formValues.password)
      .pipe(first())
      .subscribe(() => {
        this.router.navigateByUrl('dashboard');
      }, (error: HttpErrorResponse) => {
        const errorMessage: string = error.error.error;

        if (errorMessage.includes('Invalid')) {
          this.invalidCredentials = true;
        } else if (errorMessage.includes('verified')) {
          this.popupService.alert({
            title: 'Unverified Email',
            message: 'You will need to verify your email before you can sign in. Please check your email for instructions.'
          });
        } else {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error,
            true
          );
        }
      });
  }

}
