import { Component, OnInit } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/core/popup.service';
import { PasswordRequirements } from 'src/helpers/password-requirements';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogData } from 'src/models';
import { TermsConditionsService } from 'src/app/core/terms-conditions.service';
import { Subject } from 'rxjs';

/**
 * Component used for creating an account.
 */
@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent implements OnInit {
  /** Sign up form. */
  signUpForm: FormGroup;

  /** Helper class for password requirements. */
  private passwordRequirements: PasswordRequirements;

  /** Show loading indicator while request is being made. */
  isLoading = false;

  /** Temp message for terms modal. */
  modalMessage = ``;

  /** The subject data for terms and conditions data. */
  sub$ = new Subject();

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private popupService: PopupService,
    private router: Router,
    private termsConditionsService: TermsConditionsService
  ) {
    this.passwordRequirements = new PasswordRequirements();

    this.signUpForm = this.fb.group({
      userForm: this.fb.control(''),
      agreeToTerms: [false, [Validators.requiredTrue]]
    });
  }

  /**
   * Sets terms and conditions agreed or not.
   *
   */
  ngOnInit(): void {
    // eslint-disable-next-line rxjs/no-ignored-error
    this.termsConditionsService.currentAgreed$.pipe(takeUntil(this.sub$)).subscribe((agreed) => {
      this.signUpForm.get('agreeToTerms')?.setValue(agreed);
    });
  }

  /**
   * Attempts to create a new account with the provided form information.
   */
  createAccount(): void {
    this.isLoading = true;
    const formValues = this.signUpForm.value.userForm;
    this.userService.register(formValues.firstName, formValues.lastName, formValues.email, formValues.password)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        this.openValidateEmailModal();
      }, (error: unknown) => {
        this.isLoading = false;

        if (!(error instanceof HttpErrorResponse)) {
          throw new Error('Unknown error');
        }
        const errorMessage: string = error.error.error;

        if (errorMessage === 'This username has already been used.') {
          this.popupService.alert({
            title: 'Account Already Exists',
            message: 'An account has already been created for this email address. Try signing into this account instead.'
          });
        } else {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Open the terms and conditions modal.
   */
  async openTerms(): Promise<void> {
    let message = '';

    this.isLoading = true;
    this.userService.getTermsConditions()
      .pipe(first())
      .subscribe((termsConditions) => {
        if (termsConditions) {
          message = termsConditions;
          this.isLoading = false;
        }
      }, (error: unknown) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });

    const agreeTerms = await this.popupService.terms({
      title: 'Terms and Conditions',
      message: message,
      okButtonText: 'Agree',
      showAgreeButton: true
    });

    this.termsConditionsService.setAgreed(agreeTerms);
  }

  /**
   * Open the alert to validate their email address.
   */
  openValidateEmailModal(): void {
    const data: DialogData = {
      title: 'Validate your email address',
      message: 'Almost there! Please check your email for a link to validate your Rithm account.'
    };

    this.popupService.alert(data).then(() => {
      this.router.navigate(['']);
    });
  }

  /**
   * Formgroup for userForm.
   *
   * @returns SignUpForm property userForm.
   */
  get userForm(): FormGroup {
    return this.signUpForm.get('userForm') as FormGroup;
  }
}
