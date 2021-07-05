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
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { TermsConditionsComponent } from 'src/app/shared/terms-conditions-modal/terms-conditions-modal.component';
import { TermsAndConditionsService } from 'src/app/core/terms-conditions.service';
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

  /** Are password requirements visible. */
  passReqVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  /** Helper class for password requirements. */
  private passwordRequirements: PasswordRequirements;

  /** Show loading indicator while request is being made. */
  isLoading = false;

  /** Temp message for terms modal. */
  modalMessage = ``;

  /** Terms and conditions modal component. */
  termsAndConditionsComponent = TermsConditionsComponent;

  /** The subject data for terms and conditions data. */
  sub$ = new Subject();

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private popupService: PopupService,
    private router: Router,
    private dialog: MatDialog,
    private termsAndConditionsService: TermsAndConditionsService
  ) {
    this.passwordRequirements = new PasswordRequirements();

    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
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
      ],
      agreeToTerms: [false, [Validators.requiredTrue]]
    });
  }

  /**
   * Sets terms and conditions agreed or not.
   *
   */
  ngOnInit(): void {
    // eslint-disable-next-line rxjs/no-ignored-error
    this.termsAndConditionsService.currentAgreed$.pipe(takeUntil(this.sub$)).subscribe((agreed) => {
      this.signUpForm.get('agreeToTerms')?.setValue(agreed);
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
   * Attempts to create a new account with the provided form information.
   */
  createAccount(): void {
    this.isLoading = true;
    const formValues = this.signUpForm.value;
    this.userService.register(formValues.firstName, formValues.lastName, formValues.email, formValues.password)
      .pipe(first())
      .subscribe(() => {
        this.isLoading = false;
        this.openValidateEmailModal();
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        const errorMessage: string = error.error.error;

        if (errorMessage === 'This username has already been used.') {
          this.popupService.alert({
            title: 'Account Already Exists',
            message: 'An account has already been created for this email address. Try signing into this account instead.'
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

  /**
   * Open the terms and conditions modal.
   *
   * @param component The component to open.
   */
  openTerms(component: ComponentType<unknown>): void {
    this.dialog.open(component, {
      width: '90%',
      height: '76%',
      data: {
        title: 'Terms and Conditions',
        message: '',
        okButtonText: 'Agree',
        width: '90%'
      }
    });
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

}
