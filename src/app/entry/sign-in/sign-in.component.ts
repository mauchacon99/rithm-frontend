import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { EmailLinkParams } from 'src/models';

/**
 * Component for signing into the system.
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  /** Whether the user entered invalid credentials. */
  invalidCredentials = false;

  /** Sign in form. */
  signInForm: FormGroup;

  /** Is it loading. */
  isLoading = false;

  constructor(
    public fb: FormBuilder,
    private popupService: PopupService,
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.route.queryParamMap
      .pipe(first())
      .subscribe((params) => {
        const type = params.get('type');
        const guid = params.get('guid');
        const email = params.get('email');

        // If type is there, but is missing data
        if (type && (!guid || !email)) {
          this.showInvalidLinkMessage(new Error('Missing GUID or email address'));
        }

        if (type === 'register') {
          // TODO: RIT-176
        } else if (type === 'forgot password') {
          // TODO: make forgot password service call
        }

      }, (error) => {
        this.showInvalidLinkMessage(error);
      });
  }

  /**
   * Displays a message to the user that the link was invalid.
   *
   * @param error The error that was encountered (this is not displayed to the user).
   */
  private showInvalidLinkMessage(error: Error): void {
    this.errorService.displayError(
      'The link you followed was invalid. Please double check the link in your email and try again.',
      error,
      true
    );
  }

  /**
   * Attempts to sign the user in using the provided credentials.
   */
  signIn(): void {
    this.isLoading = true;
    const formValues = this.signInForm.value;
    this.invalidCredentials = false;

    this.userService.signIn(formValues.email, formValues.password)
      .pipe(first())
      .subscribe(() => {
        this.router.navigateByUrl('dashboard');
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
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
