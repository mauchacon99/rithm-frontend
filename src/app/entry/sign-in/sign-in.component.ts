import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { EmailLinkParams } from 'src/helpers';
import { EmailLinkType } from 'src/models';

/**
 * Component for signing into the system.
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
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
      password: ['', Validators.required],
    });
  }

  /**
   * Checks for query params and makes necessary request if present.
   */
  ngOnInit(): void {
    this.route.queryParamMap.pipe(first()).subscribe({
      next: (params) => {
        const emailLinkParams = new EmailLinkParams(params);

        if (emailLinkParams.type && !emailLinkParams.valid) {
          this.showInvalidLinkMessage(
            new Error('Missing GUID or email address')
          );
        } else {
          if (emailLinkParams.type === EmailLinkType.Register) {
            this.validateEmail(
              emailLinkParams.guid as string,
              emailLinkParams.email as string
            );
          } else if (emailLinkParams.type === EmailLinkType.ForgotPassword) {
            this.router.navigate(['password-reset'], {
              queryParams: {
                type: emailLinkParams.type,
                guid: emailLinkParams.guid,
                email: emailLinkParams.email,
              },
            });
          }
        }
      },
      error: (error: unknown) => {
        this.showInvalidLinkMessage(error);
      },
    });
  }

  /**
   * Displays a message to the user that the link was invalid.
   *
   * @param error The error that was encountered (this is not displayed to the user).
   */
  private showInvalidLinkMessage(error: unknown): void {
    this.errorService.displayError(
      'The link you followed was invalid. Please double check the link in your email and try again.',
      error
    );
  }

  /**
   * Attempts to sign the user in using the provided credentials.
   */
  signIn(): void {
    this.isLoading = true;
    const formValues = this.signInForm.value;
    this.invalidCredentials = false;

    this.userService
      .signIn(formValues.email, formValues.password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigateByUrl('dashboard');
        },
        error: (error: unknown) => {
          this.isLoading = false;

          if (!(error instanceof HttpErrorResponse)) {
            throw new Error('Unknown error occurred');
          }
          const errorMessage: string = error.error.error;

          if (errorMessage.includes('Invalid')) {
            this.invalidCredentials = true;
          } else if (errorMessage.includes('verified')) {
            this.popupService.alert({
              title: 'Unverified Email',
              message:
                'You will need to verify your email before you can sign in. Please check your email for instructions.',
            });
          } else if (
            errorMessage.includes('Must be apart of an Organization.')
          ) {
            this.popupService.alert({
              title: 'No Organization for Account',
              message:
                'Your account does not belong to any organizations. In order to get access, have someone invite you to their organization.',
            });
          } else {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          }
        },
      });
  }

  /**
   * Attempts to validate the user's email address using a GUID.
   *
   * @param guid The identifier used to validate the email address.
   * @param email The email address for the user.
   */
  private validateEmail(guid: string, email: string): void {
    this.isLoading = true;
    this.userService
      .validateEmail(guid, email)
      .pipe(first())
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.popupService.notify('Email successfully verified');
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we were unable to validate your email address. ' +
              "We've made note of this. Please try again in a little while.",
            error
          );
        },
      });
  }
}
