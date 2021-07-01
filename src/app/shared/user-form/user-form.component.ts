import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { ControlContainer, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/core/popup.service';
import { PasswordRequirements } from 'src/helpers/password-requirements';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogData } from 'src/models';

/**
 * Reusable form component that gets a user's first and last names, email, and password.
 */
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  /** Receive the FormGroup data from parent. */
  public signUpForm: FormGroup;

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

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private popupService: PopupService,
    private router: Router,
    private controlContainer: ControlContainer
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
   * Sets the FormGroup to be equal to the parent formGroup.
   */
  ngOnInit(): void {
    this.signUpForm = <FormGroup>this.controlContainer.control;
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
