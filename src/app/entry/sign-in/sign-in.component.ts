import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
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
  /** Sign in form. */
  signInForm: FormGroup;

  isLoading = false;

  constructor(
    public fb: FormBuilder,
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
    this.isLoading = true;
    const formValues = this.signInForm.value;

    this.userService.signIn(formValues.email, formValues.password)
    .pipe(first())
    .subscribe(() => {
      this.router.navigateByUrl('dashboard');
    }, (error) => {
      this.isLoading = false;
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error,
        true
      );
    });
  }

}
